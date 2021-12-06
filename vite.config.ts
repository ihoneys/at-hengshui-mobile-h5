import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import vitePluginImp from 'vite-plugin-imp';

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
      '@': resolve(__dirname, 'src'),
      comps: resolve(__dirname, 'src/components'),
    },
  },
  base: './',
  server: {
    port: 4000, // 设置端口
    open: true, // 设置启动时，自动打开浏览器
    cors: true, // 允许跨域
    proxy: {
      //设置代理，根据我们项目实际情况配置
      '/api': {
        target: 'https://jk-hs.com/yygh',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace('/api/', '/'),
      },
    },
  },
});
