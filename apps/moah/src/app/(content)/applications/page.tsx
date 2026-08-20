import type { IApplication } from "@/app/type/application";
import Applications from "./Applications";

const MOCK_APPLICATIONS: IApplication[] = [
  {
    id: "1",
    companyName: "모아",
    position: "Frontend Developer",
    career: "경력 3년 이상",
    stage: "document",
    deadline: "2026-08-25",
  },
];

const ApplicationsPage = () => {
  return <Applications applications={MOCK_APPLICATIONS} />;
};

export default ApplicationsPage;
