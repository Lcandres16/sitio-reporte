import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import noticeService from "../services/notice-service";

const AnnouncementsBoard = () => {
  const navigate = useNavigate();
  const { data: announcements } = useQuery({
    queryFn: () => noticeService.findAll(),
    queryKey: ["notices"],
    refetchOnWindowFocus: true,
  });

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100/50 to-white">
      {/* Header exactamente igual al de CommunicationMedia */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={handleGoBack}
              className="p-2 rounded-lg hover:bg-gray-100 mr-2"
              title="Back to Home"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="font-bold text-xl text-gray-800">
              Reporte de Comunicados
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {announcements?.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm 
                          transform transition-all duration-300 hover:scale-[1.01]">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No hay comunicados disponibles en este momento
              </p>
            </div>
          ) : (
            announcements?.map((announcement, index) => (
              <article
                key={announcement.id}
                className="group bg-white rounded-lg shadow-sm 
                         transform transition-all duration-300 hover:scale-[1.01]
                         hover:shadow-md cursor-pointer
                         animate-fade-in-up"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="p-6">
                  {/* Badge y Fecha */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium
                                   transform transition-all duration-300 group-hover:bg-blue-50 group-hover:text-blue-600">
                      Comunicado #{String(announcement.id).padStart(4, "0")}
                    </span>
                    <time className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                      {new Date(announcement.created_at).toLocaleDateString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </time>
                  </div>

                  {/* Título y Contenido */}
                  <div className="space-y-3">
                    <h2 className="text-xl font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                      {announcement.titulo}
                    </h2>
                    <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                      {announcement.contenido}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500 group-hover:text-gray-600 transition-colors">
                      <span className="flex items-center">
                        Por: {announcement.admin_id || "Administración"}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default AnnouncementsBoard;