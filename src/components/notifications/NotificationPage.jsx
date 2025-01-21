import { useQuery } from "@tanstack/react-query";
import notificationService from "../../services/notification-service";

const NotificationPage = () => {
  const { data: notifications } = useQuery({
    queryFn: () => notificationService.findAllMine(),
    queryKey: ["notifications"],
  });

  useQuery({
    queryFn: () => notificationService.markAllAsRead(),
    refetchOnWindowFocus: true,
  });

  return (
    <div className="p-10">
      {notifications?.map((notification) => (
        <div key={notification.id}>
          <div>
            El admin ha leído el reporte: {notification?.reporte?.titulo}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationPage;
