import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

import postcssPresetEnv from 'postcss-preset-env'
import postcsspxtoviewport8plugin from 'postcss-px-to-viewport-8-plugin'
import tailwindcss from 'tailwindcss'

import { visualizer } from 'rollup-plugin-visualizer'

const splitDependencies = ['gsap', 'html2canvas', 'lottie-web', 'vant', 'vueuse', 'canvas-confetti']

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    command === 'build' && handleCheck(),
    vue({ script: { defineModel: true } }),
    vueJsx(),
    Components({
      dirs: ['src/components'],
      extensions: ['vue', 'tsx', 'jsx'],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/, /\.tsx/, /\.jsx/],
      resolvers: [VantResolver()],
      dts: './components.d.ts',
    }),
    AutoImport({
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      imports: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core',
        'vue-i18n',
        {
          '@vueuse/integrations/useQRCode': ['useQRCode'],
          vant: [
            'showToast',
            'showFailToast',
            'showSuccessToast',
            'showLoadingToast',
            'closeToast',
            'showDialog',
            'showConfirmDialog',
            'closeDialog',
            'showActionSheet',
            'showPopup',
            'showPicker',
            'showDatetimePicker',
            'showArea',
            'showShareSheet',
            'showIm',
            'showImagePreview',
          ],
          gsap: ['gsap'],
        },
      ],
      dirs: ['./src/utils/**', './src/hooks/**', './src/config/**', './src/stores/**'],
      dts: './auto-imports.d.ts',
      vueTemplate: true,
      ignore: ['reactify', 'reactifyObject', 'router'],
    }),
    legacy({
      targets: ['defaults', 'not dead', '> 1%', 'ios >= 13', 'Android >= 10'],
    }),
    visualizer({
      title: 'Dependency analysis',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: './',
  build: {
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
        scan: path.resolve(__dirname, 'scan/index.html'),
      },
      output: {
        chunkFileNames: 'assets/static/[name]-[hash].js',
        manualChunks(id) {
          for (const dependency of splitDependencies) if (id.includes(dependency)) return dependency
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3010,
  },
  css: {
    postcss: {
      plugins: handleCss(command),
    },
  },
}))

function handleCss(command: string) {
  const pxToVw = postcsspxtoviewport8plugin({
    unitToConvert: 'px',
    viewportWidth: (file) => (~file.indexOf('node_modules/vant') ? 375 : 750),
    unitPrecision: 5,
    propList: ['*', '!backdrop-filter', '!border-radius', '!box-shadow'],
    viewportUnit: 'vw',
    fontViewportUnit: 'vw',
    selectorBlackList: ['FIX_', 'nprogress'],
    minPixelValue: 1,
    mediaQuery: false,
    replace: true,
    exclude: [],
    landscape: false,
    landscapeUnit: 'vw',
    landscapeWidth: (file) => (~file.indexOf('node_modules/vant') ? 720 : 1440),
  })

  const cssEnv = postcssPresetEnv({
    browsers: ['defaults', 'not dead', '> 1%', 'ios >= 13', 'Android >= 10'],
  })
  return command === 'build' ? [tailwindcss, cssEnv, pxToVw] : [tailwindcss, pxToVw]
}

function handleCheck() {
  const env = loadEnv('production', process.cwd())
  const {
    VITE_APP_LOCALSTORAGE_NAME: localName,
    VITE_APP_API_URL: apiUrl,
    VITE_APP_TITLE: title,
    VITE_APP_HM_BAIDU: hmBaidu,
    VITE_APP_SHARE_TITLE: shareTitle,
    VITE_APP_SHARE_DESC: shareDesc,
    VITE_APP_SHARE_LINK: shareLink,
    VITE_APP_SHARE_IMGURL: shareImgUrl,
  } = env

  import('chalk').then(({ default: chalk }) => {
    const { bgMagentaBright, red, green } = chalk
    console.log(bgMagentaBright('Tips:'))
    console.log(!title ? red('网站标题未定义') : green('网站标题：') + green.underline.bold(title))
    console.log(!apiUrl ? red('接口地址未定义') : green('接口地址：') + green.underline.bold(apiUrl))
    console.log(!localName ? red('本地存储名称未定义') : green('本地存储名称：') + green.underline.bold(localName))
    console.log(!hmBaidu ? red('百度统计ID未定义') : green('百度统计ID：') + green.underline.bold(hmBaidu))
    console.log(!shareTitle ? red('微信分享标题未定义') : green('微信分享标题：') + green.underline.bold(shareTitle))
    console.log(!shareDesc ? red('微信分享描述未定义') : green('描述：') + green.underline.bold(shareDesc))
    console.log(!shareLink ? red('微信分享链接未定义') : green('链接：') + green.underline.bold(shareLink))
    console.log(!shareImgUrl ? red('微信分享图片未定义') : green('图片：') + green.underline.bold(shareImgUrl))
  })
}
