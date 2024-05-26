<template>
  <div class="px-2 overflow-x-auto" ref="container">
    <Table
      rowKey="id"
      :row-selection="rowSelection"
      :columns="columns"
      :data-source="data"
      :scroll="scroll"
    >
      <template #title>
        <div class="flex space-x-4">
          <Button type="primary" @click="open = true">
            <div class="flex items-center justify-center">
              <PlusOutlined /><span class="ml-1">创建分組</span>
            </div>
          </Button>
          <div class="grow"></div>
          <div></div>
        </div>
      </template>
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'createTime'">
          {{ dayjs(record.timestamp).format('YYYY-MM-DD hh:mm') }}
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <Button type="primary" @click="removeGroup(record)">
            <div class="flex justify-center space-x-2 items-center">
              <DeleteOutlined />
              <span> 删除 </span>
            </div>
          </Button>
        </template>
        <template v-if="column.dataIndex === 'more'">
          <Dropdown :trigger="['click']">
            <a class="ant-dropdown-link" @click.prevent>
              <MoreOutlined />
            </a>
            <template #overlay>
              <Menu>
                <MenuItem key="0" @click="openEditGroupMoal(record as IGroupRecord)">
                  编辑
                </MenuItem>
                <!-- <MenuDivider />
                <MenuItem key="3"> 导出 </MenuItem> -->
              </Menu>
            </template>
          </Dropdown>
        </template>
      </template>
    </Table>
  </div>
  <Modal v-model:open="open" title="创建分组" @ok="createGroup" ok-text="确定" cancel-text="取消">
    <div class="space-y-3 mt-4">
      <Input v-model:value="groupForm.name" placeholder="输入分组名称" />
      <Textarea v-model:value="groupForm.remark" placeholder="输入分组备注" />
    </div>
  </Modal>
</template>
<script lang="ts" setup>
import { computed, createVNode, reactive, ref, unref, watch } from 'vue'
import { reactify, useResizeObserver } from '@vueuse/core'
import { Table, Button, Dropdown, Menu, MenuItem, Modal, Input, Textarea } from 'ant-design-vue'
import { DeleteOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons-vue'
import type { IGroupRecord } from '@/Interface'
import { useGroupStore } from '@/stores/group.store'
import { useGroup, columns } from './composables/useGroup'
import dayjs from 'dayjs'

const groupStore = useGroupStore()
const container = ref()
const open = ref(false)
const data = computed(() => groupStore.list)

const { groupForm, createGroup, removeGroup, openEditGroupMoal } = useGroup(open)

const scroll = ref({
  x: 1500,
  y: 300
})

const selectedRowKeys = ref<IGroupRecord['id'][]>([]) // Check here to configure the default column
const rowSelection = computed(() => {
  return {
    selectedRowKeys: unref(selectedRowKeys),
    onChange: onSelectChange,
    hideDefaultSelections: true
  }
})

const onSelectChange = (changableRowKeys: number[]) => {
  console.log('selectedRowKeys changed: ', changableRowKeys)
  selectedRowKeys.value = changableRowKeys
}

const setScrollY = () => {
  const height = container.value?.parentElement?.offsetHeight
  scroll.value.y = height ? height - 190 : 400
}

useResizeObserver(container, setScrollY)
</script>
