module.exports = (options = {}) => {
  const {key = null, args = [], types = null, only = null, desc = '', opts = null} = options

  const errs  = []
  const args2 = {}

  if (key === null) {
    const noArgumentProvidedInOption = {
      code: 'No argument provided in option',
      msg:  "Please provide a key (e.g. [{key: 'foo', ...}])",
      info: {options}
    }
    errs.push(noArgumentProvidedInOption)
  }
  
  if (args === null || args.length === 0) {
    const noArgumentsProvidedInOption = {
      code: 'No arguments provided in option',
      msg:  "Please provide at least one argument (e.g. [{args: ['--foo'], ...}])",
      info: {options}
    }
    errs.push(noArgumentsProvidedInOption)
  }
  
  if (key !== null && args !== null && args.length > 0) {
    for (let i = 0; i < args.length; i++) {
      const arg  = args[i]
      if (typeof args2[arg] === 'undefined') args2[arg] = []
      args2[arg].push({key, types, only, desc, opts})
    }
  }

  return {errs, args: args2}
}