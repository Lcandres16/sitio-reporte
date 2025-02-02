// ReportCard.jsx
import { useMutation } from "@tanstack/react-query";
import { CheckCircle, FileDown } from "lucide-react";
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

  const handleDownloadReport = async (e) => {
    e.stopPropagation();
    try {
      // Mostrar indicador de carga
      const loadingToast = toast.loading('Generando PDF...');
      
      const response = await fetch(`/api/reporte/download/${report.id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Obtener el blob del PDF
      const blob = await response.blob();
      console.log('Response type:', response.type);
      console.log('Blob size:', blob.size);
      
      // Verificar que el blob sea válido
      if (blob.size === 0) {
        throw new Error('El archivo PDF está vacío');
      }
      
      // Crear URL del blob
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      
      // Crear elemento de descarga
      const link = document.createElement('a');
      link.href = url;
      link.download = `Reporte-${report.titulo}.pdf`;
      
      // Agregar a DOM, hacer clic y limpiar
      document.body.appendChild(link);
      link.click();
      
      // Limpiar
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
        toast.dismiss(loadingToast);
        toast.success('PDF descargado exitosamente');
      }, 100);
      
    } catch (error) {
      console.error('Error al descargar:', error);
      toast.error('Error al descargar el reporte. Por favor intente nuevamente.');
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
              onClick={handleDownloadReport}
            >
              <FileDown className="w-5 h-5" />
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
  }).isRequired,
  afterUpdate: PropTypes.func.isRequired,
};

export default ReportCard;