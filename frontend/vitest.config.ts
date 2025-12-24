import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [], // 必要に応じて setup.ts を作成
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})