const https = require('https');
const fs = require('fs');

var tokens;

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

    const req = https.request(options, (res) => {
        let response = '';
        res.on('data', (chunk) => { response += chunk; });
        res.on('end', () => {
            tokens = JSON.parse(response);
            onFinish();
        });
    }).on('error', (e) => {
        // TODO: Go to error page or something
        fs.writeFile('errorLog.txt', e, (err) => {});
    });

    var query = 'grant_type=authorization_code&code=' + code + '&redirect_uri=' + redirect;
    req.end(query);
}

function getApi(path, callback) {
    const options = {
        hostname: 'api.spotify.com',
        path: path,
        method: 'GET',
        headers: {
            Authorization: "Bearer " + tokens.access_token
        }
    };

    const req = https.request(options, (res) => {
        let response = '';
        res.on('data', (chunk) => { response += chunk; });
        res.on('end', () => {
            callback(response);
        });
    }).on('error', (e) => {
        // TODO: Go to error page or something
        fs.writeFile('errorLog.txt', e, (err) => {});
    });

    req.end();
}

module.exports = {
    getAuthToken,
    getApi
};