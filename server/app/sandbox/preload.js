/* ---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 * -------------------------------------------------------------------------------------------- */

// @ts-check
;(function () {
  'use strict'

  const { ipcRenderer, webFrame, contextBridge } = require('electron')

  // #region Utilities

  /**
   * @param {string} channel
   * @returns {true | never}
   */
  function validateIPC(channel) {
    if (!channel /* || !channel.startsWith('ipc:')*/) {
      throw new Error(`Unsupported event IPC channel '${channel}'`)
    }

    return true
  }

  /**
   * @param {string} type
   * @returns {type is 'uncaughtException'}
   */
  function validateProcessEventType(type) {
    if (type !== 'uncaughtException') {
      throw new Error(`Unsupported process event '${type}'`)
    }

    return true
  }

  /**
   * @param {string} key the name of the process argument to parse
   * @returns {string | undefined}
   */
  function parseArgv(key) {
    for (const arg of process.argv) {
      if (arg.indexOf(`--${key}=`) === 0) {
        return arg.split('=')[1]
      }
    }

    return undefined
  }

  // #endregion

  // #region Globals Definition

  // #######################################################################
  // ###                                                                 ###
  // ###       !!! DO NOT USE GET/SET PROPERTIES ANYWHERE HERE !!!       ###
  // ###       !!!  UNLESS THE ACCESS IS WITHOUT SIDE EFFECTS  !!!       ###
  // ###       (https://github.com/electron/electron/issues/25516)       ###
  // ###                                                                 ###
  // #######################################################################

  /**
   * @type {import('../electron-sandbox/globals')}
   */
  const globals = {
    /**
     * A minimal set of methods exposed from Electron's `ipcRenderer`
     * to support communication to main process.
     *
     * @typedef {import('../electron-sandbox/electronTypes').IpcRenderer} IpcRenderer
     * @typedef {import('electron').IpcRendererEvent} IpcRendererEvent
     *
     * @type {IpcRenderer}
     */

    ipcRenderer: {
      /**
       * @param {string} channel
       * @param {any[]} args
       */
      send(channel, ...args) {
        if (validateIPC(channel)) {
          ipcRenderer.send(channel, ...args)
        }
      },

      /**
       * @param {string} channel
       * @param {any[]} args
       * @returns {Promise<any> | undefined}
       */
      invoke(channel, ...args) {
        if (validateIPC(channel)) {
          return ipcRenderer.invoke(channel, ...args)
        }
      },

      /**
       * @param {string} channel
       * @param {(event: IpcRendererEvent, ...args: any[]) => void} listener
       * @returns {IpcRenderer}
       */
      on(channel, listener) {
        if (validateIPC(channel)) {
          ipcRenderer.on(channel, listener)

          return this
        }
      },

      /**
       * @param {string} channel
       * @param {(event: IpcRendererEvent, ...args: any[]) => void} listener
       * @returns {IpcRenderer}
       */
      once(channel, listener) {
        if (validateIPC(channel)) {
          ipcRenderer.once(channel, listener)

          return this
        }
      },

      /**
       * @param {string} channel
       * @param {(event: IpcRendererEvent, ...args: any[]) => void} listener
       * @returns {IpcRenderer}
       */
      removeListener(channel, listener) {
        if (validateIPC(channel)) {
          ipcRenderer.removeListener(channel, listener)

          return this
        }
      }
    },

    /**
     * @type {import('../electron-sandbox/globals').IpcMessagePort}
     */
    ipcMessagePort: {
      /**
       * @param {string} responseChannel
       * @param {string} nonce
       */
      acquire(responseChannel, nonce) {
        if (validateIPC(responseChannel)) {
          const responseListener = (
            /** @type {IpcRendererEvent} */ e,
            /** @type {string} */ responseNonce
          ) => {
            // validate that the nonce from the response is the same
            // as when requested. and if so, use `postMessage` to
            // send the `MessagePort` safely over, even when context
            // isolation is enabled
            if (nonce === responseNonce) {
              ipcRenderer.off(responseChannel, responseListener)
              window.postMessage(nonce, '*', e.ports)
            }
          }

          // handle reply from main
          ipcRenderer.on(responseChannel, responseListener)
        }
      }
    },

    /**
     * Support for subset of methods of Electron's `webFrame` type.
     *
     * @type {import('../electron-sandbox/electronTypes').WebFrame}
     */
    webFrame: {
      /**
       * @param {number} level
       */
      setZoomLevel(level) {
        if (typeof level === 'number') {
          webFrame.setZoomLevel(level)
        }
      }
    },

    /**
     * Support for a subset of access to node.js global `process`.
     *
     * Note: when `sandbox` is enabled, the only properties available
     * are https://github.com/electron/electron/blob/master/docs/api/process.md#sandbox
     *
     * @typedef {import('../electron-sandbox/globals').ISandboxNodeProcess} ISandboxNodeProcess
     *
     * @type {ISandboxNodeProcess}
     */
    process: {
      get platform() {
        return process.platform
      },
      get arch() {
        return process.arch
      },
      get env() {
        return { ...process.env }
      },
      get versions() {
        return process.versions
      },
      get type() {
        return 'renderer'
      },
      get execPath() {
        return process.execPath
      },
      get sandboxed() {
        return process.sandboxed
      },

      /**
       * @returns {string}
       */
      cwd() {
        return (
          process.env['VSCODE_CWD'] ||
          process.execPath.substr(
            0,
            process.execPath.lastIndexOf(process.platform === 'win32' ? '\\' : '/')
          )
        )
      },

      /**
       * @returns {Promise<typeof process.env>}
       */
      shellEnv() {
        return resolveShellEnv
      },

      /**
       * @returns {Promise<import('electron').ProcessMemoryInfo>}
       */
      getProcessMemoryInfo() {
        return process.getProcessMemoryInfo()
      },

      /**
       * @param {string} type
       * @param {Function} callback
       * @returns {ISandboxNodeProcess}
       */
      on(type, callback) {
        if (validateProcessEventType(type)) {
          // @ts-ignore
          process.on(type, callback)

          return this
        }
      }
    },

    /**
     * Some information about the context we are running in.
     *
     * @type {import('../electron-sandbox/globals').ISandboxContext}
     */
    context: {
      /**
       * A configuration object made accessible from the main side
       * to configure the sandbox browser window.
       *
       * Note: intentionally not using a getter here because the
       * actual value will be set after `resolveConfiguration`
       * has finished.
       *
       * @returns {ISandboxConfiguration | undefined}
       */
      configuration() {
        return configuration
      },

      /**
       * Allows to await the resolution of the configuration object.
       *
       * @returns {Promise<ISandboxConfiguration>}
       */
      async resolveConfiguration() {
        return resolveConfiguration
      }
    }
  }

  // Use `contextBridge` APIs to expose globals to VSCode
  // only if context isolation is enabled, otherwise just
  // add to the DOM global.
  if (process.contextIsolated) {
    try {
      contextBridge.exposeInMainWorld('sandboxAPI', globals)
    } catch (error) {
      console.error(error)
    }
  } else {
    // @ts-ignore
    window.sandboxAPI = globals
  }
})()
