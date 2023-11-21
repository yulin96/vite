interface IUserStore {
  userInfo: {
    name?: string
    phone?: string
    code?: string
    errId?: string
    [x: string]: any
  }
  wxInfo: {
    openid?: string
    nickname?: string
    portrait?: string
  }
  [x: string]: any
}

export const useStore = defineStore(
  'user',
  () => {
    const user = reactive<IUserStore>({ userInfo: {}, wxInfo: {} })

    const clearUser = () => {
      user.userInfo = {}
      user.wxInfo = {}
    }

    return { user, clearUser }
  },
  {
    persist: {
      key: import.meta.env.VITE_APP_LOCALSTORAGE_NAME || 'test',
      paths: undefined,
      beforeRestore: () => {},
      debug: true,
    },
  },
)
