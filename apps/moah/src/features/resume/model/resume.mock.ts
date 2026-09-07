import type { IResume } from "@/features/resume/model/resume.type";

export const RESUME_MOCK_DATA: IResume[] = [
  {
    createdAt: "2026. 09. 06.",
    fileFormat: "PDF",
    id: "resume-1",
    linkedApplication: "토스 · 프론트엔드 개발자",
    name: "프론트엔드 개발자 이력서.pdf",
  },
  {
    createdAt: "2026. 08. 28.",
    fileFormat: "DOCX",
    id: "resume-2",
    linkedApplication: "카카오 · 웹 프론트엔드 개발자",
    name: "김이력서_최종본.docx",
  },
  {
    createdAt: "2026. 08. 14.",
    fileFormat: "PDF",
    id: "resume-3",
    linkedApplication: null,
    name: "이력서_경력기술서.pdf",
  },
];
