// Type declarations to allow importing files with ?raw query (Vite style)
declare module '*?raw' {
  const content: string;
  export default content;
}

// Fallback: specific .js?raw imports
declare module '*.js?raw' {
  const content: string;
  export default content;
}

// Vite environment variables
interface ImportMetaEnv {
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly MODE: string;
  readonly BASE_URL: string;
  readonly VITE_APP_TITLE?: string;
  // Add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export {};
