import { validateExists } from 'utils/validation'

export default (password) => {

  let validationMessages = [] // eslint-disable-line
  let validity = true

  if (validateExists(password)) {

    if (password.length < 8) {
      validationMessages.push('TOO_SHORT')
    }

    if (!(password.match(/[a-z]/))) {
      validationMessages.push('AT_LEAST_ONE_LOWERCASE_LETTER')
    }

    // if (!(password.match(/[A-Z]/))) {
    //   validationMessages.push('AT_LEAST_ONE_UPPERCASE_LETTER')
    // }

    if (!(/\d/.test(password))) {
      validationMessages.push('AT_LEAST_ONE_NUMBER')
    }

  } else {
    validationMessages.push('NO_VALUE')
  }

  if (validationMessages.length > 0) {
    validity = false
  }

  return {
    valid: validity,
    errors: validationMessages,
  }

}
