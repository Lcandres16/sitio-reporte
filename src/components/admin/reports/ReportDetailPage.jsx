import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import reportService from "../../../services/report-service";
import ENV from "../../../environment/env";

const ReportDetailPage = () => {
  const { id: reportId } = useParams();

  const { data: report } = useQuery({
    queryFn: () => reportService.findOne({ reportId }),
    queryKey: ["reports", reportId],
  });

  return (
    <div className="p-10">
      <h2>{report?.titulo}</h2>
      <div>Usuario: {report?.usuario_nombre}</div>
      <div>Categoría: {report?.categoria_nombre}</div>
      <div>Ubicación: {report?.ubicacion}</div>
      <div>Estado: {report?.estado}</div>
      <p>{report?.descripcion}</p>
      <img
        className="h-36"
        src={`${ENV.SERVER_URL}${report?.imagen_url}`}
        alt=""
      />
    </div>
  );
};

export default ReportDetailPage;
