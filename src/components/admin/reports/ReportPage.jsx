import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { FileText, Loader } from "lucide-react";
import reportService from "../../../services/report-service";
import ReportCard from "./ReportCard";

const ReportPage = () => {
  const { data: reports, refetch: refetchReports, isLoading } = useQuery({
    queryFn: () => reportService.findAll(),
    queryKey: ["reports"],
    refetchInterval: 1000 * 10,
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-blue-600">
          <Loader className="w-5 h-5 animate-spin" />
          <span>Cargando reportes...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Reportes Ciudadanos
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              Última actualización: {new Date().toLocaleTimeString()}
            </div>
          </div>
          
          {/* Stats Summary */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-500">Total Reportes</div>
              <div className="text-2xl font-semibold">{reports?.length || 0}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-500">Pendientes</div>
              <div className="text-2xl font-semibold text-yellow-600">
                {reports?.filter(r => r.estado === 'pendiente').length || 0}
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-500">Resueltos</div>
              <div className="text-2xl font-semibold text-green-600">
                {reports?.filter(r => r.estado === 'resuelto').length || 0}
              </div>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        {reports?.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No hay reportes</h3>
            <p className="mt-1 text-gray-500">
              Aún no se han registrado reportes en el sistema.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {reports?.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                afterUpdate={() => {
                  refetchReports();
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPage;