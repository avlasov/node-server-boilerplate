const request = require('supertest');
const app = require('../../../app/server');
const expect = require('chai').expect;

describe('GET /api/v1/healthcheck', function () {
    it('should send 200', function (done) {
        request(app)
            .get('/api/v1/healthcheck')
            .end(function (end, res) {
                expect(res.statusCode).to.equal(200);
                done();
            });
    });
});

describe('GET /api/v1/healthcheck-failure', function () {
    it('should send 500', function (done) {
        request(app)
            .get('/api/v1/healthcheck-failure')
            .end(function (end, res) {
                expect(res.statusCode).to.equal(500);
                done();
            });
    });
});