const { app, BrowserWindow, ipcMain, dialog, Menu, shell, nativeTheme } = require('electron');
const path = require('path');
const fs = require('fs');

// Use electron-store for persistent offline storage
let Store;
try { Store = require('electron-store'); } catch(e) { Store = null; }
const store = Store ? new Store({ name: 'ledgify-data' }) : null;

// In-memory fallback if store not available
const memStore = {};
const storeGet = (key) => store ? store.get(key) : memStore[key];
const storeSet = (key, val) => store ? store.set(key, val) : (memStore[key] = val);
const storeDelete = (key) => store ? store.delete(key) : delete memStore[key];
const storeGetAll = () => store ? store.store : memStore;

let mainWindow;
const isDev = process.argv.includes('--dev');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 840,
    minWidth: 1024,
    minHeight: 680,
    webPreferences: {
      preload: path.join(__dirname, 'src', 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    backgroundColor: '#FAFAF9',
    show: false,
    icon: path.join(__dirname, 'src', 'assets', 'logo.svg')
  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'index.html'));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDev) mainWindow.webContents.openDevTools();
  });

  mainWindow.on('closed', () => { mainWindow = null; });
}

// App menu
function buildMenu() {
  const template = [
    ...(process.platform === 'darwin' ? [{ label: app.name, submenu: [
      { role: 'about' }, { type: 'separator' }, { role: 'hide' }, { role: 'hideOthers' }, { role: 'unhide' }, { type: 'separator' }, { role: 'quit' }
    ]}] : []),
    { label: 'File', submenu: [
      { label: 'New Invoice', accelerator: 'CmdOrCtrl+N', click: () => mainWindow?.webContents.send('menu-action', 'new-invoice') },
      { label: 'New Payment', accelerator: 'CmdOrCtrl+P', click: () => mainWindow?.webContents.send('menu-action', 'new-payment') },
      { type: 'separator' },
      { label: 'Export Data', click: () => mainWindow?.webContents.send('menu-action', 'export') },
      { label: 'Backup', click: () => mainWindow?.webContents.send('menu-action', 'backup') },
      { type: 'separator' },
      process.platform !== 'darwin' ? { role: 'quit' } : { role: 'close' }
    ]},
    { label: 'Edit', submenu: [
      { role: 'undo' }, { role: 'redo' }, { type: 'separator' },
      { role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' }
    ]},
    { label: 'View', submenu: [
      { role: 'reload' }, { role: 'forceReload' },
      { type: 'separator' },
      { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' },
      { type: 'separator' }, { role: 'togglefullscreen' }
    ]},
    { label: 'Help', submenu: [
      { label: 'User Manual', click: () => mainWindow?.webContents.send('menu-action', 'manual') },
      { label: 'Keyboard Shortcuts', accelerator: 'CmdOrCtrl+/', click: () => mainWindow?.webContents.send('menu-action', 'shortcuts') },
      { type: 'separator' },
      { label: 'Send Feedback', click: () => shell.openExternal('https://ledgerlift.com/feedback') }
    ]}
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  buildMenu();
  createWindow();
  app.on('activate', () => { if (!mainWindow) createWindow(); });
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

// ─── IPC: Data store ─────────────────────────────────────────────────────────
ipcMain.handle('store:get', (_, key) => storeGet(key));
ipcMain.handle('store:set', (_, key, value) => { storeSet(key, value); return true; });
ipcMain.handle('store:delete', (_, key) => { storeDelete(key); return true; });
ipcMain.handle('store:getAll', () => storeGetAll());
ipcMain.handle('store:has', (_, key) => store ? store.has(key) : key in memStore);

// ─── IPC: File operations ────────────────────────────────────────────────────
ipcMain.handle('file:save', async (_, { filename, content, filters }) => {
  const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
    defaultPath: filename,
    filters: filters || [{ name: 'All Files', extensions: ['*'] }]
  });
  if (canceled || !filePath) return { ok: false };
  try {
    fs.writeFileSync(filePath, content, 'utf-8');
    return { ok: true, path: filePath };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});

ipcMain.handle('file:open', async (_, { extensions, encoding } = {}) => {
  const { filePaths, canceled } = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    filters: [{ name: 'Files', extensions: extensions || ['*'] }]
  });
  if (canceled || !filePaths.length) return { ok: false };
  try {
    const content = fs.readFileSync(filePaths[0], encoding || 'utf-8');
    return { ok: true, content, path: filePaths[0], name: path.basename(filePaths[0]) };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});

ipcMain.handle('file:openDir', async () => {
  const { filePaths, canceled } = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] });
  if (canceled || !filePaths.length) return { ok: false };
  return { ok: true, path: filePaths[0] };
});

// ─── IPC: System info ────────────────────────────────────────────────────────
ipcMain.handle('app:info', () => ({
  version: app.getVersion(),
  platform: process.platform,
  arch: process.arch,
  dataPath: app.getPath('userData'),
  isDev
}));

ipcMain.handle('app:openExternal', (_, url) => shell.openExternal(url));
ipcMain.handle('app:theme', () => nativeTheme.shouldUseDarkColors ? 'dark' : 'light');
