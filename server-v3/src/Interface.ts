export interface BrowserConfig {
  name: string
  group: string
  os: string
  proxy: {
    host: string
    port: string
    user: string
    pass: string
  }
  screen: {
    _value: string
    width: number
    height: number
  }
  chrome_version: string | number
  'sec-ch-ua': {
    value: { brand: string; version: string | number }[]
  }
  'ua-full-version': {
    value: string
  }
  ua: {
    mode: number
    value: string
  }
}

export interface IBrowserList {
  id: number
  name: string
  group: string[]
  proxy: string
  timestamp?: string
}
export interface IGroupRecord {
  id: number
  name: string
  remark: string
  timestamp?: string
}

export interface IBrowserConfig {
  name: string
  group: string
  os: string
  chrome_version: string
  proxy: IProxy
  cookie: ICookie
  homepage: IHomepage
  ua: IHomepage
  'ua-full-version': IHomepage
  'sec-ch-ua': ISecchua
  'ua-language': IUalanguage
  'time-zone': ITimezone
  webrtc: IWebrtc
  location: ILocation
  screen: IScreen
  fonts: IFonts
  canvas: ICanvasOrWebglImg
  'webgl-img': ICanvasOrWebglImg
  webgl: IWebgl
  'audio-context': IAudiocontext
  media: IWebrtc
  'client-rects': IClientrects
  speech_voices: ISpeechvoices
  ssl: { mode: 1 | 0; value: string[] }
  cpu: { mode: 1; value: number }
  memory: { mode: 1; value: number }
  'device-name': IHomepage
  mac: IHomepage
  dnt: { mode: 1 | 0; value: number }
  'port-scan': { mode: 1 | 2; value: string[] }
  gpu: { mode: number; value: number }
  timestamp?: number
  id?: number
  runLoading?: boolean
  remark?: string
  start: { value: string }
}

interface ICanvasOrWebglImg {
  mode: number
  r: number
  g: number
  b: number
  a: number
}
interface ISpeechvoices {
  mode: number
  value: {
    default: boolean
    lang: string
    localService: boolean
    name: string
    voiceURI: string
  }[]
}

interface IClientrects {
  mode: number
  width: number
  height: number
}

interface IAudiocontext {
  mode: number
  channel: number
  analyer: number
}

interface IWebgl {
  mode: number
  vendor?: string
  render?: string
}

interface ICanvas {
  mode: number
  r: number
  g: number
  b: number
  a: number
}

interface IFonts {
  mode: number
  value: unknown[]
}

interface IScreen {
  mode: number
  width: number
  height: number
  _value: string
}

interface ILocation {
  mode: number
  enable: number
  longitude: string
  latitude: string
  precision: number
}

interface IWebrtc {
  mode: number
}

interface ITimezone {
  mode: number
  zone: string
  utc: string
  locale: string
  name: string
  value: number
}

interface IUalanguage {
  mode: number
  language: string
  value: string
}

interface ISecchua {
  mode: number
  value: {
    brand: string
    version: number | string
  }[]
}

interface IHomepage {
  mode: number
  value: string
}

interface ICookie {
  mode: number
  value: string
  jsonStr: string
}

interface IProxy {
  mode: number
  value: string
  protocol: string
  host: string
  port: string
  user: string
  pass: string
  API: string
  url: string
}

export interface IfetchAndParseAPIData {
  ip: string
  port: string
  user: string
  pass: string
}
