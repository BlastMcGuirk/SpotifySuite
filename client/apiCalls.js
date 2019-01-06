const HTTPSRequest = require("./httpsRequest.js");
var gs;
var window;
var saved = {};

function registerShortcuts(globalShortcut, mainWindow) {
	gs = globalShortcut;
	window = mainWindow.webContents;

	// Register to default shortcuts
	gs.register("F7", getCurrentSong);
	gs.register("F6", saveSong);

	// Save functions to hotkeys for change later
	saved["F7"] = getCurrentSong;
	saved["F6"] = saveSong;
}

function getCurrentSong() {
	// Get information on the currently playing song
	HTTPSRequest.getApi("/v1/me/player/currently-playing", (response) => {
		window.send("curSong", response);
	});
}

function saveSong() {
	// Save song to Spotify Suite playlist
}

function changeShortcut(curHK, newHK) {
	const fs = require("fs");
	fs.writeFile("whathk.txt", newHK, (err) => {});
	// Change hotkey
	var alreadyUsed = gs.isRegistered(newHK);

	if (alreadyUsed) {
		// Cannot map to used hotkey
		return false;
	}

	// Get and remove the current function registered to previous hotkey
	var curFunc = saved[curHK];
	saved[curHK] = null;

	// Unregister and reregister function to new hotkey
	gs.unregister(curHK);
	gs.register(newHK, curFunc);

	// Save function to new hotkey
	saved[newHK] = curFunc;

	return true;
}

module.exports = {
	registerShortcuts,
	changeShortcut
};
