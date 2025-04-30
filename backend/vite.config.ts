import { defineConfig } from 'vite'
import { VitePluginNode } from 'vite-plugin-node'

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
  },
  plugins: [
    ...VitePluginNode({
      adapter: 'express',
      appPath: './src/index.ts',
      exportName: 'app',
      tsCompiler: 'esbuild'
    })
  ]
}) 