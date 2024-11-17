import React from 'react';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MainDashboard = () => {
  const navigate = useNavigate();

  // Función para manejar la navegación según el botón
  const handleNavigation = (id) => {
    switch(id) {
      case 1: // Reportar incidente
        navigate('/report');
        break;
      case 2: // Mapa de incidentes
        navigate('location')
        break;
      case 3: // Lista de reportes
        navigate('/incidentlist')
        break;
      case 4: // Contacto de autoridades
        // Aquí irá la navegación a contactos cuando se implemente
        break;
      default:
        break;
    }
  };
  
  const sections = [
    {
      id: 1,
      title: "Reportar incidente",
      subtitle: "Reportar Incidente",
      description: "Ayúdanos a mejorar la ciudad reportando incidentes.",
      image: "/api/placeholder/400/250",
      buttonText: "Reportar",
      category: "Reportar Incidente",
      bgColor: "bg-blue-50",
      buttonColor: "bg-blue-500 hover:bg-blue-600"
    },
    // ... resto de las secciones sin cambios
    {
      id: 2,
      title: "Mapa de incidentes",
      subtitle: "Mapa de Incidentes",
      description: "Descubre incidentes reportados en tu área.",
      image: "/api/placeholder/400/250",
      buttonText: "Ver mapa",
      category: "Mapa de Incidentes",
      bgColor: "bg-green-50",
      buttonColor: "bg-green-500 hover:bg-green-600"
    },
    {
      id: 3,
      title: "Lista de reportes",
      subtitle: "Lista de reportes",
      description: "Explora y sigue el estado de los reportes.",
      image: "/api/placeholder/400/250",
      buttonText: "Ver lista",
      category: "Lista de Reportes",
      bgColor: "bg-purple-50",
      buttonColor: "bg-purple-500 hover:bg-purple-600"
    },
    {
      id: 4,
      title: "Contacto de autoridades",
      subtitle: "Contacto de autoridades",
      description: "Encuentra información de contacto de autoridades locales.",
      image: "/api/placeholder/400/250",
      buttonText: "Contactar",
      category: "Contacto de Autoridades",
      bgColor: "bg-orange-50",
      buttonColor: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header sin cambios */}
      <header className="border-b bg-white shadow-sm">
        {/* ... código del header ... */}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Reporte Ciudadano</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Selecciona una opción para empezar a contribuir con tu comunidad
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section) => (
            <div 
              key={section.id} 
              className={`group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${section.bgColor}`}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity" />
              </div>
              <div className="p-8">
                <div className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 bg-white bg-opacity-50">
                  {section.category}
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-gray-800">
                  {section.subtitle}
                </h3>
                <p className="text-gray-600 mb-6 line-clamp-2">
                  {section.description}
                </p>
                <button 
                  onClick={() => handleNavigation(section.id)}
                  className={`${section.buttonColor} text-white px-6 py-3 rounded-lg font-medium transform hover:-translate-y-0.5 transition-all duration-200`}
                >
                  {section.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer sin cambios */}
      <footer className="bg-white border-t mt-16">
        {/* ... código del footer ... */}
      </footer>
    </div>
  );
};

export default MainDashboard;