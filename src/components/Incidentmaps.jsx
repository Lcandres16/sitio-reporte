import React, { useState } from 'react';
import { ArrowLeft, Copy, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IncidentTracker = () => {
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState(null);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Error al obtener la ubicación. Por favor, active el GPS.");
        }
      );
    } else {
      alert("Geolocalización no está soportada en este navegador.");
    }
  };

  const handleCopyLocation = () => {
    if (currentLocation) {
      const locationString = `${currentLocation.lat}, ${currentLocation.lng}`;
      navigator.clipboard.writeText(locationString)
        .then(() => alert("Ubicación copiada al portapapeles"))
        .catch(err => console.error("Error al copiar:", err));
    }
  };

  const handleCreateReport = () => {
    if (currentLocation) {
      navigate('IncidentReports', {  // Cambia esta ruta para que coincida con tu configuración
        state: { location: currentLocation } 
      });
    } else {
      alert("Por favor, obtén primero la ubicación.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header modificado para coincidir con el estilo anterior */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={handleGoBack}
              className="bg-gray-100 p-2 rounded-lg hover:bg-gray-200 mr-2"
              title="Back"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="font-bold text-xl text-gray-800">
              Ubicación del Incidente
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Mapa y Controles */}
        <div className="space-y-6">
          {/* Contenedor del Mapa */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="relative w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden">
              {/* Aquí iría la integración real del mapa */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={handleGetLocation}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Obtener Ubicación Actual
                </button>
              </div>
              
              {currentLocation && (
                <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Lat: {currentLocation.lat.toFixed(6)}, 
                      Lng: {currentLocation.lng.toFixed(6)}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopyLocation}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Copiar Ubicación"
                      >
                        <Copy className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={handleCreateReport}
                        className="p-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Crear Informe"
                      >
                        <FileText className="w-5 h-5 text-blue-600" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Instrucciones */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Instrucciones
            </h2>
            <ol className="space-y-3 text-gray-600">
              <li>1. Haz clic en "Obtener Ubicación Actual" para detectar tu posición</li>
              <li>2. Una vez detectada, podrás copiar las coordenadas o crear un informe</li>
              <li>3. Usa el botón de copiar para guardar la ubicación al portapapeles</li>
              <li>4. Selecciona crear informe para continuar con el registro del incidente</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IncidentTracker;