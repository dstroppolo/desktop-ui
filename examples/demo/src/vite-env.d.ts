/// <reference types="vite/client" />

// Type declarations for desktop-ui local development
// The Vite alias resolves 'desktop-ui' to ../../packages/desktop-ui/src/index.ts
// TypeScript needs this declaration to understand the module
declare module 'desktop-ui' {
  export * from '../../../packages/desktop-ui/src/index';
}
