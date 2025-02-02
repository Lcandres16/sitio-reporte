// ReportCard.jsx
import { useMutation } from "@tanstack/react-query";
import { CheckCircle, Copy } from "lucide-react"; // Cambiar FileDown por Copy
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import reportService from "../../../services/report-service";
import PropTypes from "prop-types";

const ReportCard = ({ report, afterUpdate }) => {
  const navigate = useNavigate();

  const { mutate: setStatus, isPending } = useMutation({
    mutationFn: reportService.setStatus,
    onSuccess: afterUpdate,
  });

  const handleCopyCoordinates = async (e) => {
    e.stopPropagation();
    try {
      // Obtener las coordenadas del campo "ubicacion"
      const ubicacion = report.ubicacion; // Ejemplo: "Coordenadas: -2.9130752, -78.9970944"
      
      // Extraer solo las coordenadas usando una expresión regular
      const coordenadasRegex = /-?\d+\.\d+,\s*-?\d+\.\d+/;
      const coordenadas = ubicacion.match(coordenadasRegex)?.[0];

      // Verificar si las coordenadas existen
      if (!coordenadas) {
        throw new Error('No se encontraron coordenadas en este reporte.');
      }

      // Copiar las coordenadas al portapapeles
      await navigator.clipboard.writeText(coordenadas);
      
      // Mostrar notificación de éxito
      toast.success('Coordenadas copiadas al portapapeles');
    } catch (error) {
      console.error('Error al copiar las coordenadas:', error);
      toast.error(error.message || 'Error al copiar las coordenadas. Por favor intente nuevamente.');
    }
  };

  return (
    <div
      className="grid gap-4 m-3"
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/report/${report?.id}`, { state: { report } });
      }}
    >
      <div className="border rounded p-4 hover:*:cursor-pointer">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold">{report?.titulo}</h3>
            <p className="text-sm text-gray-600">
              Categoría: {report?.categoria_nombre}
            </p>
            <p className="text-sm text-gray-600">Estado: {report?.estado}</p>
            <p className="text-sm text-gray-600">Ubicación: {report?.ubicacion}</p> {/* Mostrar la ubicación completa */}
          </div>
          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              disabled={isPending}
              onClick={(e) => {
                e.stopPropagation();
                setStatus({
                  reportId: report.id,
                  state: "resuelto",
                  userId: report?.usuario_id,
                });
              }}
            >
              <CheckCircle className="w-5 h-5" />
            </button>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleCopyCoordinates} // Cambiar a la nueva función
            >
              <Copy className="w-5 h-5" /> {/* Cambiar el ícono a Copy */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ReportCard.propTypes = {
  report: PropTypes.shape({
    id: PropTypes.number.isRequired,
    titulo: PropTypes.string.isRequired,
    categoria_nombre: PropTypes.string.isRequired,
    estado: PropTypes.string.isRequired,
    usuario_id: PropTypes.number.isRequired,
    ubicacion: PropTypes.string.isRequired, // Asegúrate de que el campo de ubicación esté definido
  }).isRequired,
  afterUpdate: PropTypes.func.isRequired,
};

export default ReportCard;