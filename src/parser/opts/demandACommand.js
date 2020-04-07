const {commandRequired} = require('../errors')

module.exports = ({errs = [], opts = []} = {}) => {
  const errs2 = []

  if (noCommandIn(opts)) {
    errs2.push(commandRequired({options: opts}))
  }

  return {errs: errs.concat(errs2), opts}
}

function noCommandIn (opts) {
  return !opts.some(isCommand)
}

function isCommand ({types, values}) {
  return types === null && typeof values !== 'undefined'
}