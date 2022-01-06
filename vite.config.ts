import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  root: './',
  base: '/perkd-pubsub-v0.0.1/',
  plugins: [react()]
})
