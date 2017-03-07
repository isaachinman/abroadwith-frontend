# Logs

Keeping track of user behaviour and application errors is very important for debugging. In the initial build of this application, I have set up logging in a very modest/conservative way - currently only session initialisation requests and redux actions with the suffix `_FAIL` are logged. However, if desired, literally all redux actions could be logged.

## Logger

Location: `src/helpers/logger.js`

Purpose: write and transport logs to an Amazon S3 bucket.

## Error Reducer

Location: `src/redux/modules/errorHandler.js`

Purpose: listen across entire store for any actions with the suffix `_FAIL`, and POST their content to our server-side logger.
