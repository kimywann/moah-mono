import type { IResume } from "@/features/resume/model/resume.type";

export const RESUME_MOCK_DATA: IResume[] = [
  {
    createdAt: "2026. 09. 06.",
    fileFormat: "PDF",
    id: "resume-1",
    linkedApplications: [
      {
        companyName: "토스",
        id: "application-1",
        title: "프론트엔드 개발자",
      },
    ],
    name: "프론트엔드 개발자 이력서.pdf",
  },
  {
    createdAt: "2026. 08. 28.",
    fileFormat: "DOCX",
    id: "resume-2",
    linkedApplications: [
      {
        companyName: "카카오",
        id: "application-2",
        title: "웹 프론트엔드 개발자",
      },
    ],
    name: "김이력서_최종본.docx",
  },
  {
    createdAt: "2026. 08. 14.",
    fileFormat: "PDF",
    id: "resume-3",
    linkedApplications: [],
    name: "이력서_경력기술서.pdf",
  },
];
