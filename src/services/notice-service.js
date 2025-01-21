import ENV from "../environment/env";

class NoticeService {
  findAll() {
    return fetch(`${ENV.API_URL}/avisos`).then((res) => res.json());
  }

  save({ titulo, contenido, importante }) {
    return fetch(`${ENV.API_URL}/avisos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ titulo, contenido, importante }),
    }).then((res) => res.json());
  }
}

const noticeService = new NoticeService();

export default noticeService;
