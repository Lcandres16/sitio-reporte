import { useMutation } from "@tanstack/react-query";
import { CheckCircle, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import reportService from "../../../services/report-service";
import PropTypes from "prop-types";

const ReportCard = ({ report, afterUpdate }) => {
  const navigate = useNavigate();

  const { mutate: setStatus, isPending } = useMutation({
    mutationFn: reportService.setStatus,
    onSuccess: afterUpdate,
  });

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
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
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
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              <MessageSquare
                className="w-5 h-5"
                onClick={(e) => e.stopPropagation()}
              />
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
