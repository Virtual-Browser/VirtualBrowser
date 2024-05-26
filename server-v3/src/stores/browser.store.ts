import type {IBrowserConfig, IGroupRecord} from '@/Interface'
import {
    addBrowser,
    deleteBrowser,
    getBrowser,
    getBrowserList,
    getGroupList,
    updateBrowser
} from '@/api/native'
import {message} from 'ant-design-vue'
import type {FileType} from 'ant-design-vue/es/upload/interface'
import {defineStore} from 'pinia'
import _ from "lodash";

export const useBrowserStore = defineStore('browser_store', {
    state() {
        return {
            groupList: [] as IGroupRecord[],
            browserList: [] as IBrowserConfig[]
        }
    },
    getters: {},
    actions: {
        async updateBrowser() {
            this.browserList = await getBrowserList()
        },
        async getBrowser(id: number) {
            return getBrowser(id)
        },
        async updateBrowserConfig(form: IBrowserConfig) {
            await updateBrowser(form)
            this.updateBrowser()
        },
        async deleteBrowser(id: number) {
            await deleteBrowser(id)
            await this.updateBrowser()
        },
        async addBrowser(form: IBrowserConfig, name: string = '环境') {
            form.timestamp = Date.now()
            await addBrowser(_.cloneDeep(form), name)
            await this.updateBrowser()
        },
        async loadGroupList() {
            this.groupList = await getGroupList()
            this.groupList.unshift({
                id: 0,
                name: '默认',
                remark: ''
            })
        },
        async importBrowser(file: FileType) {
            return new Promise((resolve) => {
                const reader = new FileReader()
                reader.onload = async (e) => {
                    const jsonStr = e.target!.result as string
                    let json
                    try {
                        json = JSON.parse(jsonStr)
                        for (let i = 0; i < json.length; i++) {
                            json[i].timestamp = Date.now()
                            await addBrowser(json[i], '环境')
                        }
                        this.updateBrowser()
                        message.success(`导入成功${json.length}条环境`)
                    } catch (ex) {
                        //@ts-ignore
                        message.error(`${ex.message}`)
                    }
                    resolve(true)
                }
                reader.readAsText(file)
            })
        }
    }
})
