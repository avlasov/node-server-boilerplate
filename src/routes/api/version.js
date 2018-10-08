/**
 * Get API version
 */

// import { app as logger } from '../../services/logger'
import Bluebird from 'bluebird'
import { version } from '../../../package.json'


module.exports = [
  ['GET /version', getVersion],
]


function getVersion(req, res) {
  return Bluebird.try(() => {
    return res.json({version})
  }).catch((err) => {
    // logger.error(err)
    return res.sendStatus(500)
  })
}
