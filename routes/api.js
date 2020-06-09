const express = require('express');
const app = express();
const http = require("http");
const querystring = require("querystring");

app.post('/', function(req, res) {
    var user = req.body;
});

app.post('/select', function(req, res) {
    var data = querystring.stringify({
        email: req.user.email,
        image: req.body.image
    });
    console.log(req.body.image);
    var options = {
        host: 'localhost',
        port: 5000,
        path: '/api',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    var req = http.request(options, function(res)
    {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log("body: " + chunk);
        });
    });
    req.write(data);
    req.end();
    res.redirect('/');
});

module.exports = app;