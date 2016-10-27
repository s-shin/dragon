import { app, BrowserWindow } from 'electron';

let win = null;

async function createWindow() {
  win = new BrowserWindow({ width: 800, height: 600 });
  if (process.env.HOT) {
    win.loadURL(`file://${__dirname}/index.hot.html`);
  } else {
    win.loadURL(`file://${__dirname}/index.html`);
  }
  if (process.env.NODE_ENV === 'development') {
    require('electron-load-devtool'); // eslint-disable-line
    win.webContents.openDevTools();
  }
  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
