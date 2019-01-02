const https = require('https');

const AUTH_URL = "https://accounts.spotify.com";

function getAuthToken(code, redirect, onFinish) {
    const options = {
        hostname: 'accounts.spotify.com',
        path: '/api/token',
        method: 'POST',
        headers: {
            'Authorization': "Basic OTMwMTA4MDAwMmQzNDFkZGExMmVhZTZlOWUwNGI4NTQ6NGEzMTdjNWYyNzNlNGExYmJiMzBlZGExZjc0ZmExNzI=",
            'Content-Type': "application/x-www-form-urlencoded"
        }
    };
    const fs = require('fs');

    const req = https.request(options, (res) => {
        let response = '';
        res.on('data', (chunk) => { response += chunk; });
        res.on('end', () => {
            const responseJson = JSON.parse(response);
            onFinish(responseJson);
        });
    }).on('error', (e) => {
        // TODO: Go to error page or something
        fs.writeFile('errorLog.txt', e, (err) => {});
    });

    var query = 'grant_type=authorization_code&code=' + code + '&redirect_uri=' + redirect;
    req.end(query);
}

module.exports = {
    getAuthToken
};