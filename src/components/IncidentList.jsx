import React, { useState } from 'react';
import { MapPin, FileText, Image, Calendar, Grid, AlignJustify, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IncidentList = () => {
  const [selectedType, setSelectedType] = useState('');
  const navigate = useNavigate();

  const incidents = [
    {
      id: 1,
      type: "Servicios Básicos",
      description: "Falta de agua potable",
      location: "Calle Principal y 5ta Avenida",
      date: "2024-03-15",
      status: "En Investigación",
      severity: "Medio",
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      type: "Emergencias",
      description: "Incendio en local comercial",
      location: "Parque Central",
      date: "2024-03-14",
      status: "Resuelto",
      severity: "Alto",
      image: "/api/placeholder/300/200"
    },
    {
      id: 3,
      type: "Servicios Básicos",
      description: "Corte de energía eléctrica",
      location: "Boulevard Oeste",
      date: "2024-03-13",
      status: "En Proceso",
      severity: "Medio",
      image: "/api/placeholder/300/200"
    }
  ];

  const filteredIncidents = selectedType 
    ? incidents.filter(incident => incident.type === selectedType)
    : incidents;

  const handleHomeClick = () => {
    navigate('/');  // Navega a la ruta raíz definida en App.jsx
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl cursor-pointer">
              Reporte de Incidentes
            </span>
          </div>
          <button 
            onClick={handleHomeClick}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Inicio
          </button>
        </div>
      </header>

      {/* Navigation Bar */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center px-4">
            <button className="flex flex-col items-center py-3 px-6 hover:bg-gray-50 text-gray-700">
              <MapPin className="w-5 h-5 mb-1" />
              <span className="text-xs">Location</span>
            </button>
            <button className="flex flex-col items-center py-3 px-6 hover:bg-gray-50 text-gray-700">
              <FileText className="w-5 h-5 mb-1" />
              <span className="text-xs">Incident</span>
            </button>
            <button className="flex flex-col items-center py-3 px-6 hover:bg-gray-50 text-gray-700">
              <Image className="w-5 h-5 mb-1" />
              <span className="text-xs">Media</span>
            </button>
            <button className="flex flex-col items-center py-3 px-6 hover:bg-gray-50 text-gray-700">
              <Calendar className="w-5 h-5 mb-1" />
              <span className="text-xs">Date & Time</span>
            </button>
            <button className="flex flex-col items-center py-3 px-6 hover:bg-gray-50 text-gray-700">
              <Grid className="w-5 h-5 mb-1" />
              <span className="text-xs">Category</span>
            </button>
            <button className="flex flex-col items-center py-3 px-6 hover:bg-gray-50 text-gray-700">
              <AlignJustify className="w-5 h-5 mb-1" />
              <span className="text-xs">Description</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Single Filter */}
        <div className="mb-6">
          <select 
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">Todos los Tipos</option>
            <option value="Servicios Básicos">Servicios Básicos</option>
            <option value="Emergencias">Emergencias</option>
          </select>
        </div>

        {/* Incidents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIncidents.map((incident) => (
            <div 
              key={incident.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <img 
                src={incident.image} 
                alt={incident.type}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{incident.type}</h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Descripción:</span> {incident.description}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Ubicación:</span> {incident.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Fecha:</span> {incident.date}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      incident.status === "Resuelto" 
                        ? "bg-green-100 text-green-800"
                        : incident.status === "En Proceso"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {incident.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      incident.severity === "Alto"
                        ? "bg-red-100 text-red-800"
                        : incident.severity === "Medio"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-green-100 text-green-800"
                    }`}>
                      {incident.severity}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IncidentList;