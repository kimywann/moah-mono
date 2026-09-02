import * as Sentry from "@sentry/react";

const sentryDSN = import.meta.env.VITE_SENTRY_DSN;

if (sentryDSN) {
  Sentry.init({
    dsn: sentryDSN,
    environment: import.meta.env.MODE,
    sendDefaultPii: false,
    tracesSampleRate: 0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
  });
}
