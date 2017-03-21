# Config

The top level `config` directory contains all build configuration. The things happening here are going to be very confusing to someone not familiar with [webpack](https://webpack.js.org/), and frontend build tools generally speaking. If you don't know exactly what you're doing, tread carefully.

It's important to note that for build considerations, there are only two envs: `prod` and `dev`. For runtime, we have three: `dev`, `integration`, and `production`.

## Contents

#### dev.config.js

The more complex aspects of this config have to do with
1. Hot reload
2. Happypack loader/caching

Besides that, it's quite a standard webpack-for-react dev setup.

#### prod.config.js

This is the production config, so naturally everything here is focused around bundle optimisation. A few important notes:

* Unlike a lot of other projects and boilerplates you'll see online, this project compresses _at build time_, not at runtime.

* AggressiveMergingPlugin can potentially be turned off in the future. It can create quite strange/unexpected merges of code chunks, and its efficacy depends on user overlap of merged chunks.

#### resolve.paths.js

This can be used to force path resolution for commonly imported modules, like `config`, etc.

#### translations.config.js

This is a simple script that transforms translation data from our `locales` repo into a more useful format to be consumed by this application, and then it moves that data in the `build` directory so that it is publicly exposed.

#### webpack-dev-server.js and webpack-isomorphic-tools.js

Don't worry about these, you probably don't ever need to touch them.
