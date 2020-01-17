module.exports = (options = {}) => {
  const {arg = null, args = [], types = null, only = null, desc = '', opts = null} = options

  const errs  = []
  const args2 = {}

  if (arg === null) {
    const noArgumentProvidedInOption = {
      code: 'No argument provided in option',
      msg:  "Please provide an arg key (e.g. {arg: 'foo'})",
      info: {options}
    }
    errs.push(noArgumentProvidedInOption)
  }
  
  if (args === null || args.length === 0) {
    const noArgumentsProvidedInOption = {
      code: 'No arguments provided in option',
      msg:  "Please provide at least one argument (e.g. {args: ['--foo']})",
      info: {options}
    }
    errs.push(noArgumentsProvidedInOption)
  }
  
  if (arg !== null && args !== null && args.length > 0) {
    for (let i = 0; i < args.length; i++) {
      const key  = args[i]
      args2[key] = {arg, types, only, desc, opts}
    }
  }

  return {errs, args: args2}
}