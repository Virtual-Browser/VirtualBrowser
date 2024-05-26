import {useBrowserStore} from '@/stores/browser.store'
import {ExclamationCircleOutlined} from '@ant-design/icons-vue'
import {useResizeObserver} from '@vueuse/core'
import {Modal, Tag, message} from 'ant-design-vue'
import {computed, createVNode, defineComponent, reactive, ref, watch, watchPostEffect} from 'vue'
import {useRouter} from 'vue-router'
import {chromeSend} from '@/api/native'
import {checkProxy, type ICheckProxyState} from './useProxyAction'
import {saveAs} from 'file-saver'
import type {IBrowserConfig, IfetchAndParseAPIData} from '@/Interface'
import {ROUTES} from '@/constants'

export const columns = [
    {
        title: '#',
        dataIndex: 'index',
        fixed: 'left',
        width: 50
    },
    {
        title: '名称',
        dataIndex: 'name',
        width: 200,
        ellipsis: true
    },
    {
        title: '分组',
        dataIndex: 'group'
    },
    {
        title: '代理',
        dataIndex: 'proxy'
    },
    {
        title: '创建时间',
        dataIndex: 'timestamp'
    },
    {
        title: '最近打开',
        dataIndex: 'proxy'
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
]

const delCom = defineComponent({
    props: {
        ids: {type: Array, default: () => []}
    },
    setup(props) {
        return () => (
            <div>
                <div>您确定要删除以下编号的环境吗？</div>
                <div>
                    <span class="mr-2">环境编号</span>
                    {props.ids.map((id) => {
                        return <Tag>{id}</Tag>
                    })}
                </div>
            </div>
        )
    }
})

const fetchAndParseAPI = async (apiData: string): Promise<IfetchAndParseAPIData> => {
    const response = await fetch(apiData)
    if (!response.ok) {
        message.warning('响应错误，请检查API接口有效性', 2000)
        throw new Error(`网络响应不是 ok，状态码为：${response.status}`)
    }

    let data
    const clonedResponse = response.clone()
    try {
        data = await response.json()
    } catch (jsonError) {
        const text = await clonedResponse.text()
        const parts = text.split(':')
        switch (parts.length) {
            case 4:
                data = {user: parts[0] || '', pass: parts[1] || '', ip: parts[2], port: parts[3]}
                break
            case 2:
                data = {ip: parts[0], port: parts[1]}
                break
            default:
                message.warning(
                    '响应格式既不是有效的JSON格式也不是有效的[ip:端口]或[用户名:密码:IP:端口]格式',
                    2000
                )
                throw new Error(
                    '响应格式既不是有效的 JSON 也不是有效的 ip:port 或 用户名:密码:IP:端口 格式'
                )
        }
    }

    if (!data || !data.ip || !data.port) {
        message.warning('响应不包含ip或端口', 2000)
        throw new Error('API 响应不包含 ip 或 port')
    }

    return data
}

export const useListBrowser = function () {
    const router = useRouter()
    const browserStore = useBrowserStore()
    const container = ref()
    const scroll = ref({x: 1500, y: 300})
    const checkProxyState = reactive<ICheckProxyState>({checking: false})
    const data = computed(() => browserStore.browserList)

    const setScrollY = () => {
        if (container.value) {
            debugger
            const height = container.value?.parentElement?.offsetHeight
            scroll.value.y = height ? height - 190 : 400
        }
    }

    const updateProxyData = function (
        proxyData: IBrowserConfig['proxy'],
        data: IfetchAndParseAPIData
    ) {
        proxyData.host = data.ip
        proxyData.port = data.port
        proxyData.user = data.user || ''
        proxyData.pass = data.pass || ''
    }

    const exportBrowserConfig = (ids: number[]) => {
        const currentDate = new Date().toISOString().replace(/[-:]/g, '')
        const fileName = 'Virtual-Browser_' + currentDate + '.json'
        const blob = new Blob(
            [
                JSON.stringify(
                    data.value.filter((v) => v.id && ids.includes(v.id)),
                    null,
                    2
                )
            ],
            {
                type: 'application/json;charset=utf-8'
            }
        )
        saveAs(blob, fileName)
    }

    const updateBrowserConfig = async (record: IBrowserConfig) => {
        await browserStore.updateBrowserConfig(record)
        await router.push({name: ROUTES.BROWSER_LIST})
        message.success('修改环境成功')
    }

    const copyBrowserConfig = async (id: number) => {
        const record = await browserStore.getBrowser(id)
        if (record) {
            record.name = record.name + ' 复制'
            await browserStore.addBrowser(record)
            await router.push({name: ROUTES.BROWSER_LIST})
            message.success('复制环境成功')
        }
    }

    const deleteBrowsers = (ids: number[]) => {
        Modal.confirm({
            title: '提示',
            icon: createVNode(ExclamationCircleOutlined),
            content: createVNode(delCom, {ids: ids}),
            async onOk() {
                try {
                    for (let index = 0; index < ids.length; index++) {
                        const id = ids[index]
                        await browserStore.deleteBrowser(id)
                    }
                    browserStore.updateBrowser()
                    message.success('删除环境成功')
                } catch (error) {
                    console.error('Error during batch delete:', error)
                }
            },
            okText: '确定',
            cancelText: '取消',
            onCancel() {
            }
        })
    }

    const editRemark = function (ids: number[]) {
        debugger
    }

    const openBrowser = async function (record: IBrowserConfig) {
        if (record.proxy && record.proxy.API) {
            try {
                const data = await fetchAndParseAPI(record.proxy.API)
                //更新代理
                updateProxyData(record.proxy, data)
                //写入storage和dat
                updateBrowserConfig(record)
                //重新更新列表
                browserStore.updateBrowser()
            } catch (error) {
                console.error('请求代理 API 失败:', error)
                return
            }
            //检查代理，设置
            checkProxy(record, checkProxyState)
        }
        chromeSend('launchBrowser', record.id!.toString())
        record.runLoading = true
    }

    const openBrowsers = async function (ids: number[]) {
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i]
            const record = await browserStore.getBrowser(id)
            if (record) {
                await openBrowser(record)
            }
        }
    }

    const createBrowsers = () => {

    }

    browserStore.updateBrowser()

    useResizeObserver(container, setScrollY)

    watchPostEffect(setScrollY)

    return {
        scroll,
        container,
        data,
        deleteBrowsers,
        copyBrowserConfig,
        openBrowser,
        openBrowsers,
        createBrowsers,
        checkProxyState,
        exportBrowserConfig,
        editRemark
    }
}
