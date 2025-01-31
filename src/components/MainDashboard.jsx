import React from 'react';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MainDashboard = () => {
  const navigate = useNavigate();

  const handleNavigation = (id) => {
    switch(id) {
      case 1:
        navigate('/report');
        break;
      case 2:
        navigate('/incidentmaps')
        break;
      case 3:
        navigate('/incidentlist')
        break;
      case 4:
        navigate('/media')
        break;
      default:
        break;
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };
  
  const sections = [
    {
      id: 1,
      title: "Reportar incidente",
      subtitle: "Reportar Incidente",
      description: "Ayúdanos a mejorar la ciudad reportando incidentes.",
      image: "/images/maps",
      buttonText: "Reportar",
      category: "Reportar Incidente",
      bgColor: "bg-blue-50",
      buttonColor: "bg-blue-500 hover:bg-blue-600"
    },
    {
      id: 2,
      title: "Mapa para la Ubicación de Incidentes",
      subtitle: "Mapa para la Ubicación de Incidentes",
      description: "Copia la dirección del incidente para generar tu reporte.",
      image: "/images/incident-maps.jpg",
      buttonText: "Ver mapa",
      category: "Mapa para la Ubicación de Incidentes",
      bgColor: "bg-green-50",
      buttonColor: "bg-green-500 hover:bg-green-600"
    },
    {
      id: 3,
      title: "Lista de Incidentes",
      subtitle: "Lista de Incidentes",
      description: "Explora todos los incidentes reportados por sus categorias.",
      image: "/images/incident-list.jpg",
      buttonText: "Ver lista",
      category: "Lista de Incidentes",
      bgColor: "bg-purple-50",
      buttonColor: "bg-purple-500 hover:bg-purple-600"
    },
    {
      id: 4,
      title: "Contacto de autoridades",
      subtitle: "Contacto de autoridades",
      description: "Encuentra información de contacto de autoridades locales.",
      image: "/images/authorities-contact.jpg",
      buttonText: "Contactar",
      category: "Contacto de Autoridades",
      bgColor: "bg-orange-50",
      buttonColor: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100/50 to-white">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl cursor-pointer">
              Reporte Ciudadano
            </span>
          </div>
          <button 
            onClick={handleHomeClick}
            className="px-4 py-2 bg-white-100 text-gray-700 rounded-lg hover:bg-blue-100 flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Inicio
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Reporte Ciudadano</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Selecciona una opción para empezar a contribuir con tu comunidad
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => (
            <div 
              key={section.id} 
              className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden ${section.bgColor}`}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-30 transition-opacity" />
              </div>
              <div className="p-4">
                <div className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 bg-white bg-opacity-50">
                  {section.category}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {section.subtitle}
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  {section.description}
                </p>
                <button 
                  onClick={() => handleNavigation(section.id)}
                  className={"flex flex-col items-center justify-center gap-2 p-4 bg-white border rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"}
                >
                  {section.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MainDashboard;