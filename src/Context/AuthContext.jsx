import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (credentials) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        }),
        credentials: 'include'
      });

      const data = await response.json();
      
      if (response.ok) {
        // Guardar el token y la información del usuario
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else {
        console.error('Error de login:', data.message);
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
      const response = await fetch('http://localhost:3000/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password
        }),
        credentials: 'include'
      });

      const data = await response.json();
      
      if (response.ok && data.user.isAdmin) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({...data.user, isAdmin: true}));
        setUser({...data.user, isAdmin: true});
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
      const response = await fetch('http://localhost:3000/api/auth/register', {
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
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
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
    return !!localStorage.getItem('token');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      adminLogin, 
      register, 
      logout, 
      isAuthenticated 
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