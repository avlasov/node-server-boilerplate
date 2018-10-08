import config from 'config'
import express from 'express'
import BodyParser from 'body-parser'
import cors from 'cors'
// import expressWinston from 'express-winston'

// import { app as logger } from './services/logger'
import routes from './routes'

// const loggerSettings = config.get('logger')

const app = express()
app.use(cors())
app.use(BodyParser.json())


// log routes
// app.use(expressWinston.logger({
//     winstonInstance: logger,
//     meta: loggerSettings.middleware.meta,
//     msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}}"
// }))

/**
 * Recursively include all routes
 */

routes(app)

// handle uncaught errors
app.use((err, req, res, next) => {
  const { message } = err
  if (res.headersSent) {
    return next(err)
  }
  // logger.error(err)
  res.status(500).send({error: config.get('errors').uncaught})

})

export default app