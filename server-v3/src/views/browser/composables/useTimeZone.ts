import { ref } from 'vue'

import TimeZones from '@/utils/timezones.json'
import type { SelectValue } from 'ant-design-vue/es/select'
import type { BrowserConfig } from '@/Interface'

export const getZone = function (offset: number) {
  const sign = offset > 0 ? '+' : '-'
  const hours = Math.floor(Math.abs(offset))
  const decimal = Math.abs(offset) - hours
  const minutes = Math.round(decimal * 60)
  const paddedMinutes = minutes < 10 ? '0' + minutes : minutes.toString()
  return `UTC${sign}${hours}:${paddedMinutes}`
}

export const useTimeZone = function (form: BrowserConfig) {
  const timeZones = ref(TimeZones)

  const change = function (select: SelectValue) {
    const selItem = timeZones.value.find((item) => item.text == select)
    //@ts-ignore
    form['time-zone'].value = selItem.offset
    //@ts-ignore
    form['time-zone'].zone = getZone(selItem.offset)
    //@ts-ignore
    form['time-zone'].utc = selItem.utc[0]
  }
  const filter = function (inputValue: string, option?: any): boolean {
    return (option.value as string).toLocaleLowerCase().includes(inputValue.toLocaleLowerCase())
  }
  return {
    change,
    filter,
    timeZones
  }
}
