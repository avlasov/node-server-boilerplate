import config from 'config'
import https from 'https'
import http from 'http'
import fs from 'fs'
import app from './server'
// import logger from './services/logger'
import { name } from '../package.json'

// const sslConfig = config.get('ssl')
// const privateKey = fs.readFileSync(sslConfig.key, 'utf8')
// const certificate = fs.readFileSync(sslConfig.cert, 'utf8')
const port = config.get('server').port || 8443
const logger = {
  info: console.log
}


if (process.env.NODE_ENV !== 'production') {
  http.createServer(app).listen(port, () => {
    logger.info(`${name} is listening on http port ${port}`)
  })
} else{
  https.createServer({
    key: privateKey,
    cert: certificate
  }, app).listen(port, () => {
    logger.info(`${name} is listening on https port ${port}`)
  })
}