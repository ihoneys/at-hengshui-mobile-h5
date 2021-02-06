import path from 'path'
import vue from '@vitejs/plugin-vue'
export default {
  plugins: [vue()],
  alias: {
    '@': path.resolve(__dirname, 'src'),
    comps: path.resolve(__dirname, 'src/components'),
  },
}
