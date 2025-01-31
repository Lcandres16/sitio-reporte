import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import IncidentCard from "./incidents/IncidentCard";
import { useQuery } from "@tanstack/react-query";
import reportService from "../services/report-service";
import CATEGORIES from "../consts/categories";

const IncidentList = () => {
  const [selectedType, setSelectedType] = useState(undefined);
  const navigate = useNavigate();

  const incidentTypes = [...Object.values(CATEGORIES)];

  const { data: incidents } = useQuery({
    queryFn: () => reportService.findAll({ categoryName: selectedType }),
    queryKey: ["reports-incidents", selectedType],
  });

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100/50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center">
          <button 
            onClick={handleGoBack}
            className="p-2 rounded-lg hover:bg-gray-100 mr-2"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="font-bold text-xl text-gray-800">
            Lista de Incidentes
          </h1>
        </div>
      </div>

      {/* Contenido principal */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Botón de filtro */}
        <div className="mb-6">
          <select
            className="px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">Todos los tipos de incidentes</option>
            {incidentTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Grid de incidentes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!incidents || incidents.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay incidentes
              </h3>
              <p className="text-gray-500">
                No se encontraron incidentes que coincidan con los filtros seleccionados
              </p>
            </div>
          ) : (
            incidents.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                className="animate-fade-in-up"
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default IncidentList;