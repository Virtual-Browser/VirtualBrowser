<p align="center">
  <img src="assets/logo.png">
</p>

## <p align="center"><b><a href="README.md">English</a> | <a href="README_CN.md">简体中文</a></b></p>


# 简介
VirtualBrowser 是基于 [Chromium](https://dev.chromium.org) 的指纹浏览器，支持 Windows 7 及以上操作系统，并计划在未来支持 Mac、Android、Linux 等操作系统。

浏览器指纹识别是指通过识别和记录浏览器本身、操作系统和硬件配置等各种因素，生成一个唯一的标识符的过程。它是通过收集浏览器的各种特征（如用户代理、语言、屏幕大小、插件版本、字体、时间设置等）和综合分析得出的数字签名。由于每个人的浏览器配置不同，所以可以使用浏览器指纹来跟踪用户行为、识别身份、监视在线活动，甚至用于非法目的，如欺诈和网络钓鱼。

与 Chromium 相比，VirtualBrowser 具有两个优点：

1. 支持在一台机器上创建多个指纹信息浏览器环境。
2. 支持管理多个浏览器环境。


# 准备工作
首先，从[发布页面]()或[官网](http://virtualbrowser.cc)下载最新的 VirtualBrowser 安装包并将其安装到计算机上。

## 创建新的浏览器环境
1. 打开 VirtualBrowser 并选择“创建浏览器”。
![Image text](https://github.com/Virtual-Browser/VirtualBrowser/blob/main/assets/welcome_zh-cn.png)
2. 修改弹出对话框中的配置信息或使用默认设置。
![Image text](https://github.com/Virtual-Browser/VirtualBrowser/blob/main/assets/create_zh-cn.png)
![Image text](https://github.com/Virtual-Browser/VirtualBrowser/blob/main/assets/create_success_zh-cn.png)

## 启动浏览器环境
1. 单击已创建环境中的“启动”按钮，以打开新创建的浏览器环境。
2. 新启动的浏览器即为新的指纹环境。
![Image text](https://github.com/Virtual-Browser/VirtualBrowser/blob/main/assets/launch.png)

# 亲测可用的指纹修改
可以使用 [fingerprintjs](https://fingerprintjs.github.io/fingerprintjs/) 和 [browserleaks](https://browserleaks.com/) 来测试指纹修改效果。

- 操作系统：修改 `userAgent` 中的操作系统部分。
- 浏览器版本：修改 `userAgent` 中的浏览器版本。
- 代理设置：修改支持“默认”、“不使用代理”、“自定义”的浏览器代理。
- 用户代理：修改 `userAgent`。
- 语言：修改 `navigator.language`、`navigator.languages`，也可以根据 IP 自动匹配。
- 时区：修改 `new Date()` 中的时区，也可以根据 IP 自动匹配。
- WebRTC
- 地理位置：修改 `navigator.geolocation.getCurrentPosition()` 中的经度和纬度，也可以根据 IP 自动匹配。
- 分辨率：修改 `screen.width`/`screen.height`。
- 字体：随机修改支持的字体列表。
- Canvas：随机修改 Canvas 2D 绘制差分像素。
- WebGL 图像：随机修改 WebGL 绘制差分像素。
- WebGL 元数据：WebGL 厂商、WebGL 渲染等。
- AudioContext：随机修改 AudioContext 中的 `getChannelData` 和 `getFloatFrequencyData` 的差异数据。
- ClientRects
- Speech Voices
- CPU：修改 `navigator.hardwareConcurrency` 的 CPU 核心数。
- 内存
- 设备名称
- MAC 地址
- Do Not Track
- SSL
- 端口扫描保护
- 硬件加速

# 支持和加入
VirtualBrowser 还不完善。如果您对 VirtualBrowser 感兴趣，可以通过以下方式加入我们：

1. 直接贡献代码、提供功能和修复错误。
2. 安装 VirtualBrowser，访问您经常使用的网站，并提供有关无法使用的情况的反馈，以帮助解
3. 提供有关VirtualBrowser的反馈和建议，以帮助我们改进产品和增强用户体验。
4. 在社交媒体上分享您对VirtualBrowser的看法和使用体验，并向其他人推荐该产品。
5. 加入VirtualBrowser的开发者社区，与其他用户和开发人员进行交流和讨论。


# 联系我们
- email:  [virtual.browser.2020@gmail.com](mailto:virtual.browser.2020@gmail.com)
- 官网:  [virtualbrowser](http://virtualbrowser.cc)

# 致谢
1. [fingerprintjs](https://fingerprintjs.github.io/fingerprintjs/)
2. [browserleaks](https://browserleaks.com/)
3. [Chromium](https://dev.chromium.org)
4. [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)
