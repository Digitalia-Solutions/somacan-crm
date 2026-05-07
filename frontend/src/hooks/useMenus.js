import { useEffect, useState } from 'react';
import { getMenu, getMenus } from '../lib/api';

/**
 * Fetch a single menu by name (public).
 * @param {string} name
 * @returns {{ menu: object|null, loading: boolean, error: Error|null }}
 */
export function useMenu(name) {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!name) return;

    let active = true;

    setLoading(true);
    setError(null);

    getMenu(name)
      .then((data) => {
        if (active) setMenu(data);
      })
      .catch((err) => {
        if (active) setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [name]);

  return { menu, loading, error };
}

/**
 * Fetch all menus (admin).
 * @returns {{ menus: Array, loading: boolean, error: Error|null, refetch: Function }}
 */
export function useAdminMenus() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function fetchMenus() {
    setLoading(true);
    setError(null);

    getMenus()
      .then((data) => setMenus(Array.isArray(data) ? data : []))
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    getMenus()
      .then((data) => {
        if (active) setMenus(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (active) setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  return { menus, loading, error, refetch: fetchMenus };
}
