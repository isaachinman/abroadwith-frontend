# Initial Setup

Clone this repo.

NB: The `locales` repository needs to be cloned (by the same user that will run `npm` commands, for permission reasons) into the top level of this repo.

NB: This project is guaranteed stable in Node v5.x. It *should* work with more recent versions, but you might also encounter some very spooky bugs.

Do `npm run setup`

Then do one of the following, depending on desired environment:

### Development (local)

`npm run dev`

### Integration

`npm run start-integration`*

### Production

`npm run start-production`*



*Requires global installation of `pm2 (latest)`
