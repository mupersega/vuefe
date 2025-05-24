import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@ui': resolve(__dirname, './src/ui'),
      '@components': resolve(__dirname, './src/ui/components'),
      '@layouts': resolve(__dirname, './src/ui/layouts'),
      '@views': resolve(__dirname, './src/ui/views'),
      '@shared': resolve(__dirname, './src/ui/components/shared'),
      '@stores': resolve(__dirname, './src/stores'),
      '@scripts': resolve(__dirname, './src/scripts'),
      '@config': resolve(__dirname, './src/config'),
      '@assets': resolve(__dirname, './src/assets'),
      '@services': resolve(__dirname, './src/services'),
      '@api-client': resolve(__dirname, './src/api-client'),
    }
  }
})
