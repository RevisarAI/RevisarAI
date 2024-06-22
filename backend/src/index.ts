import initApp from './app'
import http from 'http'
import config from './config'
import createLogger from './utils/logger'
import { Express } from 'express'
import fs from 'fs'
import https from 'https'

const logger = createLogger('Express')

initApp().then((app: Express) => {
  logger.debug(`Running in ${process.env.NODE_ENV} mode`)

  if (process.env.NODE_ENV !== 'production') {
    http.createServer(app).listen(config.port)
  } else {
    const httpsConf = {
      key: fs.readFileSync(`${__dirname}/../client-key.pem`),
      cert: fs.readFileSync(`${__dirname}/../client-cert.pem`)
    }

    https.createServer(httpsConf, app).listen(config.port)
  }

  logger.debug(`Revisar AI backend is listnening on port ${config.port}`)
})
