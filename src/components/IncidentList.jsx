import React, { useState, useEffect } from 'react';
import { MapPin, FileText, Image, Calendar, Grid, AlignJustify, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IncidentList = () => {
  const [selectedType, setSelectedType] = useState('');
  const [incidents, setIncidents] = useState([]);
  const navigate = useNavigate();

  // Cargar incidentes desde localStorage al montar el componente
  useEffect(() => {
    const loadedIncidents = JSON.parse(localStorage.getItem('reports') || '[]');
    console.log('Loaded incidents:', loadedIncidents);
    setIncidents(loadedIncidents);
  }, []);

  // Obtener tipos de incidentes únicos
  const incidentTypes = ['Público alumbrado', 'Otros'];

  // Filtrar incidentes por tipo seleccionado
  const filteredIncidents = selectedType
    ? incidents.filter(incident => incident.type === selectedType)
    : incidents;

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabecera */}
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

      {/* Barra de navegación */}
      <div className="bg-white border-b">
        {/* ... código existente de la barra de navegación ... */}
      </div>

      {/* Contenido principal */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filtro por tipo de incidente */}
        <div className="mb-6">
          <select 
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">Todos los tipos</option>
            {incidentTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Grid de incidentes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIncidents.length === 0 ? (
            <div className="col-span-full text-center py-8 bg-white rounded-lg border">
              <p className="text-gray-500">No hay incidentes para mostrar</p>
            </div>
          ) : (
            filteredIncidents.map((incident) => (
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
                  <h3 className="font-semibold text-lg mb-2">{incident.title}</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Tipo:</span> {incident.type}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Descripción:</span> {incident.description}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Ubicación:</span> {incident.location}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Fecha:</span> {new Date(incident.date).toLocaleDateString()}
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentList;