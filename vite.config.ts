import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { webUpdateNotice } from '@plugin-web-update-notification/vite'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

import postcssPresetEnv from 'postcss-preset-env'
import postcsspxtoviewport8plugin from 'postcss-px-to-viewport-8-plugin'
import tailwindcss from 'tailwindcss'

import { visualizer } from 'rollup-plugin-visualizer'

const splitDependencies = ['gsap', 'html2canvas', 'lottie-web']

const env = loadEnv('production', process.cwd())

export default defineConfig(({ command }) => ({
  plugins: [
    command === 'build' ? handleCheck() : undefined,
    vue({ script: { defineModel: true } }),
    vueJsx(),
    webUpdateNotice({
      versionType: 'build_timestamp',
      hiddenDefaultNotification: true,
      logVersion: (version) => {
        console.log(`version: %c${version}`, 'color: #1890ff')
      },
    }),
    Components({
      dirs: ['src/components'],
      extensions: ['vue', 'tsx', 'jsx'],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/, /\.tsx/, /\.jsx/],
      resolvers: [
        (name) => {
          return name == 'Icon' ? { name: 'Icon', from: '@iconify/vue' } : null
        },
        VantResolver(),
      ],
      dts: './typings/components.d.ts',
    }),
    AutoImport({
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      imports: [
        'vue',
        'pinia',
        'vue-router',
        {
          '@vueuse/integrations/useQRCode': ['useQRCode'],
          'gsap': ['gsap'],
          'html2canvas': [['default', 'html2canvas']],
          'compressorjs': [['default', 'compressorjs']],
        },
      ],
      dirs: ['./src/hooks/**', './src/config/**', './src/stores/**', './src/router/**', './src/api/**'],
      dts: './typings/auto-imports.d.ts',
      vueTemplate: true,
      ignore: ['reactify', 'reactifyObject', 'router'],
    }),
    legacy({
      targets: ['ios >= 11', 'chrome >= 64'],
      modernPolyfills: true,
    }),
    visualizer(),
  ],
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
      '~~': fileURLToPath(new URL('./scan', import.meta.url)),
    },
  },
  base: './',
  esbuild: {
    drop: command === 'serve' ? [] : env.VITE_DROP_CONSOLE == '1' ? ['console', 'debugger'] : [],
  },
  build: {
    assetsDir: 'assets',
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
        // scan: path.resolve(__dirname, 'scan/index.html'),
      },
      output: {
        chunkFileNames: 'assets/static/[name]-[hash].js',
        manualChunks(id) {
          for (const dependency of splitDependencies) if (id.includes(dependency)) return dependency
        },
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3010,
  },
  css: {
    postcss: {
      plugins: [
        postcssPresetEnv({
          browsers: ['ios >= 11', 'chrome >= 64'],
        }),
        tailwindcss,
        postcsspxtoviewport8plugin({
          unitToConvert: 'px',
          viewportWidth: (file) =>
            ~file.indexOf('node_modules/vant') || ~file.indexOf('node_modules/driver.js') ? 375 : 750,
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
          landscapeWidth: (file) =>
            ~file.indexOf('node_modules/vant') || ~file.indexOf('node_modules/driver.js') ? 720 : 1440,
        }),
      ],
    },
  },
}))

function handleCheck() {
  const {
    VITE_APP_LOCALSTORAGE_NAME,
    VITE_APP_API_URL,
    VITE_APP_TITLE,
    VITE_APP_HM_BAIDU,
    VITE_APP_SHARE_TITLE,
    VITE_APP_SHARE_DESC,
    VITE_APP_SHARE_LINK,
    VITE_APP_SHARE_IMGURL,
  } = env

  import('chalk').then(({ default: chalk }) => {
    const { bgMagentaBright, red, green } = chalk

    function logTips(name: string, nameSuccess: string, checkName: string) {
      console.log(!checkName ? red(name) : green(nameSuccess) + green.underline.bold(checkName))
    }

    console.log(bgMagentaBright('Tips:'))
    logTips('网站标题未定义', '网站标题', VITE_APP_TITLE)
    logTips('接口地址未定义', '接口地址', VITE_APP_API_URL)
    logTips('本地存储名称未定义', '本地存储名称', VITE_APP_LOCALSTORAGE_NAME)
    logTips('百度统计ID未定义', '百度统计ID', VITE_APP_HM_BAIDU)
    logTips('微信分享标题未定义', '微信分享标题', VITE_APP_SHARE_TITLE)
    logTips('微信分享描述未定义', '微信分享描述', VITE_APP_SHARE_DESC)
    logTips('微信分享链接未定义', '微信分享链接', VITE_APP_SHARE_LINK)
    logTips('微信分享图片未定义', '微信分享图片', VITE_APP_SHARE_IMGURL)
  })
}
