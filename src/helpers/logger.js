// NB: Logs are in UTC time
import moment from 'moment'

const winston = require('winston')
const S3StreamLogger = require('s3-streamlogger').S3StreamLogger

// Both date a processID are needed to name files (clusters would otherwise overwrite each other)

// S3 bucket config
const s3_stream = new S3StreamLogger({
  bucket: 'abroadwith-logs',
  folder: `frontend/${moment().format('YYYY-MM-DD')}`,
  access_key_id: '***REMOVED***',
  secret_access_key: '***REMOVED***',
  name_format: `abroadwith_frontend_logs_${moment().format('YYYY-MM-DD')}_%H:%M_(${process.pid}).log`,
  rotate_every: 3600000, // Rotates every hour
  config: {
    region: 'eu-central-1',
  },
})

// Bind stream error to different function to prevent recursion
s3_stream.on('error', (err) => console.log(err))

const transports = []

transports.push(
  new (winston.transports.Console)()
)

// Only log to S3 in production
if (process.env.NODE_ENV === 'production') {
  transports.push(
    new (winston.transports.File)({
      stream: s3_stream,
    }),
  )
}

// This is our logger function
const logger = new winston.Logger({
  transports,
})

export default logger
