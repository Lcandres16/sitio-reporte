import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, FileText, RefreshCw } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon2x from '../assets/images/marker-icon-2x.png';
import markerIcon from '../assets/images/marker-icon.png';
import markerShadow from '../assets/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function MapUpdater({ center, onClick }) {
  const map = useMap();
  
  useMapEvents({
    click: (e) => {
      onClick(e.latlng);
    },
  });

  useEffect(() => {
    if (center) {
      map.setView(center, 15);
    }
  }, [center, map]);
  
  return null;
}

const IncidentTracker = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [clickPosition, setClickPosition] = useState(null);

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

  const handleMapClick = async (latlng) => {
    setCurrentLocation(latlng);
    setClickPosition(latlng); // Store the click position for popup
    setShowPopup(true);
    await getAddressFromCoordinates(latlng.lat, latlng.lng);
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
          setClickPosition(newLocation); // Set initial position for popup
          setShowPopup(false); // Don't show popup on initial location
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
    if (currentLocation) {
      const locationString = `${currentLocation.lat.toFixed(6)},${currentLocation.lng.toFixed(6)}`;
      navigator.clipboard.writeText(locationString)
        .then(() => alert("Coordenadas copiadas al portapapeles"))
        .catch(err => console.error("Error al copiar:", err));
    }
  };

  const handleCreateReport = () => {
    if (currentLocation) {
      // Create coordinates string for consistency
      const coordinatesString = `${currentLocation.lat.toFixed(6)},${currentLocation.lng.toFixed(6)}`;
      
      // Log what we're sending to help with debugging
      console.log("Sending to report page:", {
        location: currentLocation,
        address: address,
        coordinates: coordinatesString
      });
      
      // Navigate with all data properly formatted
      navigate('/report', {
        state: { 
          location: {
            lat: currentLocation.lat,
            lng: currentLocation.lng
          },
          address: address,
          coordinates: coordinatesString
        }
      });
    } else {
      alert("Por favor, selecciona primero una ubicación en el mapa.");
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-100 to-white">
      <header className="bg-white/100 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={handleGoBack}
              className="p-2 rounded-lg hover:bg-gray-100 mr-2"
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
          <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-shadow border-[0.5px] p-4">
            <div className="relative w-full aspect-square md:aspect-video rounded-xl overflow-hidden border">
              {currentLocation ? (
                <MapContainer
                  center={currentLocation}
                  zoom={15}
                  style={{ height: '100%', width: '100%', position: 'relative' }}
                  className="z-10"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={currentLocation} />
                  {showPopup && clickPosition && (
                    <Popup 
                      position={clickPosition} 
                      autoOpen={true}
                      onClose={() => setShowPopup(false)}
                    >
                      <div className="text-center p-1">
                        <p className="font-medium text-gray-800">¿Esta es la dirección correcta?</p>
                        {isLoadingAddress ? (
                          <p className="text-xs text-gray-500 mt-1">Cargando dirección...</p>
                        ) : address ? (
                          <p className="text-xs text-gray-600 mt-1 max-w-64 truncate">{address}</p>
                        ) : (
                          <p className="text-xs text-gray-500 mt-1">No se pudo cargar la dirección</p>
                        )}
                      </div>
                    </Popup>
                  )}
                  <MapUpdater center={currentLocation} onClick={handleMapClick} />
                </MapContainer>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <button
                    onClick={handleGetLocation}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all active:scale-95 shadow-md"
                  >
                    Obtener Ubicación Actual
                  </button>
                </div>
              )}
              
              {currentLocation && (
                <div className="absolute top-4 left-4 right-4 z-20">
                  <button
                    onClick={handleGetLocation}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all active:scale-95 shadow-md"
                  >
                    Actualizar Ubicación Actual
                  </button>
                </div>
              )}
            </div>

            {currentLocation && (
              <div className="mt-4 space-y-4">
                {/* Panel unificado con dirección y coordenadas */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-800">Información de Ubicación</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={handleRefreshAddress}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all active:scale-95"
                        disabled={isLoadingAddress}
                        title="Actualizar dirección"
                      >
                        <RefreshCw className={`w-5 h-5 text-gray-600 ${isLoadingAddress ? 'animate-spin' : ''}`} />
                      </button>
                      <button
                        onClick={handleCopyLocation}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all active:scale-95"
                        title="Copiar Coordenadas"
                      >
                        <Copy className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600 font-medium">
                      Coordenadas: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
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
                      <div>
                        <div className="text-sm font-medium text-gray-600">Dirección:</div>
                        <p className="text-sm text-gray-600">{address}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No se ha podido obtener la dirección</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={handleCreateReport}
                    className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    <span>Continuar con el Reporte</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-lg hover:shadow-xl transition-shadow border-[0.5px] p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Instrucciones
            </h2>
            <ol className="space-y-3 text-gray-600">
              <li className="pl-2">1. Seleccione una ubicación haciendo clic en cualquier punto del mapa</li>
              <li className="pl-2">2. Confirme si la dirección que aparece en el marcador es correcta</li>
              <li className="pl-2">3. Las coordenadas y la dirección se actualizarán automáticamente</li>
              <li className="pl-2">4. Puede actualizar la dirección con el botón de refrescar si es necesario</li>
              <li className="pl-2">5. Use el botón de continuar para proceder con el reporte</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IncidentTracker;