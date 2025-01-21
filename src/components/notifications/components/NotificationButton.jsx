import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import notificationService from "../../../services/notification-service";

const NotificationButton = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { data: notificationData } = useQuery({
    queryFn: () => notificationService.countPending(),
    queryKey: ["count-notifications"],
    refetchInterval: 1000 * 10,
  });

  const handleNotificationsClick = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    navigate("/notifications");
  };

  return (
    <div>
      {notificationData?.count !== 0 && <div>{notificationData?.count}</div>}
      <Bell
        className="w-5 h-5 text-gray-600 cursor-pointer"
        onClick={handleNotificationsClick}
      />
    </div>
  );
};

export default NotificationButton;
