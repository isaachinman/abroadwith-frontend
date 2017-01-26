// Absolute imports
import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom/server'
import serialize from 'serialize-javascript'
import Helmet from 'react-helmet'
import config from 'config'
import UILanguages from 'data/constants/UILanguages'

// Relative imports
import styles from '../containers/App/App.styles'

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
export default function Html(props) {

  const { assets, component, store, i18n } = props
  const content = component ? ReactDOM.renderToString(component) : ''
  const head = Helmet.rewind()

  const { routing } = props.store.getState()

  // Determine the basepath for SEO reasons (link rel=alternative)
  let basePath = routing.locationBeforeTransitions.pathname
  Object.values(UILanguages).map(locale => {
    if (locale.iso2 !== 'en') {
      basePath = basePath.replace(locale.basepath, '')
    }
  })
  basePath = basePath.replace(/^\//, '')

  return (
    <html lang='en'>
      <head>
        {head.base.toComponent()}
        {head.title.toComponent()}
        {head.meta.toComponent()}
        {head.link.toComponent()}
        {head.script.toComponent()}

        <link rel='alternate' href={`https://www.abroadwith.com/es/${basePath}`} hrefLang='es' />
        <link rel='alternate' href={`https://www.abroadwith.com/de/${basePath}`} hrefLang='de' />
        <link rel='alternate' href={`https://www.abroadwith.com/${basePath}`} hrefLang='en' />
        <link rel='alternate' href={`https://www.abroadwith.com/${basePath}`} hrefLang='x-default' />

        <link rel='icon' type='image/png' sizes='32x32' href='https://abroadwith.imgix.net/app/favicon/favicon.png' />
        <link href='https://fonts.googleapis.com/css?family=Heebo:500|Karla:400,700' rel='stylesheet' />
        <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css' type='text/css' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        {/* styles (will be present only in production with webpack extract text plugin) */}
        {Object.keys(assets.styles).map((style, key) =>
          <link href={assets.styles[style]} key={key} media='screen, projection'
            rel='stylesheet' type='text/css' charSet='UTF-8'
          />
        )}

        {/* (will be present only in development mode) */}
        {/* outputs a <style/> tag with all bootstrap styles + App.scss + it could be CurrentPage.scss. */}
        {/* can smoothen the initial style flash (flicker) on page load in development mode. */}
        {/* ideally one could also include here the style for the current page (Home.scss, About.scss, etc) */}
        {/* eslint-disable */}
        {Object.keys(assets.styles).length === 0 ? <style dangerouslySetInnerHTML={{ __html: require('../containers/App/App.styles')._style }} /> : null}
        {/* eslint-enable */}

        <script type='text/javascript' src='https://maps.googleapis.com/maps/api/js?key=AIzaSyBQW0Z5fmFm8snLhXDOVuD8YuegwCMigqQ&libraries=places' />
      </head>
      <body style={styles.app}>
        <div id='content' dangerouslySetInnerHTML={{ __html: content }} />
        <script dangerouslySetInnerHTML={{ __html: `window.__data=${serialize(store.getState())};` }} />
        <script dangerouslySetInnerHTML={{ __html: `window.__i18n=${serialize(i18n)};` }} />
        <script dangerouslySetInnerHTML={{ __html: `window.__apiHost='${config.apiHost}'` }} />
        <script src={assets.javascript.main} charSet='UTF-8' />
      </body>
    </html>
  )
}

Html.propTypes = {
  assets: PropTypes.object,
  component: PropTypes.node,
  store: PropTypes.object,
  i18n: PropTypes.object,
}
