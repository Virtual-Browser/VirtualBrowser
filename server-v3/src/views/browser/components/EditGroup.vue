<template>
  <Modal
    v-model:open="open"
    title="确定要修改以下编号的环境分组？"
    @ok="handleOk"
    ok-text="确定"
    cancel-text="取消"
  >
    <div class="pt-4 space-y-3">
      <div>
        <span class="mr-2">环境编号</span>
        <Tag v-for="id in ids">{{ id }}</Tag>
      </div>
      <Form :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }" autocomplete="off">
        <FormItem label="分组">
          <Select v-model:value="group" placeholder="选择分组">
            <SelectOption :value="g.name" v-for="g in browserStore.groupList">{{
              g.name
            }}</SelectOption>
          </Select>
        </FormItem>
      </Form>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { useBrowserStore } from '@/stores/browser.store'
import { Modal, Input, Form, FormItem, Select, SelectOption, Tag, message } from 'ant-design-vue'
import { ref, watch, type PropType } from 'vue'

const props = defineProps({
  ids: { type: Array as PropType<number[]>, default: () => [] }
})

const open = defineModel('open', { default: false })
const group = ref('')
const browserStore = useBrowserStore()

browserStore.loadGroupList()

const handleOk = async function () {
  const ids = props.ids
  for (let index = 0; index < ids.length; index++) {
    const id = ids[index]
    const item = browserStore.browserList.find((item) => item.id === id)
    if (item) {
      await browserStore.updateBrowserConfig({ ...item, id, group: group.value })
    }
  }
  open.value = false
  message.success('分组修改成功')
}

watch(open, () => {
  group.value = ''
})
</script>
