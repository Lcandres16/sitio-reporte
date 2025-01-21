import { useQuery } from "@tanstack/react-query";

import reportService from "../../../services/report-service";
import ReportCard from "./ReportCard";

const ReportPage = () => {
  const { data: reports, refetch: refetchReports } = useQuery({
    queryFn: () => reportService.findAll(),
    queryKey: ["reports"],
    refetchInterval: 1000 * 10,
    refetchOnWindowFocus: true,
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
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
  );
};

export default ReportPage;
