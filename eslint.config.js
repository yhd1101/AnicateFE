module.exports = {
  // ESLint 설정
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:storybook/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'], // 무시할 파일 패턴
  parser: '@typescript-eslint/parser', // TypeScript 코드 파싱기
  plugins: ['react-refresh'], // 사용할 플러그인
  rules: {
    // 사용자 정의 규칙
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true }, // React 컴포넌트만 내보내도록 하는 규칙
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off', // 함수 반환 타입 명시 규칙 해제
    '@typescript-eslint/no-unused-vars': 'error', // 사용하지 않는 변수 사용시 에러 규칙
    '@typescript-eslint/no-empty-interface': 'error', // 빈 인터페이스 사용 시 에러 규칙
    '@typescript-eslint/no-var-requires': 'off', // require 사용 규칙 해제
    '@typescript-eslint/ban-types': 'off', // 특정 타입 사용 제한 규칙 해제
    '@typescript-eslint/no-non-null-assertion': 'off', // 비-널 단언 연산자 사용 규칙 해제
    '@typescript-eslint/no-empty-function': 'off', // 빈 함수 규칙 해제
    '@typescript-eslint/no-namespace': 'off', // 네임스페이스 사용 규칙 해제
    '@typescript-eslint/ban-ts-comment': 'off', // @ts-ignore 사용 규칙 해제
  },
};
