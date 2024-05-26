import type { ChangeEvent } from 'ant-design-vue/es/_util/EventInterface'

export const usePortScan = function (form: { 'port-scan': { value: string[] } }) {
  const change = function (e: ChangeEvent) {
    form['port-scan'].value = e.target.value!.split(',').filter((item) => /^\d+$/.test(item))
  }
  return {
    change
  }
}
