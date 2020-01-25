const {noArgumentProvidedInOption, noArgumentsProvidedInOption} = require('../../errors')

module.exports = (options = {}) => {
  const {key = null, args: ARGS = [], types = null, only = null, desc = '', opts = null} = options

  const errs = []
  const args = {}

  if (key === null) {
    errs.push(noArgumentProvidedInOption({options}))
  }
  
  if (ARGS === null || ARGS.length === 0) {
    errs.push(noArgumentsProvidedInOption({options}))
  }
  
  if (key !== null && ARGS !== null && ARGS.length > 0) {
    for (let i = 0; i < ARGS.length; i++) {
      const arg  = ARGS[i]
      if (typeof args[arg] === 'undefined') args[arg] = []
      args[arg].push({key, types, only, desc, opts})
    }
  }

  return {errs, args}
}