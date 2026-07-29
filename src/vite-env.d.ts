/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_APP_VERSION?: string;
  readonly VITE_POSTHOG_KEY?: string;
  readonly VITE_GA_ID?: string;
  readonly VITE_ADMIN_PASSWORD?: string;
  readonly VITE_FEEDBACK_ENDPOINT?: string;
  readonly VITE_FEEDBACK_INBOX_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
