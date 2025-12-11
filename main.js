const path = require("path");
const { app, BrowserWindow, session } = require("electron");

let mainWindow;

const isGithubOrigin = (origin) => origin === "https://github.com" || origin.endsWith(".github.com");

const registerPermissionHandler = () => {
  session.defaultSession.setPermissionRequestHandler((webContents, permission, callback, details) => {
    const allowNotifications =
      permission === "notifications" && isGithubOrigin(details.securityOrigin);

    if (!allowNotifications) {
      console.info(`Declined permission '${permission}' requested by ${details.securityOrigin}`);
    }

    callback(allowNotifications);
  });
};

const createWindow = () => {
  mainWindow = new BrowserWindow({
    height: 768,
    width: 1024,
    icon: `${__dirname}/github.png`,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      webviewTag: true,
      nodeIntegration: false
    }
  });

  mainWindow.removeMenu();

  mainWindow.loadFile(path.join(__dirname, "index.html")).catch((error) => {
    console.error("Failed to load the renderer:", error);
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
};

app.whenReady().then(() => {
  registerPermissionHandler();
  createWindow();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
