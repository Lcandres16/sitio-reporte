import ENV from "../environment/env";

class ReportService {
  findAll() {
    return fetch(`${ENV.API_URL}/reportes`).then((res) => res.json());
  }

  findOne({ reportId }) {
    return fetch(`${ENV.API_URL}/reportes/${reportId}`).then((res) =>
      res.json()
    );
  }

  setStatus({ state, reportId, userId }) {
    return fetch(`${ENV.API_URL}/reportes`, {
      method: "PATCH",
      body: JSON.stringify({
        reportId,
        state,
        userId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());
  }
}

const reportService = new ReportService();

export default reportService;
