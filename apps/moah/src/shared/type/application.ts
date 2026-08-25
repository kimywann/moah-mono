type TApplicationStage =
  | "applied"
  | "document"
  | "interview"
  | "offer"
  | "rejected";

interface IApplication {
  career: string;
  companyName: string;
  deadline: string | null;
  id: string;
  position: string;
  stage: TApplicationStage;
}

export type { IApplication, TApplicationStage };
