/**
 * This module implements slack transport for winston logger.
 *
 * Usage example (add this to array of winston transports):
 *  const SlackTransport = require('./path/to/this/file');
 *  winston.loggers.add('slack', {
 *  transports: [
 *       new (SlackTransport)({
 *           domain,
 *           webhook,
 *           channel,
 *           username,
 *           level,
 *           icon_emoji
 *       }),
 *   ]
 *});
 */

const request = require('superagent');
const winston = require('winston');
const Bluebird = require('bluebird');
const util = require('util');
const assert = require('assert');

//extend superagent to support promise  chain
request.Request.prototype.exec = function() {
    var req = this;
    return new Bluebird(function(resolve, reject) {
        req.end(function(err, res) {
            if (err) return reject(err);
            resolve(res);
        });
    });
};

class SlackTransport {
    constructor (options) {
        this.name = 'slackTransport';
        this.level = options.level || 'info';
        this.options = options;
    }

    send(level, type, data) {
        return Bluebird.try(() => {
            assert(this.options.webhook, 'Slack Webhook is undefined');
        switch (type) {
            case 'normal':
                this.options.text = data;
                delete this.options.attachments;
                break;
            case 'combined':
                this.options.text = data.msg;
                this.options.attachments = data.attachments;
                break;
            case 'attachments':
                delete this.options.text;
                this.options.attachments = data;
                break;
            default:
                throw new Error('Did not recognize the message type.');
        }

        return request.post(this.options.webhook)
            .set('Accept', 'application/json')
            .send(this.options)
            .exec();
    });
    }

    log(level, msg, meta, callback) {
        const context = this;
        return Bluebird.try(() => {
            assert(msg || (meta && Object.keys(meta).length > 0), 'Nothing to log');
        const hasAttachments = !!meta.attachments;
        let args = [];
        if (!msg) {
            if (hasAttachments) {
                args = [level, 'attachments', meta.attachments];
            } else {
                args = [level, 'normal', JSON.stringify(meta)];
            }
        } else {
            if (hasAttachments) {
                args = [level, 'combined', {msg, attachments: meta.attachments}];
            } else {
                args = [level, 'normal', msg];
            }
        }
        return this.send(...args);
    }).then(res => {
            context.emit('logged');
        callback(null, true);
    }).catch(err=> {
            callback(err);
    });

    }
}
util.inherits(SlackTransport, winston.Transport);
winston.transports.SlackTransport = SlackTransport;

module.exports = SlackTransport;


