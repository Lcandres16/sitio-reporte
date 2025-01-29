import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/app');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      if (!formData.email || !formData.password) {
        setError('Please fill in all required fields');
        return;
      }
  
      if (isRegistering && !formData.name) {
        setError('Name is required for registration');
        return;
      }
  
      const authResult = isRegistering 
        ? await register(formData)
        : await login(formData);
  
      if (authResult.success) {
        navigate('/'); // Changed from '/dashboard' to '/'
      } else {
        setError(authResult.message || 'Authentication failed');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8"></h1>
        <p className="text-gray-600 mb-8 text-center">
          
        </p>
        
        <div className="w-full max-w-md transform transition-all hover:scale-105">
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-8 pt-8 pb-6 bg-gradient-to-b from-[#98f5e1] to-transparent">
              <div className="flex justify-center">
                <svg 
                  className="w-16 h-16 text-gray-800" 
                  aria-hidden="true" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z" 
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h2 className="mt-4 text-center text-3xl font-bold text-gray-900">
                {isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}
              </h2>
            </div>

            <div className="px-8 py-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                )}

                {isRegistering && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Nombre
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required={isRegistering}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#98f5e1] focus:outline-none focus:ring-[#98f5e1] sm:text-sm"
                      placeholder="Nombre completo"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#98f5e1] focus:outline-none focus:ring-[#98f5e1] sm:text-sm"
                    placeholder="correo@ejemplo.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-[#98f5e1] focus:outline-none focus:ring-[#98f5e1] sm:text-sm"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#98f5e1] hover:bg-[#7fefe2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#98f5e1] transition-colors duration-200"
                  >
                    {isRegistering ? 'Registrarse' : 'Iniciar sesión'}
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError('');
                    setFormData({
                      email: '',
                      password: '',
                      name: ''
                    });
                  }}
                  className="text-sm text-[#4a9e8c] hover:text-[#3d8574]"
                >
                  {isRegistering
                    ? '¿Ya tienes cuenta? Inicia sesión'
                    : '¿No tienes cuenta? Regístrate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;