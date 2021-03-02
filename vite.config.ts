import path from 'path'
import vue from '@vitejs/plugin-vue'
// import tsConfigPaths from 'vite-tsconfig-paths'
export default {
  plugins: [vue()],
  alias: {
    '@': path.resolve(__dirname, 'src'),
    comps: path.resolve(__dirname, 'src/components'),
  },
}
