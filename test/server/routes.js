var request = require('supertest'),
express = require('express');

var app = require('../../app.js');

describe('GET /users', function() {
    it('repsonds with JSON', function(done) {
        request(app)
            .get('/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});