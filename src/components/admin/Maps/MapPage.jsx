import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

function MapUpdater({ center }) {
  const map = useMap();

  React.useEffect(() => {
    if (center) {
      map.setView(center, 15);
    }
  }, [center, map]);

  return null;
}

const LocationViewer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState([-12.046374, -77.042793]); // Lima por defecto
  const [error, setError] = useState('');

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    if (!searchQuery) {
      setError('Por favor ingresa una ubicación');
      return;
    }

    try {
      // Usar el servicio de geocodificación de OpenStreetMap Nominatim
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );

      if (!response.ok) {
        throw new Error('Error al buscar la ubicación');
      }

      const data = await response.json();

      if (data.length === 0) {
        setError('No se encontró la ubicación');
        return;
      }

      // Obtener la primera coincidencia
      const { lat, lon } = data[0];
      setLocation([parseFloat(lat), parseFloat(lon)]);
      setError('');
    } catch (err) {
      setError('Error al buscar la ubicación');
      console.error(err);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <form onSubmit={handleSearchSubmit} className="mb-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="searchQuery" className="font-medium">
            Buscar ubicación:
          </label>
          <div className="flex gap-2">
            <input
              id="searchQuery"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ejemplo: Lima, Perú"
              className="flex-1 p-2 border rounded"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Buscar
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="mb-4 p-2 text-red-600 bg-red-50 rounded">
          {error}
        </div>
      )}

      <div className="h-[600px] rounded-lg overflow-hidden border">
        <MapContainer
          center={location}
          zoom={15}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={location} />
          <MapUpdater center={location} />
        </MapContainer>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded">
        <p className="text-sm text-gray-600">
          Ubicación actual: <span className="font-mono">{location.join(', ')}</span>
        </p>
      </div>
    </div>
  );
};

export default LocationViewer;