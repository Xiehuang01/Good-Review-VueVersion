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

export {};
