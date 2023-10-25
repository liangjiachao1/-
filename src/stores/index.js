import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persist)

export default pinia

// 这句话表示把user文件中的数据和方法导出
export * from './modules/user'
