import type { IGroupRecord } from '@/Interface'
import { useGroupStore } from '@/stores/group.store'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { Modal, message } from 'ant-design-vue'
import { createVNode, reactive, ref, watch, type Ref } from 'vue'

export const columns = ref([
  {
    title: '分组',
    dataIndex: 'name',
    ellipsis: true
  },
  {
    title: '分组环境数',
    dataIndex: 'relation',
    width: 300,
    ellipsis: true
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 200,
    ellipsis: true
  },
  {
    title: '操作',
    dataIndex: 'operation',
    fixed: 'right',
    width: 100
  },
  {
    title: '',
    dataIndex: 'more',
    fixed: 'right',
    width: 50
  }
  //   {
  //     title: '创建人',
  //     dataIndex: 'createTime',
  //     width: 200,
  //     ellipsis: true
  //   }
])

export const useGroup = function (open: Ref<boolean>) {
  const groupStore = useGroupStore()

  const groupForm = ref<Omit<IGroupRecord, 'id'> & { id?: number }>({
    name: '',
    remark: ''
  })

  const createGroup = async () => {
    if (groupForm.value.id) {
      await groupStore.updateGroup({
        ...groupForm.value,
        id: groupForm.value.id
      })
      message.success('更新成功')
    } else {
      await groupStore.addGroup(groupForm.value)
      message.success('添加成功')
    }
    open.value = false
  }

  const removeGroup = ({ id, name }: { id: number; name: string }) => {
    Modal.confirm({
      title: '是否确认删除当前分组?',
      icon: createVNode(ExclamationCircleOutlined),
      content: createVNode('div', { style: 'color:red;' }, `分组 : ${name}`),
      onOk() {
        Modal.confirm({
          title: '删除分组',
          icon: createVNode(ExclamationCircleOutlined),
          content: createVNode(
            'div',
            { style: 'color:red;' },
            `注意：此操作将删除分组内的环境和数据。`
          ),
          onOk() {
            groupStore.removeGroup(id)
          },
          okText: '确定',
          cancelText: '取消',
          onCancel() {},
          class: 'test'
        })
      },
      okText: '确定',
      cancelText: '取消',
      onCancel() {},
      class: 'test'
    })
  }
  const openEditGroupMoal = (item: IGroupRecord) => {
    open.value = true
    Object.assign(groupForm, item)
  }

  watch(open, (val) => {
    if (!val) {
      groupForm.value = {
        name: '',
        remark: ''
      }
    }
  })

  return {
    groupForm,
    createGroup,
    removeGroup,
    openEditGroupMoal
  }
}
