import { showLoading, hideLoading } from 'react-redux-loading-bar'
import { browserHistory } from 'react-router'

export default function routingAnimation(dispatch) {

  browserHistory.listen(location => {
    console.log(location)

    dispatch(showLoading())
    setTimeout(() => dispatch(hideLoading()), 500)

  })

}
