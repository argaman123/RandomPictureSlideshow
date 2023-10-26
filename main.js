const { app, BrowserWindow, ipcMain, webFrame, protocol, Tray, Menu, nativeImage, screen } = require('electron')
const path = require("path")
const Store = require('electron-store');

require("./backend")
const { detachWindow, attachWindow, cleanup } = require("./wallpaperApi");

protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }])
const store = new Store();

let mainWindow
let tray
let defaultBounds = {}
let current = 0

function createTrayMenu() {
  tray = new Tray(nativeImage.createFromPath(path.join(__dirname, 'tray.png')));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Detach",
      click: () => detachWindow(mainWindow, defaultBounds)
    },
    {
      label: "Attach as wallpaper",
      click: () => attachWindow(mainWindow)
    },
    {
      label: "Move right by 1920px",
      click: () => {
        mainWindow.setPosition(1920 * (current+1), 0)
        current++

        // avoid black screen
        cleanup()
      }
    },
    {
      label: "Close",
      click: () => mainWindow.close()
    }
  ])
  tray.setToolTip('Wallpaper App')
  tray.setContextMenu(contextMenu)
}

function createWindow() {
  createTrayMenu()

  mainWindow = new BrowserWindow({
    //transparent:true,
    // frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })
  defaultBounds = mainWindow.getBounds()
  mainWindow.setAspectRatio(parseFloat(store.get("ratio") ?? (1920 / 1080).toString()))

  if (process.env.BUILD ? (process.env.BUILD.trim() === "false") : false) {
    mainWindow.loadURL('http://localhost:4200').then()
    mainWindow.removeMenu()
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/random-picture-slideshow/index.html')).then()
    mainWindow.removeMenu()
    // mainWindow.webContents.openDevTools()
  }
  ipcMain.on("close", e => {
    detachWindow(mainWindow)
    mainWindow.close()
  })
  ipcMain.on("fullscreen", (e, fullscreen) => {
    mainWindow.setFullScreen(fullscreen);
  })
  ipcMain.on("minimize", e => {
    mainWindow.minimize()
  })
  ipcMain.on("resolution", (e, resolution) => {
    let width = parseInt(resolution.split("x")[0])
    let height = parseInt(resolution.split("x")[1])
    mainWindow.setAspectRatio(width / height)
    store.set("ratio", width / height)
  })
  mainWindow.on("maximize", e => {
    mainWindow.webContents.send("fullscreenChange", true)
  })
  mainWindow.on("unmaximize", e => {
    mainWindow.webContents.send("fullscreenChange", false)
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
  cleanup()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})
