# Logs

Keeping track of user behaviour and application errors is very important for debugging. In the initial build of this application, I have set up logging in a very modest/conservative way - currently only session initialisation requests and redux actions with the suffix `_FAIL` are logged. However, if desired, literally all redux actions could be logged.

## Helpers

#### Logger

Location: `src/helpers/logger.js`

Purpose: write and transport logs to an Amazon S3 bucket.

#### Error Reducer

Location: `src/redux/modules/errorHandler.js`

Purpose: listen across entire store for any actions with the suffix `_FAIL`, and POST their content to our server-side logger.

## The Setup

Logging and error reporting both happen via [winston](https://github.com/winstonjs/winston). Winston only runs in a NodeJs (server) environment, but that ends up being alright in our use case.

All logs are streamed (in chunks) to an S3 bucket:

```
abroadwith-logs/frontend
```

In this bucket, logs are stored in files formatted as such:

```
abroadwith_frontend_logs_YYYY-MM-DD_HH:MM_(PID)
```

*NB: The PID is the specific process (in a cluster). Because the production application runs in a cluster of processes, this is the easiest way to make sure different processes do not overwrite each other. There is probably a more elegant way to go about this, but I decided not to devote time to it.*

The logs rotate on a specified period of time (currently every hour), or whenever the process restarts (eg deployment). This should allow you to locate error reports within an hour of accuracy.

## What gets logged?

Currently, not a lot:

1. Session initialisation requests
2. Any Redux action with the `_FAIL` suffix

Feel free to add anything necessary.
