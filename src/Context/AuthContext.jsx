import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (credentials) => {
    try {
      // Simulated authentication (replace with actual API call)
      const mockUser = {
        email: credentials.email,
        name: credentials.name || 'User',
        token: 'mock-token-' + Date.now()
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      return {
        success: true,
        message: 'Login successful',
        user: mockUser
      };

      // Uncomment and modify the following when you have a real backend
      /*
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      const userInfo = {
        email: credentials.email,
        token: data.token,
        name: data.name
      };

      localStorage.setItem('user', JSON.stringify(userInfo));
      setUser(userInfo);

      return {
        success: true,
        message: 'Login successful',
        user: userInfo
      };
      */

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'An error occurred during login'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;