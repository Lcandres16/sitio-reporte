import PropTypes from "prop-types";
import ENV from "../../environment/env";

const IncidentCard = ({ incident }) => {
  return (
    <div
      key={incident?.id}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <img
        src={`${ENV.SERVER_URL}${incident.imagen_url}`}
        alt={incident.categoria_nombre}
        className="h-48 object-cover rounded-t-lg w-full"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{incident.titulo}</h3>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Tipo:</span>{" "}
            {incident.categoria_nombre}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Descripción:</span>{" "}
            {incident.descripcion}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Ubicación:</span> {incident.ubicacion}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Fecha:</span>{" "}
            {new Date(incident.created_at).toLocaleDateString()}
          </p>
          <div className="flex justify-between items-center">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                incident.estado === "resuelto"
                  ? "bg-green-100 text-green-800"
                  : incident.estado === "En Proceso"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {incident.estado}
            </span>
            {/* <span
              className={`px-3 py-1 rounded-full text-sm ${
                incident.severity === "Alto"
                  ? "bg-red-100 text-red-800"
                  : incident.severity === "Medio"
                  ? "bg-orange-100 text-orange-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {incident.severity}
            </span> */}
          </div>
        </div>
      </div>
    </div>
  );
};

IncidentCard.propTypes = {
  incident: PropTypes.shape({
    id: PropTypes.number.isRequired,
    titulo: PropTypes.string.isRequired,
    imagen_url: PropTypes.string.isRequired,
    categoria_nombre: PropTypes.string.isRequired,
    estado: PropTypes.string,
    descripcion: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    ubicacion: PropTypes.string.isRequired,
  }),
};

export default IncidentCard;
