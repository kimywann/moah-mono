export const EXTRACTION_PROMPT = `주어진 채용 공고 URL의 페이지 내용을 확인하고 정보를 추출하세요.

  [공통 규칙]
  - 원문에 없는 정보를 추측하지 마세요.

  [마감일]
  - deadline은 YYYY-MM-DD 형식으로 반환합니다. 날짜가 없으면 null로 반환합니다.
  - deadlineType은 DATE, ROLLING, UNTIL_FILLED, UNKNOWN 중 하나로 반환합니다.
  - 날짜가 명시되면 deadlineType은 DATE로 반환합니다.
  - 상시 채용이면 deadlineType은 ROLLING, 채용 시 마감이면 UNTIL_FILLED로 반환합니다.
  - 마감 방식과 날짜를 확인할 수 없으면 deadlineType은 UNKNOWN으로 반환합니다.

  [원문 제목]
  - title은 공고에 표시된 원문 제목을 수정하거나 요약하지 않고 그대로 반환합니다.

  [포지션 정규화]
  - position은 공고 제목을 그대로 복사하지 말고, 핵심 직무를 상위 카테고리로 정규화합니다.
  - position은 반드시 다음 허용 목록 중 하나로 반환합니다:
    프론트엔드, 백엔드, 풀스택, 모바일, 데이터, AI, DevOps, QA, 보안, 게임, 임베디드, 영업, 디자인,
    마케팅, PM/PO, 기획, 기타.
  - FE, frontend, Frontend, 프론트엔드 개발자 → "프론트엔드"
  - Python, Java, Kotlin, 서버 개발자, Backend, 백엔드 개발자 → "백엔드"
  - Full Stack, 풀스택 개발자 → "풀스택"
  - iOS, Android, React Native, Flutter 개발자 → "모바일"
  - 데이터 엔지니어, 데이터 분석가, 데이터 사이언티스트 → "데이터"
  - 머신러닝, 딥러닝, AI 엔지니어 → "AI"
  - 인프라, 클라우드, SRE → "DevOps"
  - QA, 테스트 엔지니어 → "QA"
  - 보안 엔지니어, 정보보안 → "보안"
  - 게임 클라이언트, 게임 서버, 게임 개발자 → "게임"
  - 임베디드, 펌웨어 → "임베디드"
  - Sales, Account Executive, 영업 담당자 → "영업"
  - UI/UX, 프로덕트, 그래픽, 브랜드 디자이너 → "디자인"
  - 퍼포먼스, 콘텐츠, 디지털, 브랜드 마케터 → "마케팅"
  - Product Manager, Product Owner, PM, PO → "PM/PO"
  - 서비스 기획자, 사업 기획자, 운영 기획자 → "기획"
  - 허용 목록에 해당하는 직무가 없으면 "기타"를 반환합니다.

  [경력]
  - minYears와 maxYears에는 지원 가능한 경력 연차 범위를 정수로 반환합니다.
  - 신입 → minYears: 0, maxYears: 0
  - 경력무관, 경력 제한 없음 → minYears: 0, maxYears: null
  - "N년" → minYears: N, maxYears: N
  - "N~M년" → minYears: N, maxYears: M
  - "N년 이상" → minYears: N, maxYears: null
  - "N년 이하" → minYears: 0, maxYears: N
  - "N년 미만" → minYears: 0, maxYears: N - 1
  - 1~2년차 이상 또는 그에 준하는 실력은 minYears: 1, maxYears: null
  - 경력 조건을 확인할 수 없거나 해석이 모호하면 두 값 모두 null로 반환합니다.
  - 연차가 아닌 경력 표현은 추측하지 마세요.

  [채용 절차]
  - hiringProcess에는 공고에 명시된 채용 전형을 진행 순서대로 배열에 담으세요.
  - 섹션 제목의 단어를 기준으로 판단하지 말고, 페이지 전체에서 채용 전형을 설명하는 문맥을 찾아 추
  출하세요.
  - 섹션 제목은 예를 들어 "전형 절차", "지원 및 진행 절차", "이런 과정으로 합류해요", "이렇게 합류
  해요", "~의 합류 여정"처럼 다양하게 표현될 수 있습니다.
  - 섹션 제목이나 설명 문구 자체를 단계로 넣지 말고, "서류 제출", "코딩 테스트", "1차 면접", "최종
  면접"처럼 실제 전형 단계만 반환하세요.
  - 예: 서류 전형, 1차 면접, 최종 면접
  - 순서를 확인할 수 있을 때만 배열 순서에 반영하고, 채용 절차를 찾지 못하면 빈 배열을 반환하세요.

  [기술 스택]
  - techStacks에는 자격요건 및 우대사항에 명시된 기술, 프레임워크, 라이브러리, 플랫폼, 도구만 중복
  없이 배열로 담으세요.
  - 예: React, TypeScript, Node.js
  - 기술 스택을 확인할 수 없으면 빈 배열을 반환하세요.`;
