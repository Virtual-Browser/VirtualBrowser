import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { addGroup, deleteGroup, updateGroup } from '@/api/native'
import type { IGroupRecord } from '@/Interface'

export const useGroupStore = defineStore('group_store', {
  state() {
    const list = useLocalStorage('group', [] as IGroupRecord[])
    return {
      list
    }
  },
  getters: {},
  actions: {
    updateList() {
      const list = useLocalStorage('group', [] as IGroupRecord[])
      this.list.splice(0)
      this.list.push(...list.value)
    },
    async addGroup(item: Omit<IGroupRecord, 'id'>) {
      await addGroup(item)
      this.updateList()
    },
    async removeGroup(id: number) {
      await deleteGroup(id)
      this.updateList()
    },
    async updateGroup(item: IGroupRecord) {
      await updateGroup(item)
      this.updateList()
    }
  }
})
