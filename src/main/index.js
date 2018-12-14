'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import server from './server'

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

app.on('ready', createWindow)

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
