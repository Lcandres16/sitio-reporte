// AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials),
        credentials: 'include'
      });

      const data = await response.json();
      
      if (response.ok) {
        const userData = {
          ...data.user,
          isAdmin: false
        };
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      } else {
        return {
          success: false,
          message: data.message || 'Error en la autenticación'
        };
      }
    } catch (error) {
      console.error('Error en la petición:', error);
      return {
        success: false,
        message: 'Error de conexión. Por favor, intente más tarde.'
      };
    }
  };

  const adminLogin = async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials),
        credentials: 'include'
      });
  
      const data = await response.json();
      
      if (response.ok && data.success) {
        const userData = {
          ...data.user,
          isAdmin: true
        };
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      } else {
        return {
          success: false,
          message: data.message || 'Acceso no autorizado'
        };
      }
    } catch (error) {
      console.error('Error en el login de admin:', error);
      return {
        success: false,
        message: 'Error de conexión. Por favor, intente más tarde.'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: userData.name,
          email: userData.email,
          password: userData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        const userData = {
          ...data.user,
          isAdmin: false
        };
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return { success: true };
      } else {
        return {
          success: false,
          message: data.message || 'Error en el registro'
        };
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      return {
        success: false,
        message: 'Error de conexión. Por favor, intente más tarde.'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('token');
  };

  const isAdmin = () => {
    return user?.isAdmin === true;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      adminLogin, 
      register, 
      logout, 
      isAuthenticated,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
