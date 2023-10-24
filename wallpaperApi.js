const { detach, refresh, attach } = require("electron-as-wallpaper");

function detachWindow(mainWindow, bounds = {x: 0, y: 0, width: 480, height: 270}) {
  mainWindow.setFullScreen(false)

  // reset window position to default
  mainWindow.setBounds(bounds)

  // must be at the bottom!
  detach(mainWindow)
  refresh()
}

function attachWindow(mainWindow) {
  try {
    // solves a bug where the window appears only after clicking on the desktop.
    mainWindow.hide()
    mainWindow.show()

    mainWindow.setFullScreen(true)

    // must be at the bottom!
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
