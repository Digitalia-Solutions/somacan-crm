import { Navigate, useLocation } from 'react-router-dom';
import { ADMIN_STORAGE_KEY } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function AdminAccessRoute({ children }) {
  const { isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fcfaf7] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-t-2 border-stone-400 animate-spin" />
      </main>
    );
  }

  const hasApiKey = Boolean(window.localStorage.getItem(ADMIN_STORAGE_KEY));

  if (!isAdmin && !hasApiKey) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
