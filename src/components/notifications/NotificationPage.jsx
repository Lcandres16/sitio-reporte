import { onMessage } from "firebase/messaging";
import { messaging } from "../../firebase"; // Asegúrate de que la ruta sea correcta
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { ArrowLeft, Bell, Check, Clock } from "lucide-react/dist/cjs/lucide-react";
import notificationService from "../../services/notification-service";

const NotificationPage = () => {
  const navigate = useNavigate();
  const { data: notifications, refetch } = useQuery({
    queryFn: () => notificationService.findAllMine(),
    queryKey: ["notifications"],
  });

  useQuery({
    queryFn: () => notificationService.markAllAsRead(),
    refetchOnWindowFocus: true,
    queryKey: ["notifications-count"]
  });

  // Escucha notificaciones en primer plano
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Notificación recibida:", payload);
      refetch(); // Refetch las notificaciones para actualizar la lista
    });

    return () => unsubscribe();
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100/50 to-white">
      <div className="p-6 max-w-4xl mx-auto mt-16">
        <div className="bg-white/95 rounded-lg shadow-lg overflow-hidden">
          {/* Header with Back Button */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/')} 
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <div className="flex items-center gap-2 font-semibold text-lg">
                  <Bell className="h-5 w-5 text-blue-500" />
                  <span>Notificaciones</span>
                </div>
              </div>
              <span className="bg-blue-100 text-blue-600 text-sm py-1 px-3 rounded-full">
                {notifications?.length || 0} nuevas
              </span>
            </div>
          </div>

          {/* Notification List */}
          <div className="divide-y divide-gray-100 max-h-[calc(100vh-200px)] overflow-y-auto">
            {!notifications?.length ? (
              <div className="py-8 text-center text-gray-500">
                No hay notificaciones nuevas
              </div>
            ) : (
              notifications?.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 flex items-start gap-4 hover:bg-white/80 transition-colors"
                >
                  <div className="rounded-full bg-blue-50 p-2 mt-1 flex-shrink-0">
                    <Check className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 break-words">
                      El admin ha leído el reporte: {notification?.reporte?.titulo}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        Hace {getTimeAgo(notification.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to format time ago
const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " años";
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " meses";
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " días";
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " horas";
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutos";
  
  return Math.floor(seconds) + " segundos";
};

export default NotificationPage;