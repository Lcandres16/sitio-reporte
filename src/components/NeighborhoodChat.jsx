import { useState } from "react";
import { ArrowLeft, Bell, Calendar, User, ChevronRight, MessageCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import noticeService from "../services/notice-service";

const AnnouncementsBoard = () => {
  const navigate = useNavigate();
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: announcements } = useQuery({
    queryFn: () => noticeService.findAll(),
    queryKey: ["notices"],
    refetchOnWindowFocus: true,
  });

  // Ordenar los anuncios por fecha más reciente
  const sortedAnnouncements = announcements ? [...announcements].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  }) : [];

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleOpenDetails = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100/50 to-white">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={handleGoBack}
              className="p-2 rounded-lg hover:bg-gray-100 mr-2"
              title="Volver"
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
          {sortedAnnouncements.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Sin Comunicados
                </h3>
                <p className="text-gray-500">
                  No hay comunicados disponibles en este momento
                </p>
              </div>
            </div>
          ) : (
            sortedAnnouncements.map((announcement, index) => (
              <article
                key={announcement.id}
                className="group bg-white rounded-xl shadow-sm border border-gray-100
                         transform transition-all duration-300 hover:shadow-lg
                         animate-fade-in-up overflow-hidden"
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="p-6">
                  {/* Header del comunicado */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <MessageCircle className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-blue-600 mb-1 block">
                          Comunicado #{String(announcement.id).padStart(4, "0")}
                        </span>
                        <time className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
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
                    </div>
                  </div>

                  {/* Contenido principal */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {announcement.titulo}
                    </h2>
                    <p className="text-gray-600 leading-relaxed text-lg line-clamp-3">
                      {announcement.contenido}
                    </p>
                  </div>

                  {/* Footer mejorado */}
                  <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500">
                      <User className="w-5 h-5" />
                      <span>
                        Por: <span className="font-medium text-gray-700">{announcement.admin_id || "Administración"}</span>
                      </span>
                    </div>
                    <button 
                      onClick={() => handleOpenDetails(announcement)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Ver detalles
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </main>

      {/* Modal de Detalles */}
      {isModalOpen && selectedAnnouncement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-3xl my-8">
            {/* Modal Header */}
            <div className="flex justify-between items-start p-6 border-b">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedAnnouncement.titulo}
                </h3>
                <div className="mt-2 flex items-center gap-4">
                  <span className="text-sm font-medium text-blue-600">
                    Comunicado #{String(selectedAnnouncement.id).padStart(4, "0")}
                  </span>
                  <time className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(selectedAnnouncement.created_at).toLocaleDateString(
                      "es-ES",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </time>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {selectedAnnouncement.contenido}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t bg-gray-50 flex items-center justify-between rounded-b-lg">
              <div className="flex items-center gap-2 text-gray-500">
                <User className="w-5 h-5" />
                <span>
                  Por: <span className="font-medium text-gray-700">
                    {selectedAnnouncement.admin_id || "Administración"}
                  </span>
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsBoard;