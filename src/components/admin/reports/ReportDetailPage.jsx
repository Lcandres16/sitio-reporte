import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, MapPin, Tag, Clock, AlertCircle } from "lucide-react";
import reportService from "../../../services/report-service";
import ENV from "../../../environment/env";

const ReportDetailPage = () => {
  const navigate = useNavigate();
  const { id: reportId } = useParams();

  const { data: report, isLoading } = useQuery({
    queryFn: () => reportService.findOne({ reportId }),
    queryKey: ["reports", reportId],
  });

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'en proceso':
        return 'bg-blue-100 text-blue-800';
      case 'completado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100/50 to-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header with back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver</span>
          </button>
        </div>

        {/* Main content card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Image header */}
          {report?.imagen_url && (
            <div className="w-full h-64 relative bg-gray-100">
              <img
                className="w-full h-full object-cover"
                src={`${ENV.SERVER_URL}${report.imagen_url}`}
                alt={report.titulo}
              />
            </div>
          )}

          {/* Content section */}
          <div className="p-6">
            {/* Status badge */}
            <div className="mb-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(report?.estado)}`}>
                {report?.estado}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {report?.titulo}
            </h1>

            {/* Meta information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-5 w-5" />
                <span>{report?.usuario_nombre}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Tag className="h-5 w-5" />
                <span>{report?.categoria_nombre}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>{report?.ubicacion}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="h-5 w-5" />
                <span>{new Date(report?.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Description */}
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Descripción
              </h2>
              <p className="text-gray-600 whitespace-pre-wrap">
                {report?.descripcion}
              </p>
            </div>

            {/* Additional actions or information */}
            {report?.estado === 'pendiente' && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-700">
                  Este reporte está pendiente de revisión por parte del equipo administrativo.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailPage;