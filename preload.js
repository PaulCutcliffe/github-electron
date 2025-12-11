const { contextBridge, shell } = require("electron");

const isHttpUrl = (url) => /^https?:\/\//i.test(url);

contextBridge.exposeInMainWorld("electronAPI", {
  openExternal: (url) => {
    if (isHttpUrl(url)) {
      shell.openExternal(url);
    }
  }
});
