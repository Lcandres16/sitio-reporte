import ENV from "../environment/env";

class NotificationService {
  findAllMine() {
    return fetch(`${ENV.API_URL}/notificaciones`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => res.json());
  }

  countPending() {
    return fetch(`${ENV.API_URL}/notificaciones/count-pending`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => res.json());
  }

  markAllAsRead() {
    return fetch(`${ENV.API_URL}/notificaciones/mark-all-as-read`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => res.json());
  }
}

const notificationService = new NotificationService();

export default notificationService;
