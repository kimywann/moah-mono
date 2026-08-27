type TApplicationStage =
  | "READY"
  | "APPLIED"
  | "INTERVIEW"
  | "PASSED"
  | "REJECTED";

interface IApplication {
  career: string;
  companyName: string;
  deadline: string | null;
  id: string;
  position: string;
  stage: TApplicationStage;
}

export type { IApplication, TApplicationStage };
