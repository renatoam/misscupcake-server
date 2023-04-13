/// <reference types="vitest" />
import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      "@base": path.resolve(__dirname, "./src/modules/base"),
      "@cart": path.resolve(__dirname, "./src/modules/cart"),
      "@content": path.resolve(__dirname, "./src/modules/content"),
      "@product": path.resolve(__dirname, "./src/modules/product"),
      "@shared": path.resolve(__dirname, "./src/modules/shared"),
      "@middlewares": path.resolve(__dirname, "./src/middlewares"),
      "@database": path.resolve(__dirname, "./src/database")
    },
  },
})
