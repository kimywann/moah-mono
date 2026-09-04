interface ImportMetaEnv {
  readonly DEV: boolean;
}

// biome-ignore lint/correctness/noUnusedVariables: 전역 import.meta 타입 확장을 위한 선언
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
