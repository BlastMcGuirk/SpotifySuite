const ipc = require("electron").ipcRenderer;

// Caption of the table, offering instruction on what to do
const instructions = document.getElementById("instructions");
const instr1 = "To change a hotkey, click on an action's current hotkey";
const instr2 = "Press the key you would like to set as the new hotkey";

// global for asynchronysity
var selected;
var curHK;
var newHK;
var prefix = "";

document.addEventListener("keydown", function(event) {
	// Don't check for keyup if a hotkey isn't selected
	if (selected != null) {
		if (!validKey(event.keyCode)) {
			// Handle invalid input
		}
		curHK = selected.innerHTML;
		newHK = event.key;
		// Send change attempt to main.js
		ipc.send("changeHotkey", { curHK: curHK, newHK: newHK });
	}
});

function validKey(keyCode) {
	// TODO: Block some inputs (Shift, Ctrl, Cmd, etc.)
	return true;
}

function changeHotkey(action) {
	// Check for unselecting selected
	var newSel = document.getElementById(action);
	if (newSel.classList.contains("selected")) {
		instructions.innerHTML = instr1;
		newSel.classList.remove("selected");
		selected = null;
		return;
	}

	// Unhighlight previously selected
	if (selected) {
		selected.classList.remove("selected");
	}

	// Select table item and change instructions
	selected = newSel;
	selected.classList.add("selected");
	instructions.innerHTML = instr2;
}

ipc.on("changeHotkey", (event, args) => {
	if (args === "success") {
		// Update successful hotkey change information
		selected.innerHTML = newHK;
		// Reset fields
		instructions.innerHTML = instr1;
		selected.classList.remove("selected");
		selected = null;
	} else {
		// Handle error?
	}
});

// Get the currently playing song from Spotify
ipc.on("curSong", (event, args) => {
	var res = JSON.parse(args);
	// TODO: Format appropriately
	var end = "";
	end += res.item.name;
	end += "<br>";
	end += res.item.album.name;
	// TODO: Display on screen even if not focused
	document.getElementById("resu").innerHTML = res;
});
