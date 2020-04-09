const {illegalKeyName} = require('../errors')

module.exports = (opt = {}) => {
  const errs = []
  const args = {}

  const {
    key = null,
    args: ARGS = []
  } = opt

  if (key === '_') {
    errs.push(illegalKeyName({key, option: opt}))
  } else if (key !== null && ARGS !== null && ARGS.length > 0) {
    for (let i = 0; i < ARGS.length; i++) {
      const arg  = ARGS[i]
      if (typeof args[arg] === 'undefined') args[arg] = []

      const {__proto__: _2, ...rest} = opt
      args[arg].push(rest)
    }
  }

  return {errs, args}
}