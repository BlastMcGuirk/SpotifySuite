const REDIRECT_URI = 'http://localhost:8080/authorize';
const SCOPE = 'user-read-playback-state user-read-currently-playing';
const URL = 'https://accounts.spotify.com/authorize' +
            '?client_id=9301080002d341dda12eae6e9e04b854' +
            '&response_type=code&redirect_uri=' + REDIRECT_URI +
            '&scope=' + SCOPE;

function startServer(spotifyCall, onFinish) {
    const http = require('http');
    const URLLIB = require('url');

    var server = http.createServer((req, res) => {
        // Callback from spotify after user accepts/denies access
        var url = URLLIB.parse(req.url, true);
        res.end();

        if (url.pathname === '/authorize') {
            var code = url.query.code;
            // get token from spotify
            const httpsRequest = require('./httpsRequest');
            httpsRequest.getAuthToken(code, REDIRECT_URI, onFinish);
            server.close();
        }
    }).listen(8080);

    spotifyCall();
}

module.exports = {
    URL,
    startServer
};