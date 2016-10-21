# Node.js Server Boilerplate

A quick server with 100% configurable options and minimal dependencies.

## Features

- It's small!
- Convenient API routes structure. Just drop your route file(s) into routes folder, define route paths and handlers, and that's it.
- Advanced logging using [winston](https://github.com/winstonjs/winston) library. There are 3 transports currently set up: application, debugging and slack. Application transport logs to a console and a file system in logstash format, so the files can be picked up by your logging tools. Slack is a custom transport with a name that speaks for itself. 
- Bonus: in `src/scripts/events.js` is my old, ES5 based small event object, that allows to put events on custom objects, and trigger them. It was more designed for a front end , and pretty useless at this point. I just left it there as a reminder for myself where I started. 

Many yet to come. Initially I had authentication and session management as part of this boilerplate, but I removed it, as I find that it's usually very customized setup for each project. Nevertheless, I recommend [passport.js](http://passportjs.org/) for auth, and Redis based solution for session storage.


## Getting Started

- Requirements: Node.js v6+, npm 3.9+
- Run `npm install`
- Open `config/default.yml` and edit your preferences. Better yet is to create your own configuration file that would overwrite defaults. See [Config](https://github.com/lorenwest/node-config) for documentation.
    - some useful options:
        - `server.port` - port on which server will run
        - `slack` *(webhook, channel, domain, username)* if you are using slack logger, change these params to send logs to your specific slack channel
        - `logger` sets various options for log transports
- Run `node server.js` to start the server. In production, I use PM2. In development, I use nodemon.

## ToDo
Ahh, there is always something to do.
I will be adding some extra goodies in the few days:
- Tests
- Vagrant provisioning with Ansible. I will be adding a Vagrant file and an Ansible role, that provisions a small ubuntu box with application running on it persistently. I will definitely be adding Redis and session management to the box, and perhaps a database or two, for models boilerplate.
- Maybe a packer config to create an AWS AMI.
- CI with travis
- More features, better code.

   

        

