<template>
  <div class="w-screen h-screen flex overflow-hidden">
    <div class="shrink-0 space-y-4 flex flex-col">
      <div class="mt-5 p-4 shrink-0">
        <div class="flex justify-center items-center space-x-2">
          <img
            width="34"
            src="data:image/png;base64,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"
            alt=""
            srcset=""
          />
          <span class="text-2xl">VirtualBrowser</span>
        </div>
      </div>
      <div class="shrink-0 p-2">
        <Button
          :disabled="disableCreateButton"
          class="w-full"
          size="large"
          type="primary"
          @click="addBrowser"
        >
          <div class="flex items-center space-x-2 justify-center">
            <PlusOutlined />
            <span>新建环境</span>
          </div>
        </Button>
        <Button class="w-full mt-2 flex justify-center items-center" size="large">
          <Upload
            :disabled="disableCreateButton"
            :file-list="fileList"
            :before-upload="beforeUpload"
          >
            <div class="flex items-center space-x-2 justify-center">
              <upload-outlined style="font-size: 16px"></upload-outlined>
              <span style="font-size: 1rem">导入环境</span>
            </div>
          </Upload>
        </Button>
      </div>
      <div class="grow">
        <Menu
          v-model:selectedKeys="state.selectedKeys"
          mode="inline"
          :open-keys="state.openKeys"
          :items="items"
          @click="clickMenu"
        ></Menu>
      </div>
      <div class="flex justify-center">
        <img src="@/assets/images/VirtualBrowser-qq-group.png" alt="" srcset="" />
      </div>
    </div>
    <div class="flex flex-col grow bg-[#f9f9f9] p-4 overflow-auto">
      <div class="shrink-0">
        <PageHeader :ghost="true" :title="route.meta.title" v-bind="headerProps">
          <template #extra>
            <Badge count="5">
              <Button key="3" class="group">
                <div class="flex items-center justify-center group-hover:animate-spin">
                  <SyncOutlined />
                </div>
              </Button>
            </Badge>
          </template>
        </PageHeader>
      </div>
      <Suspense>
        <div class="bg-white grow rounded-md overflow-auto">
          <RouterView></RouterView>
        </div>
      </Suspense>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  type ItemType,
  Menu,
  PageHeader,
  Button,
  Badge,
  Upload,
  type UploadProps
} from 'ant-design-vue'
import { VueElement, computed, h, reactive, ref, watch, watchPostEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  HomeOutlined,
  PlusOutlined,
  AppstoreAddOutlined,
  SyncOutlined,
  UploadOutlined
} from '@ant-design/icons-vue'
import IconGroup from '@/components/icons/IconGroup.vue'
import IconTrash from '@/components/icons/IconTrash.vue'
import IconList from '@/components/icons/IconList.vue'
import { ROUTES } from '@/constants'
import { useBrowserStore } from '@/stores/browser.store'
import type { MenuClickEventHandler, MenuInfo } from 'ant-design-vue/es/menu/src/interface'

type Key = string | number

const router = useRouter()
const route = useRoute()
const browserStore = useBrowserStore()
const fileList = ref<UploadProps['fileList']>([])
const uploading = ref<boolean>(false)
const disableCreateButton = computed(
  () => route.name === ROUTES.BROWSER_EDIT || route.name === ROUTES.BROWSER_CONFIG
)

function getItem(
  label: VueElement | string,
  key: string,
  icon?: any,
  children?: ItemType[],
  type?: 'group'
): ItemType {
  return {
    key,
    icon,
    children,
    label,
    type
  } as ItemType
}
const items: ItemType[] = reactive([
  getItem('常用', 'home', () => h(HomeOutlined), [
    getItem('环境管理', 'browser_list', () => h(IconList)),
    getItem('分组管理', 'group_list', () => h(IconGroup))
    // getItem('回收站', 'trash', () => h(IconTrash))
  ])
])

const state = reactive({
  rootSubmenuKeys: ['home'],
  openKeys: ['home'],
  selectedKeys: []
})

const headerProps = ref<Record<string, unknown>>({})

const clickMenu = (e: MenuInfo) => {
  router.push({ name: e.key as string })
}

const addBrowser = () => {
  state.selectedKeys = []
  router.push({ name: ROUTES.BROWSER_CONFIG })
}

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  browserStore.importBrowser(file).then(() => {
    router.push({ name: ROUTES.BROWSER_LIST })
  })
  return false
}
watchPostEffect(() => {
  if (route.meta.back) {
    headerProps.value.onBack = () => router.back()
  } else {
    delete headerProps.value['onBack']
  }
})

watchPostEffect(() => {
  const name = route.name
  state.selectedKeys = [name]
})
</script>
