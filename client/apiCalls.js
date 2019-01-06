const HTTPSRequest = require("./httpsRequest.js");
var window;

function registerShortcuts(globalShortcut, mainWindow) {
	window = mainWindow.webContents;

	globalShortcut.register("F7", getCurrentSong);
}

function getCurrentSong() {
	HTTPSRequest.getApi("/v1/me/player/currently-playing", (response) => {
		window.send("curSong", response);
	});
}

module.exports = {
	registerShortcuts
};
