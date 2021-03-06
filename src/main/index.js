'use strict'

import { app, BrowserWindow, Tray, Menu, ipcMain } from 'electron'
import server from './server'
const path = require('path')

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    minHeight: 563,
    useContentSize: true,
    minWidth: 1000,
    frame: false,
    titleBarStyle: 'hidden'
  })
  // mainWindow.webContents.openDevTools()

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  mainWindow.on('close', (e) => {
    mainWindow.hide()
    mainWindow.setSkipTaskbar(true)
    e.preventDefault()
  })
}
function createTray () {
  const tray = new Tray(path.join(__static, './tray/tray.ico'))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '退出',
      click () {
        mainWindow.destroy()
      }
    }
  ])
  tray.setToolTip('i1Music')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    mainWindow.show()
    mainWindow.setSkipTaskbar(false)
  })
}
const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
  // Someone tried to run a second instance, we should focus our window.
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})
if (isSecondInstance) {
  app.quit()
}
server.startMusicServer((port, allowKeys) => {
  ipcMain.on('view-ready', e => {
    e.sender.send('music-server-config', {
      port,
      allowKeys
    })
  })
})
server.startImageServer(port => {
  ipcMain.on('view-ready', e => {
    e.sender.send('image-server-config', port)
  })
})

app.on('ready', () => {
  createWindow()
  createTray()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
ipcMain.on('min-window', () => {
  mainWindow.minimize()
})
ipcMain.on('close-window', () => {
  mainWindow.close()
})
ipcMain.on('max-window', () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow.maximize()
  }
})
ipcMain.on('resize-window', (e) => {
  let flag = false
  if (mainWindow.isMaximized()) {
    flag = true
  }
  e.sender.send('is-max-window', flag)
})
