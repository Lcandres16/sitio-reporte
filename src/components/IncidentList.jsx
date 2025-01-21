import { useState } from "react";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import IncidentCard from "./incidents/IncidentCard";
import { useQuery } from "@tanstack/react-query";
import reportService from "../services/report-service";

const IncidentList = () => {
  const [selectedType, setSelectedType] = useState("");
  const navigate = useNavigate();

  const incidentTypes = ["Público alumbrado", "Otros"];

  const { data: incidents } = useQuery({
    queryFn: () => reportService.findAll(),
    queryKey: ["reports-incidents", selectedType],
  });

  const handleHomeClick = () => {
    navigate("/");
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
          {incidents?.length === 0 && (
            <div className="col-span-full text-center py-8 bg-white rounded-lg border">
              <p className="text-gray-500">No hay incidentes para mostrar</p>
            </div>
          )}
          {incidents?.map((incident) => (
            <IncidentCard key={incident?.id} incident={incident} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IncidentList;
