import path from 'path'
import vue from '@vitejs/plugin-vue'
// import type { UserConfig } from 'vite'
import { defineConfig } from 'vite'
import vitePluginImp from 'vite-plugin-imp'
// export default {
//   plugins: [vue()],
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, 'src'),
//       comps: path.resolve(__dirname, 'src/components'),
//       paths: {
//         '@/*': ['./src/*'],
//       },
//     },
//   },
//   port: 8082,
//   globalComponents: ['vuetify'],
// }

export default defineConfig({
  plugins: [
    vue(),
    // vitePluginImp({
    //   libList: [
    //     {
    //       libName: 'vant',
    //       style(name) {
    //         return `vant/lib/index.css`
    //       },
    //     },
    //   ],
    // }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      comps: path.resolve(__dirname, 'src/components'),
    },
  },
  base: './',
})
