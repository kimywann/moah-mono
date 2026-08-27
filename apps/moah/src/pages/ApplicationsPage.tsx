import { useEffect, useState } from "react";
import { getApplicationList } from "@/api/application";
import Applications from "@/components/applications/Applications";
import type { IApplicationList } from "@/shared/type/application";

const ApplicationsPage = () => {
  const [applications, setApplications] = useState<IApplicationList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await getApplicationList();

        if (!response.success || !response.data) {
          throw new Error("지원 현황 목록을 불러오지 못했습니다.");
        }

        setApplications(response.data);
      } catch {
        setErrorMessage("지원 현황 목록을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchApplications();
  }, []);

  if (isLoading) {
    return (
      <p className="p-6 text-muted-foreground">
        지원 현황 목록을 불러오는 중...
      </p>
    );
  }

  if (errorMessage) {
    return (
      <p className="p-6 text-danger" role="alert">
        {errorMessage}
      </p>
    );
  }

  return <Applications applications={applications} />;
};

export default ApplicationsPage;
