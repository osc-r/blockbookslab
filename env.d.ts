declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_NOTIFICATION_CHANNEL_ADDR: string;
      NEXT_PUBLIC_NOTIFICATION_ENV: string;
      NEXT_PUBLIC_NOTIFICATION_APP_NAME: string;
      NEXT_PUBLIC_API_ENDPOINT: string;
      NEXT_PUBLIC_WEB_SOCKET_ENDPOINT: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
