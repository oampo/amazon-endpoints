var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var http = require('http');

var bodyValidator = require('./body-validator');
var mimetypeValidator = require('./mimetype-validator');
var schemaValidator = require('./schema-validator');

var app = express();

app.use(bodyParser.json());

app.post('/record', [
    bodyValidator,
    mimetypeValidator('application/json'),
    schemaValidator({
        'artist': String(),
        'album': String(),
        'tracks': [{
            'title': String(),
            'length': Number()
        }],
        'price': Number(),
    })
], function(req, res) {
    var record = req.body;

    // Sheesh, this is a really funky flat-file database...
    var fileName = path.join('db',
            crypto.randomBytes(20).toString('hex') + '.json');

    fs.open(fileName, 'w', function(err, fd) {
        if (err) {
            res.sendStatus(500);
        }
        fs.write(fd, record.toString(), function(err, written, string) {
            if (err) {
                res.sendStatus(500);
            }
            res.status(201).json({
                location: fileName
            });
        });
    });
});

// Error handling middleware
app.use(function(err, req, res, next) {
    if (err.status) {
        return res.status(err.status).json({
            message: err.message || http.STATUS_CODES[err.status] || err.status
        });
    }
    next(err);
});

app.listen(8080);

module.exports = app;
