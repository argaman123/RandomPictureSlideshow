const { detach, refresh, attach } = require("electron-as-wallpaper");

function detachWindow(mainWindow) {
  mainWindow.setFullScreen(false)
  detach(mainWindow)
  refresh()
}

function attachWindow(mainWindow) {
  try {
    mainWindow.setFullScreen(true)
    attach(mainWindow)
  } catch (e) {

  }
}

function cleanup() {
  refresh()
}

module.exports = {
  detachWindow,
  attachWindow,
  cleanup
}
