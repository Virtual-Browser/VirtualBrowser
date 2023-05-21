<p align="center">
  <img src="assets/logo.png">
</p>

## <p align="center"><b><a href="README.md">English</a> | <a href="README_CN.md">简体中文</a></b></p>

# Introduction
Browser fingerprinting refers to the process of identifying and recording various factors, such as the browser itself, the operating system, and hardware configurations, to generate a unique identifier. It is a digital signature obtained through the collection of various features of the browser, such as user agent, language, screen size, plugin version, font, time settings, etc., and a comprehensive analysis. As everyone's browser configurations differ, browser fingerprints can be used to track user behavior, identify identity, monitor online activities, and even for illegal purposes such as fraud and phishing.

VirtualBrowser is a fingerprint browser based on [Chromium](https://dev.chromium.org), which supports Windows 10 and above operating systems, and plans to support Mac, Android, Linux, and other operating systems in the future.

Compared with Chromium, VirtualBrowser has two advantages:

1. Support for creating multiple fingerprint information browser environments on one machine.
2. Support for managing multiple browser environments.

# Preparation
First, download the latest VirtualBrowser installation package from the [release page]() or [official website](http://virtualbrowser.cc) and install it on your computer.

## Creating a new browser environment
1. Open VirtualBrowser and select Create Browser.
2. Modify the configuration information in the pop-up dialog or use the default settings.

## Starting the browser environment
1. Click the Start button in the created environment to open the newly created browser environment.
2. The newly started browser is the new fingerprint environment.

# Tested and Effective Fingerprint Modifications
You can test fingerprint modifications using [fingerprintjs](https://fingerprintjs.github.io/fingerprintjs/) and [browserleaks](https://browserleaks.com/).

- Operating System: Modify the operating system part in `userAgent`.
- Browser version: Modify the browser version in `userAgent`.
- Proxy settings: Modify the browser proxy which supports "Default", "Do not use proxy", "Custom".
- User Agent: Modify `userAgent`.
- Language: Modify `navigator.language`, `navigator.languages`, and it can be automatically matched based on IP.
- Time zone: Modify the time zone in `new Date()`, and it can be automatically matched based on IP.
- WebRTC
- Geolocation: Modify the latitude and longitude in `navigator.geolocation.getCurrentPosition()`, and it can be automatically matched based on IP.
- Resolution: Modify `screen.width`/`screen.height`.
- Font: Randomly modify the supported font list.
- Canvas: Randomly modify Canvas 2D drawing differential pixels.
- WebGL image: Randomly modify WebGL drawing differential pixels.
- WebGL metadata: WebGL vendor, WebGL rendering, etc.
- AudioContext: Randomly modify the differential data of `getChannelData` and `getFloatFrequencyData` in AudioContext.
- ClientRects
- Speech voices
- CPU: Modify `navigator.hardwareConcurrency` CPU core count.
- Memory
- Device name
- MAC address
- Do Not Track
- SSL
- Port scan protection
- Hardware acceleration

# Support and Joining
VirtualBrowser is not perfect yet. If you are interested in VirtualBrowser, you are welcome to join us through the following ways:

1. Directly contribute code, provide features, and fix bugs.
2. Install VirtualBrowser, visit your frequently used websites, and provide feedback on unusable situations to help solve compatibility issues.
3. Provide experience, functional suggestions to help improve VirtualBrowser.

# Contact Us
- Email: [virtualbrowser@gmail.com](mailto://virtualbrowser@gmail.com)
- Official website: [http://virtualbrowser.cc](http://virtualbrowser.cc)

# Acknowledgments
1. [fingerprintjs](https://fingerprintjs.github.io/fingerprintjs/)
2. [browserleaks](https://browserleaks.com/)
3. [Chromium](https://dev.chromium.org)
4. [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)
