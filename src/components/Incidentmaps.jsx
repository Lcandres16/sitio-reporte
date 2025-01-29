import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, FileText, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Importar las imágenes localmente
import markerIcon2x from '../assets/images/marker-icon-2x.png';
import markerIcon from '../assets/images/marker-icon.png';
import markerShadow from '../assets/images/marker-shadow.png';

// Configurar los iconos por defecto de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

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
  const [address, setAddress] = useState(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [addressError, setAddressError] = useState(false);

  useEffect(() => {
    handleGetLocation();
  }, []);

  const getAddressFromCoordinates = async (lat, lng) => {
    setIsLoadingAddress(true);
    setAddressError(false);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      
      if (data.error) {
        throw new Error('No se pudo obtener la dirección');
      }
      
      setAddress(data.display_name);
      return data.display_name;
    } catch (error) {
      console.error("Error obteniendo la dirección:", error);
      setAddressError(true);
      setAddress(null);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCurrentLocation(newLocation);
          await getAddressFromCoordinates(newLocation.lat, newLocation.lng);
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

  const handleRefreshAddress = async () => {
    if (currentLocation) {
      await getAddressFromCoordinates(currentLocation.lat, currentLocation.lng);
    }
  };

  const handleCopyLocation = () => {
    if (currentLocation && address) {
      const locationString = `Dirección: ${address}\nCoordenadas: ${currentLocation.lat}, ${currentLocation.lng}`;
      navigator.clipboard.writeText(locationString)
        .then(() => alert("Ubicación y dirección copiadas al portapapeles"))
        .catch(err => console.error("Error al copiar:", err));
    }
  };

  const handleCreateReport = () => {
    if (currentLocation) {
      navigate('IncidentReports', {
        state: { 
          location: currentLocation,
          address: address
        }
      });
    } else {
      alert("Por favor, obtén primero la ubicación.");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
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
              <div className="mt-4 space-y-4">
                {/* Sección de coordenadas */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
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

                {/* Sección de dirección */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-800">Dirección</h3>
                    <button
                      onClick={handleRefreshAddress}
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      disabled={isLoadingAddress}
                      title="Actualizar dirección"
                    >
                      <RefreshCw className={`w-5 h-5 text-gray-600 ${isLoadingAddress ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                  
                  {isLoadingAddress ? (
                    <p className="text-sm text-gray-500">Obteniendo dirección...</p>
                  ) : addressError ? (
                    <div className="text-sm text-red-600">
                      Error al obtener la dirección. 
                      <button 
                        onClick={handleRefreshAddress}
                        className="text-blue-600 hover:text-blue-700 ml-2"
                      >
                        Intentar de nuevo
                      </button>
                    </div>
                  ) : address ? (
                    <p className="text-sm text-gray-600">{address}</p>
                  ) : (
                    <p className="text-sm text-gray-500">No se ha podido obtener la dirección</p>
                  )}
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
              <li>3. Las coordenadas y la dirección aparecerán debajo del mapa</li>
              <li>4. Si la dirección no es correcta, puedes actualizarla con el botón de refrescar</li>
              <li>5. Usa el botón de copiar para guardar la ubicación o crea un informe</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IncidentTracker;