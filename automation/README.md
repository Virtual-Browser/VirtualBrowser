# VirtualBrowser - automation

## Project setup

```
npm install
```

### Start automation

```
npm test
```

### Demo Code (nodejs playwright)

```javascript
// worker-id 需要先手动创建
const workerId = 1

const browser = await chromium.launchPersistentContext(
  `${process.env.localappdata}\\VirtualBrowser\\Workers\\${workerId}`,
  {
    // 配置VirtualBrowser安装路径
    executablePath: 'D:\\VirtualBrowser\\Chrome-bin\\VirtualBrowser.exe',
    args: [`--worker-id=${workerId}`],
    headless: false,
    defaultViewport: null,
  }
)
```
