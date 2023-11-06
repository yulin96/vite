export const useStoreScan = defineStore(
  'scan',
  () => {
    const user = reactive<IUserStore>({ userInfo: {}, wxInfo: {}, keepAliveId: 1 })

    const clearUser = () => {
      Object.keys(user).forEach((key) => {
        delete user[key]
      })
    }

    return { user, clearUser }
  },
  {
    persist: {
      key: (import.meta.env.VITE_APP_LOCALSTORAGE_NAME ?? '') + '_scan',
      paths: undefined,
      beforeRestore: () => {},
      debug: true,
    },
  },
)