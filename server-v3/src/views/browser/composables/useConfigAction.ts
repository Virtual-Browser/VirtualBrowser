import type { IBrowserConfig } from '@/Interface'
import { ROUTES } from '@/constants'
import { useBrowserStore } from '@/stores/browser.store'
import { message } from 'ant-design-vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useConfigActions = function () {
  const router = useRouter()

  const loading = ref(false)

  const browserStore = useBrowserStore()
  const addBrowser = async (record: IBrowserConfig) => {
    if (!record.id) {
      await browserStore.addBrowser(record)
      await router.push({ name: ROUTES.BROWSER_LIST })
      message.success('创建环境成功')
    } else {
      await browserStore.updateBrowserConfig(record)
      router.push({ name: ROUTES.BROWSER_LIST })
      message.success('修改环境成功')
    }
  }

  const deleteBrowser = async (id: string | number) => {}

  return {
    loading,
    addBrowser,
    deleteBrowser
  }
}
