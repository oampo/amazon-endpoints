var path = require('path');
var fs = require('fs');

var chai = require('chai');
var chaiHttp = require('chai-http');

var app = require('./index.js');

var should = chai.should();

chai.use(chaiHttp);

describe('Post endpoint', function() {
    it('should save a file on POST', function(done) {
        var record = require('./test-record.json');
        chai.request(app)
            .post('/record')
            .send(record)
            .end(function(err, res) {
                (err === null).should.be.true;
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('location');
                fs.existsSync(res.body.location).should.be.true;
                fs.statSync(res.body.location).isFile().should.be.true;
                var contents = fs.readFileSync(res.body.location);
                contents.toString().should.equal(record.toString());
                done();
            });
    });

    it('should reject missing data', function(done) {
        chai.request(app)
            .post('/record')
            .type('json')
            .end(function(err, res) {
                (err === null).should.be.true;
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal('Empty request body.');
                done();
            });
    });

    it('should reject non-json data', function(done) {
        chai.request(app)
            .post('/record')
            .field('record', require('./test-record.json').toString())
            .end(function(err, res) {
                (err === null).should.be.true;
                res.should.have.status(415);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                done();
            });
    });

    it('should reject malformed JSON', function(done) {
        chai.request(app)
            .post('/record')
            .type('json')
            .send('{"Malformed JSON": }')
            .end(function(err, res) {
                (err === null).should.be.true;
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                done();
            });
    });

    it('should reject missing artist', function(done) {
        var record = require('./test-record.json');
        delete record.artist;
        chai.request(app)
            .post('/record')
            .send(record)
            .end(function(err, res) {
                (err === null).should.be.true;
                res.should.have.status(422);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal('Missing attribute: artist.');
                done();
            });
    });

    it('should reject missing album', function(done) {
        var record = require('./test-record.json');
        delete record.album;
        chai.request(app)
            .post('/record')
            .send(record)
            .end(function(err, res) {
                (err === null).should.be.true;
                res.should.have.status(422);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal('Missing attribute: album.');
                done();
            });
    });

    it('should reject missing tracks', function(done) {
        var record = require('./test-record.json');
        delete record.tracks;
        chai.request(app)
            .post('/record')
            .send(record)
            .end(function(err, res) {
                (err === null).should.be.true;
                res.should.have.status(422);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal('Missing attribute: tracks.');
                done();
            });
    });

    it('should reject missing price', function(done) {
        var record = require('./test-record.json');
        delete record.price;
        chai.request(app)
            .post('/record')
            .send(record)
            .end(function(err, res) {
                (err === null).should.be.true;
                res.should.have.status(422);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal('Missing attribute: price.');
                done();
            });
    });

    it('should reject missing title', function(done) {
        var record = require('./test-record.json');
        delete record.tracks[0].title;
        chai.request(app)
            .post('/record')
            .send(record)
            .end(function(err, res) {
                (err === null).should.be.true;
                res.should.have.status(422);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal('Missing attribute: tracks[0].title.');
                done();
            });
    });

    it('should reject missing length', function(done) {
        var record = require('./test-record.json');
        delete record.tracks[0].length;
        chai.request(app)
            .post('/record')
            .send(record)
            .end(function(err, res) {
                (err === null).should.be.true;
                res.should.have.status(422);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal('Missing attribute: tracks[0].length.');
                done();
            });
    });

    it('should reject incorrect artist', function(done) {
        var record = require('./test-record.json');
        record.artist = {};
        chai.request(app)
            .post('/record')
            .send(record)
            .end(function(err, res) {
                (err === null).should.be.true;
                res.should.have.status(422);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal('Incorrect type: artist. Expected String. Received Object.');
                done();
            });
    });

    it('should reject incorrect album', function(done) {
        var record = require('./test-record.json');
        record.album= {};
        chai.request(app)
            .post('/record')
            .send(record)
            .end(function(err, res) {
                (err === null).should.be.true;
                res.should.have.status(422);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal('Incorrect type: album. Expected String. Received Object.');
                done();
            });
    });

    it('should reject incorrect tracks', function(done) {
        var record = require('./test-record.json');
        record.tracks = {};
        chai.request(app)
            .post('/record')
            .send(record)
            .end(function(err, res) {
                (err === null).should.be.true;
                res.should.have.status(422);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal('Incorrect type: tracks. Expected Array. Received Object.');
                done();
            });
    });

    it('should reject incorrect price', function(done) {
        var record = require('./test-record.json');
        record.price = {};
        chai.request(app)
            .post('/record')
            .send(record)
            .end(function(err, res) {
                (err === null).should.be.true;
                res.should.have.status(422);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal('Incorrect type: price. Expected Number. Received Object.');
                done();
            });
    });

    it('should reject incorrect track', function(done) {
        var record = require('./test-record.json');
        record.tracks[0] = '';
        chai.request(app)
            .post('/record')
            .send(record)
            .end(function(err, res) {
                (err === null).should.be.true;
                res.should.have.status(422);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal('Incorrect type: tracks[0]. Expected Object. Received String.');
                done();
            });
    });

    it('should reject incorrect title', function(done) {
        var record = require('./test-record.json');
        record.tracks[0].title = {};
        chai.request(app)
            .post('/record')
            .send(record)
            .end(function(err, res) {
                (err === null).should.be.true;
                res.should.have.status(422);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal('Incorrect type: tracks[0].title. Expected String. Received Object.');
                done();
            });
    });

    it('should reject incorrect length', function(done) {
        var record = require('./test-record.json');
        record.tracks[0].length = {};
        chai.request(app)
            .post('/record')
            .send(record)
            .end(function(err, res) {
                (err === null).should.be.true;
                res.should.have.status(422);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.equal('Incorrect type: tracks[0].length. Expected Number. Received Object.');
                done();
            });
    });

    afterEach(function() {
        delete require.cache[path.join(__dirname, 'test-record.json')];
    });
});
