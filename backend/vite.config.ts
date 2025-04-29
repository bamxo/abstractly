import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000
  },
  build: {
    target: 'node18',
    outDir: 'dist',
    rollupOptions: {
      input: 'src/index.ts',
      output: {
        format: 'esm'
      },
      external: ['express', 'cors', 'dotenv']
    }
  }
}) 