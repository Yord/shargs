const {noArgumentsProvidedInOption, noKeyProvidedInOption} = require('../../errors')

module.exports = (opt = {}) => {
  const {
    key = null,
    args: ARGS = [],
    types = null,
    desc = '',
    only = null,
    opts = null,
    values = null
  } = opt

  const errs = []
  const args = {}

  if (key === null) {
    errs.push(noKeyProvidedInOption({option: opt}))
  }
  
  if (ARGS === null || ARGS.length === 0) {
    errs.push(noArgumentsProvidedInOption({option: opt}))
  }
  
  if (key !== null && ARGS !== null && ARGS.length > 0) {
    for (let i = 0; i < ARGS.length; i++) {
      const arg  = ARGS[i]
      if (typeof args[arg] === 'undefined') args[arg] = []

      const {args: _1, __proto__: _2, ...rest} = opt
      args[arg].push(rest)
    }
  }

  return {errs, args}
}