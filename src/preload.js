const { contextBridge, ipcRenderer } = require('electron');

// Expose safe APIs to the renderer (index.html)
contextBridge.exposeInMainWorld('L', {
  // Data persistence (offline, local JSON store)
  store: {
    get: (key) => ipcRenderer.invoke('store:get', key),
    set: (key, value) => ipcRenderer.invoke('store:set', key, value),
    delete: (key) => ipcRenderer.invoke('store:delete', key),
    getAll: () => ipcRenderer.invoke('store:getAll'),
    has: (key) => ipcRenderer.invoke('store:has', key)
  },
  // File operations (save/open dialogs)
  file: {
    save: (opts) => ipcRenderer.invoke('file:save', opts),
    open: (opts) => ipcRenderer.invoke('file:open', opts),
    openDir: () => ipcRenderer.invoke('file:openDir')
  },
  // App info
  app: {
    info: () => ipcRenderer.invoke('app:info'),
    openExternal: (url) => ipcRenderer.invoke('app:openExternal', url),
    theme: () => ipcRenderer.invoke('app:theme')
  },
  // Listen for menu actions (New Invoice, Backup, etc.)
  onMenuAction: (cb) => ipcRenderer.on('menu-action', (_, action) => cb(action))
});

// Also expose electronAPI for the app switcher (used by both Ledgify and CA Desk)
contextBridge.exposeInMainWorld('electronAPI', {
  switchApp: (appName) => ipcRenderer.send('switch-app', appName),
  getVersion: () => ipcRenderer.invoke('get-version')
});
