import ENV from "../environment/env";

class ReportService {
  findAll({ categoryName = undefined } = {}) {
    let api = `${ENV.API_URL}/reportes`;

    if (categoryName) {
      api += `?categoryName=${categoryName?.replace(" ", "+")}`;
    }

    return fetch(api).then((res) => res.json());
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
