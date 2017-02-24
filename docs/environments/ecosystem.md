# Ecosystem

In addition to the `config` directory, there is also an `ecosystem` directory. While `config` pertains primarily to build configuration, `ecosystem` pertains to runtime configuration, specifically via the `pm2` process manager. These are, importantly, distinct from each other. For example, both the `integration` and `production` environments can be run off the same webpack build, simply by swapping out the `env`.

There's not a lot to say here, except that in formal environments (not dev), `abroadwith-frontend` is run as a cluster of individual processes. This allows load balancing, and also soft (zero downtime) reloads.

### Future plans

The idea is that the Abroadwith educator's platform will eventually be built into this repository as well, and will run on port 4000. In terms of ecosystem, all that would be required is to add another config object to the `apps` array.
