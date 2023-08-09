/// <reference types="vite/client" />

declare module 'weixin-js-sdk'
declare module 'console' {
  export = typeof import('console')
}

declare const html2canvas: typeof import('html2canvas').default
declare const lottie: typeof import('lottie-web').default

declare const WeixinJSBridge: any
declare const VConsole: any

interface ILinkTo {
  (path?: string, query?: { [name: string]: any }, params?: { [name: string]: any }): void
}

interface ImportMetaEnv {
  readonly VITE_APP_VCONSOLE_ID: string
  readonly VITE_APP_API_URL: string
  readonly VITE_APP_WS_API_URL: string
  readonly VITE_APP_LOCALSTORAGE_NAME: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_HM_BAIDU: string
  readonly VITE_APP_SHARE_TITLE: string
  readonly VITE_APP_SHARE_DESC: string
  readonly VITE_APP_SHARE_LINK: string
  readonly VITE_APP_SHARE_IMGURL: string
}