import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Corregir el problema del ícono de marcador en Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente para actualizar la vista del mapa
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 15);
    }
  }, [center, map]);
  return null;
}

const IncidentTracker = () => {
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    handleGetLocation();
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(newLocation);
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
      navigate('IncidentReports', {
        state: { location: currentLocation }
      });
    } else {
      alert("Por favor, obtén primero la ubicación.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
              {/* Solo renderizar el mapa si tenemos una ubicación */}
              {currentLocation ? (
                <MapContainer
                  center={currentLocation}
                  zoom={15}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={currentLocation} />
                  <MapUpdater center={currentLocation} />
                </MapContainer>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <button
                    onClick={handleGetLocation}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Obtener Ubicación Actual
                  </button>
                </div>
              )}
              
              <div className="absolute top-4 left-4 right-4">
                <button
                  onClick={handleGetLocation}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Actualizar Ubicación Actual
                </button>
              </div>
            </div>
            
            {currentLocation && (
              <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
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

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Instrucciones
            </h2>
            <ol className="space-y-3 text-gray-600">
              <li>1. El mapa mostrará automáticamente tu ubicación actual</li>
              <li>2. Puedes actualizar tu ubicación usando el botón superior</li>
              <li>3. Las coordenadas exactas aparecerán debajo del mapa</li>
              <li>4. Usa el botón de copiar para guardar la ubicación o crea un informe</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IncidentTracker;