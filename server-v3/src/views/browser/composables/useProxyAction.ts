import { reactive, ref, type MaybeRef, type Ref } from 'vue'
import type { useDefaultConfig } from './useDefaultConfig'
import { Modal } from 'ant-design-vue'
import { chromeSendTimeout } from '@/api/native'
import type { IBrowserConfig } from '@/Interface'

export type ICheckProxyState = {
  checking: boolean
}

export const preProcessData = function (data: ReturnType<typeof useDefaultConfig>['formState']) {
  const { proxy } = data
  if (proxy.mode === 2) {
    let url = proxy.protocol.toLowerCase() + '://'
    if (proxy.user) {
      url += proxy.user + ':' + proxy.pass + '@'
    }
    url += proxy.host
    if (proxy.port) {
      url += ':' + proxy.port
    }
    proxy.url = url
  }
  data['sec-ch-ua'].value = data['sec-ch-ua'].value.filter((item) => {
    return item.brand && item.version
  })
}

export const checkProxy = async function (form: IBrowserConfig, checkProxyState: ICheckProxyState) {
  checkProxyState.checking = true
  preProcessData(form)
  let timeout = false
  const ret = await chromeSendTimeout('checkProxy', 10 * 1000, form.proxy.url).catch((err) => {
    timeout = err === 'timeout'
  })
  if (timeout || !ret) {
    Modal.error({
      title: '代理检测',
      content: `代理：${form.proxy.url}\n
      检测${ret ? '成功' : timeout ? '超时' : '失败'}`
    })
  } else {
    Modal.success({
      title: '代理检测',
      content: `代理：${form.proxy.url}\n检测成功`
    })
  }
  checkProxyState.checking = false
}

export const useProxyAction = function (form: ReturnType<typeof useDefaultConfig>['formState']) {
  const checkProxyState = reactive<ICheckProxyState>({ checking: false })
  const getProxy = function () {}

  return {
    checkProxyState,
    getProxy
  }
}
