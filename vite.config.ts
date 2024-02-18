import { defineConfig } from 'vite'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [],
  build: {
    lib: {
      entry: 'src/index.ts', // 工具库入口
      name: 'microway', // 工具库名称
      fileName: format => `microway.${format}.js`, // 工具库名称
    },
  },
})