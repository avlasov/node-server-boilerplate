import { createLogger, format, transports } from 'winston'
import config from 'config'

const { logPath, level } = config.get('logger')
const MESSAGE = Symbol.for('message')
const LEVEL = Symbol.for('level')


// this is the fix for current winston 3 behavior where javascript error objects are parsed incorrectly
const convertErrorObjects = format((info, opts) => {
    if (!(info instanceof Error)) return info
    
    const plainInfoObj = Object.getOwnPropertyNames(info).reduce((acc, curr) => {
      acc[curr] = info[curr]
      return acc
    }, {})
    plainInfoObj[MESSAGE] = info.message
    plainInfoObj[LEVEL] = info[LEVEL]
    return plainInfoObj
  })

const logger = createLogger({
    level,
    exitOnError: false,
    format: format.combine(
      convertErrorObjects(),
      format.timestamp(),
      format.json(),
    ),
    transports: [
      new transports.File({
        filename: `${logPath}/combined.log`,
        handleExceptions: true,
      }),
      new transports.Console({
        handleExceptions: true,
      })
    ],

  });

  export default logger