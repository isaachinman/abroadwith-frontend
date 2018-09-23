import config from 'config'

export default function googleTrack(options) {

  if (typeof window !== 'undefined' && typeof ga === 'function' && config.env === 'production') {

    ga('send', 'event', options.eventCategory, options.eventAction) // eslint-disable-line

  }

}
