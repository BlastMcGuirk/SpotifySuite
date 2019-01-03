const electron = require('electron');
const {app, BrowserWindow, ipcMain, globalShortcut} = electron;

const SpotifyLogin = require('./client/SpotifyLogin.js');
const apiCalls = require('./client/apiCalls.js');
const HTTPSRequest = require('./client/httpsRequest.js');

var mainWindow;

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

    // Register shortcuts
    apiCalls.registerShortcuts(globalShortcut, mainWindow);
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

ipcMain.on('getStarted', (event, args) => {
    // Do spotify authentication
    SpotifyLogin.startServer(() => {
        mainWindow.loadURL(SpotifyLogin.URL);
    },
    () => {
        mainWindow.loadFile('client/home.html');
    });
});

ipcMain.on('getStuff', (event, args) => {
    HTTPSRequest.getApi('/v1/me/player', (data) => {
        event.sender.send('gotStuff', data);
    });
});
