// ProtectedAdminRoute.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedAdminRoute = ({ children }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  if (!isAuthenticated() || !isAdmin()) {
    return null;
  }

  return children;
};

export default ProtectedAdminRoute;