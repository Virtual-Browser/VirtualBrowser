import Languages from '@/utils/languages.json'
import { ref } from 'vue'
export const useSelectLang = function () {
  const languages = ref(Languages)
  const filter = function (input: string, opt: any) {
    const item = languages.value.find((item) => item.code === opt.value)
    return item ? item.lang.includes(input) || item.code.includes(input) : false
  }

  return {
    filter,
    languages
  }
}
