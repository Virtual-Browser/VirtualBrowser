<template>
  <div class="pl-4 h-full flex flex-col" ref="containerRef">
    <Tabs v-model:activeKey="activeKey" class="grow">
      <TabPane key="1" tab="单个创建" class="h-full">
        <div :style="{ height: tabPanleHeight }" class="overflow-auto">
          <div class="lg:w-2/3 w-full p-4">
            <Timeline>
              <TimelineItem>
                <span>基础设置</span>
                <div class="pt-4">
                  <Form :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" autocomplete="off">
                    <FormItem label="名称">
                      <Input v-model:value="formState.name" placeholder="输入浏览器环境名称"/>
                    </FormItem>
                    <FormItem label="选择分组">
                      <Select v-model:value="formState.group" placeholder="选择分组">
                        <SelectOption :value="g.name" v-for="g in browserStore.groupList">{{
                            g.name
                          }}
                        </SelectOption>
                      </Select>
                    </FormItem>
                    <FormItem label="操作系统">
                      <RadioGroup v-model:value="formState.os">
                        <RadioButton :value="p" v-for="p in platforms">{{ p }}</RadioButton>
                      </RadioGroup>
                    </FormItem>
                    <FormItem label="浏览器版本">
                      <Select v-model:value="formState.chrome_version" placeholder="选择浏览器版本">
                        <SelectOption :value="v" v-for="v in versions">{{ v }}</SelectOption>
                      </Select>
                    </FormItem>
                    <FormItem label="Cookie导入">
                      <Switch
                          v-model:checked="formState.cookie.mode"
                          :unCheckedValue="0"
                          :checkedValue="1"
                          class="mb-3 mt-1"
                      />
                      <div class="flex space-x-3">
                        <Textarea
                            v-model:value="formState.cookie.jsonStr"
                            placeholder="支持数组包含JSON格式的Cookie，请点击右侧查看详细格式"
                            :auto-size="{ minRows: 6, maxRows: 10 }"
                            :disabled="formState.cookie.mode == 0"
                        />
                        <Button type="primary" :disabled="formState.cookie.mode !== 1"
                        >切换格式
                        </Button
                        >
                      </div>
                    </FormItem>
                    <FormItem label="启动主页">
                      <div class="flex space-x-2">
                        <div class="shrink-0">
                          <RadioGroup v-model:value="formState.homepage.mode">
                            <RadioButton :value="0">默认</RadioButton>
                            <RadioButton :value="1">自定义</RadioButton>
                          </RadioGroup>
                        </div>
                        <Input
                            v-if="formState.homepage.mode === 1"
                            v-model:value="formState.homepage.value"
                            placeholder="请输入主页URL"
                        />
                      </div>
                    </FormItem>
                  </Form>
                </div>
              </TimelineItem>
              <TimelineItem>
                <span>代理设置</span>
                <div class="pt-4">
                  <Form
                      name="proxy"
                      :label-col="{ span: 4 }"
                      :wrapper-col="{ span: 20 }"
                      autocomplete="off"
                  >
                    <FormItem label="代理设置">
                      <RadioGroup v-model:value="formState.proxy.mode">
                        <RadioButton :value="0">默认</RadioButton>
                        <RadioButton :value="1">不使用代理</RadioButton>
                        <RadioButton :value="2">自定义</RadioButton>
                      </RadioGroup>
                      <div v-if="formState.proxy.mode === 2" class="mt-3">
                        <Form
                            :label-col="{ span: 3 }"
                            :wrapper-col="{ span: 21 }"
                            autocomplete="off"
                        >
                          <FormItem label="代理协议">
                            <Select v-model:value="formState.proxy.protocol" style="width: 330px">
                              <SelectOption value="HTTP"></SelectOption>
                              <SelectOption value="HTTPS"></SelectOption>
                              <SelectOption value="SOCKS5"></SelectOption>
                            </Select>
                          </FormItem>
                          <FormItem label="代理主机">
                            <div class="flex space-x-4 items-center justify-start">
                              <InputGroup compact>
                                <Input v-model:value="formState.proxy.host" style="width: 220px"/>
                                <Input
                                    tabindex="-1"
                                    placeholder=":"
                                    readonly
                                    style="width: 30px"
                                    class="m-0 text-center"
                                />
                                <Input
                                    class="!rounded-md"
                                    v-model:value="formState.proxy.port"
                                    style="width: 80px"
                                />
                                <Button
                                    class="ml-2 !rounded-md"
                                    :loading="checkProxyState.checking"
                                    type="primary"
                                    @click="checkProxy(formState, checkProxyState)"
                                >检测
                                </Button
                                >
                              </InputGroup>
                            </div>
                            <span
                                class="shrink-0"
                                style="font-size: 12px; color: rgb(141, 133, 133)"
                            >
                              可按‘主机:端口:账号:密码’或‘主机:端口’格式粘贴自动识别
                            </span>
                          </FormItem>
                          <FormItem label="代理账号">
                            <Input v-model:value="formState.proxy.user" style="width: 330px"/>
                          </FormItem>
                          <FormItem label="代理密码">
                            <Input v-model:value="formState.proxy.pass" style="width: 330px"/>
                          </FormItem>
                          <FormItem label="API链接">
                            <div class="space-x-2">
                              <Input v-model:value="formState.proxy.API" style="width: 330px"/>
                              <Button type="primary">提取代理</Button>
                            </div>
                          </FormItem>
                        </Form>
                      </div>
                    </FormItem>
                  </Form>
                </div>
              </TimelineItem>
              <TimelineItem>
                <span>高级设置</span>
                <div class="pt-4">
                  <Form :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" autocomplete="off">
                    <FormItem label="User Agent">
                      <RadioGroup v-model:value="formState.ua.mode">
                        <RadioButton :value="0">默认</RadioButton>
                        <RadioButton :value="1">自定义</RadioButton>
                      </RadioGroup>
                      <div class="mt-3 flex space-x-4">
                        <Textarea
                            v-model:value="formState.ua.value"
                            :auto-size="{ minRows: 6, maxRows: 10 }"
                            :disabled="formState.ua.mode == 0"
                        />
                        <Button
                            type="primary"
                            :disabled="formState.ua.mode !== 1"
                            @click="changeUA(formState, osVer, chromeVer)"
                        >随机
                        </Button
                        >
                      </div>
                    </FormItem>

                    <FormItem label="Sec-CH-UA">
                      <RadioGroup v-model:value="formState['sec-ch-ua'].mode">
                        <RadioButton :value="0">默认</RadioButton>
                        <RadioButton :value="1">自定义</RadioButton>
                      </RadioGroup>
                      <template v-if="formState['sec-ch-ua'].mode === 1">
                        <div
                            v-for="(item, i) in formState['sec-ch-ua'].value"
                            :key="i"
                            class="flex space-x-2 items-center mt-3"
                        >
                          <span class="shrink-0"> brand: </span>
                          <Input v-model:value="item.brand"/>
                          <span class="shrink-0"> version: </span>
                          <Input v-model:value="item.version"/>
                          <Button
                              type="primary"
                              danger
                              @click="formState['sec-ch-ua'].value.splice(i, 1)"
                          >删除
                          </Button
                          >
                        </div>
                        <div class="mt-3 text-right">
                          <Button
                              type="primary"
                              @click="formState['sec-ch-ua'].value.push({ brand: '', version: '' })"
                          >新增
                          </Button
                          >
                        </div>
                      </template>
                    </FormItem>
                    <!-- 语言 -->
                    <FormItem label="语言">
                      <div class="flex space-x-3">
                        <Switch
                            v-model:checked="formState['ua-language'].mode"
                            :unCheckedValue="1"
                            :checkedValue="2"
                            class="mb-3 mt-1"
                        />
                        <span class="mt-1">基于IP生成对应国家的浏览器语言，不勾选可自定义</span>
                      </div>
                      <div v-if="formState['ua-language'].mode === 1">
                        <Select
                            v-model:value="formState['ua-language'].language"
                            placeholder="选择语言"
                            show-search
                            :filter-option="filterLangOption"
                        >
                          <SelectOption :value="item.code" v-for="item in languages">
                            <div class="flex justify-between">
                              <span> {{ item.lang }}</span>
                              <span> {{ item.code }}</span>
                            </div>
                          </SelectOption>
                        </Select>
                      </div>
                    </FormItem>
                    <!-- 时区 -->
                    <FormItem label="时区">
                      <div class="flex space-x-3">
                        <Switch
                            v-model:checked="formState['time-zone'].mode"
                            :unCheckedValue="1"
                            :checkedValue="2"
                            class="mb-3 mt-1"
                        />
                        <span class="mt-1">基于IP生成对应的时区，不勾选可自定义</span>
                      </div>
                      <div v-if="formState['time-zone'].mode === 1">
                        <Select
                            v-model:value="formState['time-zone'].name"
                            placeholder="选择时区"
                            show-search
                            :filter-option="filterZoneOption"
                            @change="changeTimezone"
                        >
                          <SelectOption :value="item.text" v-for="item in timeZones"></SelectOption>
                        </Select>
                      </div>
                    </FormItem>
                    <!-- webrtc -->
                    <FormItem label="WebRTC">
                      <RadioGroup v-model:value="formState.webrtc.mode">
                        <RadioButton :value="0">替换</RadioButton>
                        <RadioButton :value="1">允许</RadioButton>
                        <RadioButton :value="2">禁止</RadioButton>
                      </RadioGroup>
                    </FormItem>
                    <!-- 地理位置 -->
                    <FormItem label="地理位置">
                      <RadioGroup v-model:value="formState.location.enable">
                        <RadioButton :value="0">询问</RadioButton>
                        <RadioButton :value="1">允许</RadioButton>
                        <RadioButton :value="2">禁止</RadioButton>
                      </RadioGroup>
                      <div class="mt-3" v-if="formState.location.enable != 2">
                        <div class="flex space-x-3">
                          <Switch
                              v-model:checked="formState.location.mode"
                              :checkedValue="2"
                              :unCheckedValue="1"
                              class="mb-3 mt-1"
                          />
                          <span class="mt-1">基于IP生成对应的地理位置，不勾选可自定义</span>
                        </div>
                        <div v-if="formState.location.mode == 1" class="mt-3 w-60">
                          <FormItem label="经度">
                            <Input v-model:value="formState.location.longitude"/>
                          </FormItem>
                          <FormItem label="维度">
                            <Input v-model:value="formState.location.latitude"/>
                          </FormItem>
                          <FormItem label="精度（米）">
                            <Input v-model:value="formState.location.precision"/>
                          </FormItem>
                        </div>
                      </div>
                    </FormItem>
                    <!-- 分辨率 -->
                    <FormItem label="分辨率">
                      <div class="flex space-x-2">
                        <div class="shrink-0">
                          <RadioGroup v-model:value="formState.screen.mode">
                            <RadioButton :value="0">跟随电脑</RadioButton>
                            <RadioButton :value="1">自定义</RadioButton>
                          </RadioGroup>
                        </div>
                        <Select
                            v-if="formState.screen.mode === 1"
                            v-model:value="formState.screen._value"
                            placeholder="选择分辨率"
                        >
                          <SelectOption :value="item" v-for="item in resolutionList"></SelectOption>
                        </Select>
                      </div>
                    </FormItem>
                    <!-- 字体 -->
                    <FormItem label="字体">
                      <RadioGroup v-model:value="formState.fonts.mode">
                        <RadioButton :value="0">系统默认</RadioButton>
                        <RadioButton :value="1">随机匹配</RadioButton>
                      </RadioGroup>
                    </FormItem>
                    <!-- Canvas -->
                    <FormItem label="Canvas">
                      <RadioGroup v-model:value="formState.canvas.mode">
                        <RadioButton :value="0">默认</RadioButton>
                        <RadioButton :value="1">随机</RadioButton>
                      </RadioGroup>
                    </FormItem>
                    <!-- WebGL图像 -->
                    <FormItem label="WebGL图像">
                      <RadioGroup v-model:value="formState['webgl-img'].mode">
                        <RadioButton :value="0">默认</RadioButton>
                        <RadioButton :value="1">随机</RadioButton>
                      </RadioGroup>
                    </FormItem>
                    <!-- WebGL元数据 -->
                    <FormItem label="WebGL元数据">
                      <RadioGroup v-model:value="formState.webgl.mode">
                        <RadioButton :value="0">默认</RadioButton>
                        <RadioButton :value="1">自定义</RadioButton>
                      </RadioGroup>
                    </FormItem>
                    <!-- WebGL厂商 -->
                    <FormItem label="WebGL厂商" v-if="formState.webgl.mode == 1">
                      <Select v-model:value="formState.webgl.vendor" placeholder="请选择">
                        <SelectOption
                            :value="item"
                            :key="i"
                            v-for="(item, i) in webGLVendors"
                        ></SelectOption>
                      </Select>
                    </FormItem>
                    <!-- WebGL渲染 -->
                    <FormItem label="WebGL渲染" v-if="formState.webgl.mode == 1">
                      <Select v-model:value="formState.webgl.render" placeholder="请选择">
                        <SelectOption
                            :value="item"
                            :key="i"
                            v-for="(item, i) in webGLRenders"
                        ></SelectOption>
                      </Select>
                    </FormItem>
                    <!-- AudioContext -->
                    <FormItem label="AudioContext">
                      <RadioGroup v-model:value="formState['audio-context'].mode">
                        <RadioButton :value="0">默认</RadioButton>
                        <RadioButton :value="1">随机</RadioButton>
                      </RadioGroup>
                    </FormItem>
                    <!-- AudioContext -->
                    <FormItem label="ClientRects">
                      <RadioGroup v-model:value="formState['client-rects'].mode">
                        <RadioButton :value="0">默认</RadioButton>
                        <RadioButton :value="1">随机</RadioButton>
                      </RadioGroup>
                    </FormItem>
                    <!-- AudioContext -->
                    <FormItem label="Speech Voices">
                      <RadioGroup v-model:value="formState['speech_voices'].mode">
                        <RadioButton :value="0">默认</RadioButton>
                        <RadioButton :value="1">随机</RadioButton>
                      </RadioGroup>
                    </FormItem>
                    <!-- CPU -->
                    <FormItem label="CPU">
                      <div class="w-64 flex space-x-2 items-center">
                        <Select v-model:value="formState.cpu.value" placeholder="请选择">
                          <SelectOption :value="2"></SelectOption>
                          <SelectOption :value="4"></SelectOption>
                          <SelectOption :value="5"></SelectOption>
                          <SelectOption :value="6"></SelectOption>
                          <SelectOption :value="12"></SelectOption>
                        </Select>
                        <span class="shrink-0">核</span>
                      </div>
                    </FormItem>
                    <!-- 内存 -->
                    <FormItem label="内存">
                      <div class="w-64 flex space-x-2 items-center">
                        <Select v-model:value="formState.memory.value" placeholder="请选择">
                          <SelectOption :value="2"></SelectOption>
                          <SelectOption :value="4"></SelectOption>
                          <SelectOption :value="8"></SelectOption>
                          <SelectOption :value="16"></SelectOption>
                          <SelectOption :value="32"></SelectOption>
                          <SelectOption :value="64"></SelectOption>
                        </Select>
                        <span class="shrink-0">GB</span>
                      </div>
                    </FormItem>

                    <!-- 设备名称 -->
                    <FormItem label="设备名称">
                      <div class="flex space-x-2">
                        <div class="shrink-0">
                          <RadioGroup v-model:value="formState['device-name'].mode">
                            <RadioButton :value="0">默认</RadioButton>
                            <RadioButton :value="1">自定义</RadioButton>
                          </RadioGroup>
                        </div>
                        <template v-if="formState['device-name'].mode == 1">
                          <Input v-model:value="formState['device-name'].value"/>
                          <Button type="primary" @click="changeDevicename(formState)"
                          >换一换
                          </Button
                          >
                        </template>
                      </div>
                    </FormItem>
                    <!-- 设备名称 -->
                    <FormItem label="MAC地址">
                      <div class="flex space-x-2">
                        <div class="shrink-0">
                          <RadioGroup v-model:value="formState.mac.mode">
                            <RadioButton :value="0">默认</RadioButton>
                            <RadioButton :value="1">自定义</RadioButton>
                          </RadioGroup>
                        </div>
                        <template v-if="formState.mac.mode == 1">
                          <Input v-model:value="formState.mac.value"/>
                          <Button type="primary" @click="changeMac(formState)">换一换</Button>
                        </template>
                      </div>
                    </FormItem>
                    <!-- Do Not Track -->
                    <FormItem label="Do Not Track">
                      <Switch
                          v-model:checked="formState.dnt.value"
                          :unCheckedValue="0"
                          :checkedValue="1"
                      />
                    </FormItem>
                    <!-- SSL -->
                    <FormItem label="SSL">
                      <RadioGroup v-model:value="formState.ssl.mode">
                        <RadioButton :value="1">开启</RadioButton>
                        <RadioButton :value="0">关闭</RadioButton>
                      </RadioGroup>
                    </FormItem>
                    <!-- 禁用SSL特性 -->
                    <FormItem label="禁用SSL特性" v-if="formState.ssl.mode == 1">
                      <CheckboxGroup v-model:value="formState.ssl.value">
                        <div class="w-2/3 mt-1" v-for="it in sslList">
                          <Checkbox :value="it.value">
                            {{ it.label }}
                          </Checkbox>
                        </div>
                      </CheckboxGroup>
                    </FormItem>
                    <!-- 端口扫描保护 -->
                    <FormItem label="端口扫描保护">
                      <RadioGroup v-model:value="formState['port-scan'].mode">
                        <RadioButton :value="1">开启</RadioButton>
                        <RadioButton :value="0">关闭</RadioButton>
                      </RadioGroup>
                    </FormItem>
                    <!-- 扫描白名单 -->
                    <FormItem label="扫描白名单" v-if="formState['port-scan'].mode == 1">
                      <Input
                          :value="formState['port-scan'].value.join(',')"
                          @change="portScanChange"
                      />
                    </FormItem>
                    <!-- 硬件加速 -->
                    <FormItem label="硬件加速">
                      <Switch
                          v-model:checked="formState.gpu.value"
                          :unCheckedValue="0"
                          :checkedValue="1"
                      />
                    </FormItem>
                    <FormItem label="启动参数">
                      <Textarea
                          v-model:value="formState.start.value"
                          :auto-size="{ minRows: 6, maxRows: 10 }"
                          placeholder="example:
-disable-notifications
-blink-settings=imagesEnabled=false"
                      />
                    </FormItem>
                  </Form>
                </div>
              </TimelineItem>
              <TimelineItem></TimelineItem>
            </Timeline>
          </div>
        </div>
      </TabPane>
    </Tabs>
    <div
        class="shrink-0 p-2 space-x-4 flex justify-center items-center border-t border-solid border-gray-100"
    >
      <Button @click="$router.back()">取消</Button>
      <Button type="primary" @click="addBrowser(formState)">确定</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  Tabs,
  TabPane,
  FormItem,
  Form,
  Button,
  Checkbox,
  Input,
  InputGroup,
  Timeline,
  TimelineItem,
  Select,
  SelectOption,
  RadioGroup,
  RadioButton,
  Switch,
  Textarea,
  CheckboxGroup,
  Tooltip
} from 'ant-design-vue'
import {reactive, ref} from 'vue'
import {useWatch} from './composables/useWatch'
import {
  useDefaultConfig,
  changeDevicename,
  changeMac,
  changeUA
} from './composables/useDefaultConfig'
import {useSelectLang} from './composables/useSelectLang'
import {useTimeZone} from './composables/useTimeZone'
import {usePortScan} from './composables/usePortScan'
import {useResizeObserver} from '@vueuse/core'
import {useProxyAction, checkProxy} from './composables/useProxyAction'
import {useBrowserStore} from '@/stores/browser.store'
import {useConfigActions} from './composables/useConfigAction'

const platforms = ['Win 7', 'Win 8', 'Win 10', 'Win 11']
const resolutionList = [
  '800 x 600',
  '1024 x 768',
  '1280 x 720',
  '1280 x 800',
  '1280 x 960',
  '1280 x 1024',
  '1360 x 768',
  '1400 x 900',
  '1400 x 1050',
  '1600 x 900',
  '1600 x 1200',
  '1920 x 1080',
  '1920 x 1200',
  '2048 x 1152',
  '2304 x 1440',
  '2560 x 1440',
  '2560 x 1600',
  '2880 x 1800',
  '5120 x 2880'
]

const browserStore = useBrowserStore()

const activeKey = ref('1')
const containerRef = ref()
const tabPanleHeight = ref('auto')
const {
  formState,
  sslList,
  chromeVer,
  osVer,
  versions,
  webGLVendors,
  webGLRenders
} = await useDefaultConfig()
useWatch(formState, chromeVer, osVer, versions, webGLVendors, webGLRenders)
//加载分组
browserStore.loadGroupList()

const {addBrowser} = useConfigActions()
const {checkProxyState} = useProxyAction(formState)
const {change: portScanChange} = usePortScan(formState)
const {filter: filterLangOption, languages} = useSelectLang()
const {filter: filterZoneOption, timeZones, change: changeTimezone} = useTimeZone(formState)

useResizeObserver(containerRef, () => {
  console.log(containerRef.value)
  const parent = containerRef.value.parentElement as HTMLElement
  const pHeight = parent.offsetHeight
  tabPanleHeight.value = pHeight - 62 - 50 + 'px'
  console.log(tabPanleHeight.value)
})
</script>
