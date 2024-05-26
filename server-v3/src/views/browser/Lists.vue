<template>
  <div class="px-2 overflow-x-auto" ref="container">
    <Table
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="data"
        :scroll="scroll"
        rowKey="id"
    >
      <template #title>
        <div class="flex space-x-4">
          <Button
              :disabled="selectedRowKeys.length == 0"
              @click="exportBrowserConfig(selectedRowKeys)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256">
              <path
                  fill="#454545"
                  d="M216 112v96a16 16 0 0 1-16 16H56a16 16 0 0 1-16-16v-96a16 16 0 0 1 16-16h24a8 8 0 0 1 0 16H56v96h144v-96h-24a8 8 0 0 1 0-16h24a16 16 0 0 1 16 16M93.66 69.66L120 43.31V136a8 8 0 0 0 16 0V43.31l26.34 26.35a8 8 0 0 0 11.32-11.32l-40-40a8 8 0 0 0-11.32 0l-40 40a8 8 0 0 0 11.32 11.32"
              />
            </svg>
          </Button>
          <Button @click="deleteBrowsers(selectedRowKeys)" :disabled="selectedRowKeys.length == 0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 256 256">
              <path
                  fill="#454545"
                  d="M216 50h-42V40a22 22 0 0 0-22-22h-48a22 22 0 0 0-22 22v10H40a6 6 0 0 0 0 12h10v146a14 14 0 0 0 14 14h128a14 14 0 0 0 14-14V62h10a6 6 0 0 0 0-12M94 40a10 10 0 0 1 10-10h48a10 10 0 0 1 10 10v10H94Zm100 168a2 2 0 0 1-2 2H64a2 2 0 0 1-2-2V62h132Zm-84-104v64a6 6 0 0 1-12 0v-64a6 6 0 0 1 12 0m48 0v64a6 6 0 0 1-12 0v-64a6 6 0 0 1 12 0"
              />
            </svg>
          </Button>

          <Dropdown :trigger="['click']" :disabled="selectedRowKeys.length == 0">
            <Button>
              <div class="flex justify-center items-center">
                <SmallDashOutlined/>
              </div>
            </Button>
            <template #overlay>
              <Menu>
                <MenuItem key="0" @click="visiableGroupModal = true"> 修改分组</MenuItem>
                <MenuItem key="1" @click="openBrowsers(selectedRowKeys)"> 批量创建</MenuItem>
                <MenuItem key="2" @click="createBrowsers()"> 批量启动</MenuItem>
                <!-- <MenuItem key="0" @click="editGroup(selectedRowKeys)"> 修改分组 </MenuItem>
                <MenuItem key="0" @click="openLists(selectedRowKeys)"> 批量打开 </MenuItem> -->
              </Menu>
            </template>
          </Dropdown>

          <div class="grow"></div>
          <div></div>
        </div>
      </template>
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'proxy'">
          <span>
            <template v-if="record.proxy.mode === 0">默认</template>
            <template v-else-if="record.proxy.mode === 1">不使用代理</template>
            <template v-else>
              {{ record.proxy.protocol }}
              {{
                record.proxy.host && record.proxy.port
                    ? ' ' + record.proxy.host + ':' + record.proxy.port
                    : ''
              }}
            </template>
          </span>
        </template>

        <template v-else-if="column.dataIndex === 'timestamp'">
          {{ dayjs(record.timestamp).format('YYYY-MM-DD hh:mm') }}
        </template>

        <template v-else-if="column.dataIndex === 'operation'">
          <Button
              type="primary"
              @click="openBrowser(record as IBrowserConfig)"
              :loading="record.runLoading"
              :disabled="record.isRunning"
          >
            <div class="flex justify-center space-x-2 items-center">
              <ChromeOutlined/>
              <span> 打开 </span>
            </div>
          </Button>
        </template>
        <!-- 更多 -->
        <template v-else-if="column.dataIndex === 'more'">
          <Dropdown :trigger="['click']">
            <a class="ant-dropdown-link" @click.prevent>
              <MoreOutlined/>
            </a>
            <template #overlay>
              <Menu>
                <MenuItem key="0" @click="editBrowser(record)"> 编辑</MenuItem>
                <MenuItem key="1" @click="deleteBrowsers([record.id])"> 删除</MenuItem>
                <MenuDivider/>
                <MenuItem key="3" @click="copyBrowserConfig(record.id)"> 克隆窗口</MenuItem>
              </Menu>
            </template>
          </Dropdown>
        </template>
      </template>
    </Table>
    <EditGroup v-model:open="visiableGroupModal" :ids="selectedRowKeys"/>
  </div>
</template>
<script lang="ts" setup>
import {computed, ref, unref} from 'vue'
import {Table, Button, Dropdown, Menu, MenuItem, MenuDivider} from 'ant-design-vue'
import {ChromeOutlined, MoreOutlined, SmallDashOutlined} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import {ROUTES} from '@/constants'
import {useRouter} from 'vue-router'
import {columns, useListBrowser} from './composables/useListBrowser'
import EditGroup from './components/EditGroup.vue'
import type {IBrowserConfig, IBrowserList} from '@/Interface'

const router = useRouter()
const visiableGroupModal = ref(false)

const {
  container,
  data,
  scroll,
  deleteBrowsers,
  openBrowser,
  openBrowsers,
  createBrowsers,
  exportBrowserConfig,
  copyBrowserConfig
} = useListBrowser()

const selectedRowKeys = ref<IBrowserList['id'][]>([]) // Check here to configure the default column

const onSelectChange = (changableRowKeys: number[]) => {
  console.log('selectedRowKeys changed: ', changableRowKeys)
  selectedRowKeys.value = changableRowKeys
}

const rowSelection = computed(() => {
  return {
    selectedRowKeys: unref(selectedRowKeys),
    onChange: onSelectChange,
    hideDefaultSelections: true
  }
})

const editBrowser = (record: Record<string, any>) => {
  router.push({
    name: ROUTES.BROWSER_EDIT,
    params: {id: record.id}
  })
}
</script>
