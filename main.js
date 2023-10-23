const {app, BrowserWindow, ipcMain, webFrame, protocol} = require('electron')
const path = require("path")
const Store = require('electron-store');

require("./backend")

protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }])
const store = new Store();

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    //transparent:true,
    // frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  })
  mainWindow.setAspectRatio(parseFloat(store.get("ratio") ?? (1920/1080).toString()))

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
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
})
