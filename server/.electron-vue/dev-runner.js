const { spawn } = require('child_process')
const electron = require('electron')
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const Service = require('@vue/cli-service/lib/Service')
const service = new Service(process.cwd())

let electronProcess = null
let manualRestart = false

/**
 * 监听electron文件变化，重启app
 */
function watchFile() {
  fs.watch(
    path.join(__dirname, '../app'),
    {
      recursive: true
    },
    function (eventType, filename) {
      if (electronProcess && electronProcess.kill) {
        manualRestart = true
        process.kill(electronProcess.pid)
        electronProcess = null

        console.log(chalk.green(eventType + ':' + filename))
        startElectron()
        console.log(chalk.green('app restart'))

        setTimeout(() => {
          manualRestart = false
        }, 5000)
      }
    }
  )
}

function startVue() {
  return service.run('serve').catch(err => {
    console.log(chalk.red(err))
    process.exit(1)
  })
}

function startElectron() {
  electronProcess = spawn(
    electron,
    [path.join(__dirname, '../app/app.js')]
    // , {
    //   env: {
    //     NODE_ENV: 'development'
    //   }
    // }
  )

  electronProcess.stdout.on('data', data => {
    console.log(chalk.green(data.toString()))
  })
  electronProcess.stderr.on('data', data => {
    console.log(chalk.red(data.toString()))
  })
  electronProcess.on('close', () => {
    if (!manualRestart) process.exit()
  })
}

function init() {
  watchFile()
  startVue().then(() => {
    startElectron()
    console.log(chalk.green(' app start'))
  })
}

init()
