import superagent from 'superagent'
import config from '../config'

const methods = ['get', 'post', 'put', 'patch', 'delete']

function formatUrl(path) {

  const adjustedPath = path[0] !== '/' ? '/' + path : path

  if (__SERVER__) {
    // Prepend host and port of the API server to the path.
    return config.apiHost + adjustedPath
  }
  // Prepend `/api` to relative URL, to proxy to API server.
  return window.__apiHost + adjustedPath
}

export default class ApiClient {
  constructor(req) {
    /* eslint-disable no-return-assign */
    methods.forEach((method) =>
      this[method] = (path, { params, data, auth } = {}) => new Promise((resolve, reject) => {

        const request = superagent[method](formatUrl(path))

        if (auth) {
          request.set({ Authorization: `Bearer ${(auth)}` })
        }

        if (params) {
          request.query(params)
        }

        if (__SERVER__ && req.get('cookie')) {
          request.set('cookie', req.get('cookie'))
        }

        if (data) {
          request.send(data)
        }

        request.end((err, res, { body } = {}) => {

          let response

          if (body && typeof body !== 'undefined') {
            response = body
          } else if (res && typeof res !== 'undefined' && res.text) {
            response = res.text
          }

          try {
            response = JSON.parse(response)
          } catch (e) {
            // Not JSON, don't parse
          }

          return err ? reject(body || err) : resolve(response)

        })
      }))
    /* eslint-enable no-return-assign */
  }
  /*
   * There's a V8 bug where, when using Babel, exporting classes with only
   * constructors sometimes fails. Until it's patched, this is a solution to
   * "ApiClient is not defined" from issue #14.
   * https://github.com/erikras/react-redux-universal-hot-example/issues/14
   *
   * Relevant Babel bug (but they claim it's V8): https://phabricator.babeljs.io/T2455
   *
   * Remove it at your own risk.
   */
  empty() {}
}
