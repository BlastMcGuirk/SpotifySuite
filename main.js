const electron = require('electron');
const {app, BrowserWindow, ipcMain} = electron;

const SpotifyLogin = require('./client/SpotifyLogin.js')

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({ width: 800, height: 600 });
    // Remove Menu Bar
    //mainWindow.setMenu(null);
    mainWindow.setResizable(false);
    
    // TODO: Check for login, skip index page
    mainWindow.loadFile('client/index.html');

    mainWindow.on('closed', () => {
        // close app for now
        // eventually leave it open to be used in background
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    // close app for now
    // eventually leave it open to be used in background
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

ipcMain.on('getStarted', () => {
    // Do spotify authentication
    
    mainWindow.loadFile('client/login.html');
});

ipcMain.on('login', (event, args) => {
    if (args.username === 'asdf')
        mainWindow.loadFile('client/home.html');
});