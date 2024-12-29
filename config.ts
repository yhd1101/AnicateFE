declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
export const CONFIG = {
  DOMAIN: import.meta.env.VITE_DOMAIN,
  TOKEN_KEY: 'token',
} as const;
