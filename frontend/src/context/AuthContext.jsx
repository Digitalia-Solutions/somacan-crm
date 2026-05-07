import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, loginUser, registerUser, updateProfile as updateProfileRequest } from '../lib/api';

export const AUTH_STORAGE_KEY = 'somacan-auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem(AUTH_STORAGE_KEY) || 'null')?.token || null;
    } catch {
      return null;
    }
  });
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem(AUTH_STORAGE_KEY) || 'null')?.user || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      setLoading(false);
      return;
    }

    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ token, user }));
  }, [token, user]);

  useEffect(() => {
    if (!token) return;

    let active = true;

    getCurrentUser()
      .then((data) => {
        if (active) {
          setUser(data.user);
        }
      })
      .catch(() => {
        if (active) {
          setToken(null);
          setUser(null);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [token]);

  const login = useCallback(async (payload) => {
    const data = await loginUser(payload);
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const data = await registerUser(payload);
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setLoading(false);
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }, []);

  const acceptAuthPayload = useCallback((data) => {
    setToken(data.token);
    setUser(data.user);
    setLoading(false);
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const data = await updateProfileRequest(payload);
    setUser(data.user);
    return data;
  }, []);

  const value = useMemo(() => ({
    token,
    user,
    loading,
    isAuthenticated: Boolean(token && user),
    isAdmin: Boolean(token && user?.role === 'admin'),
    login,
    register,
    logout,
    acceptAuthPayload,
    updateProfile,
    setUser,
  }), [token, user, loading, login, register, logout, acceptAuthPayload, updateProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
