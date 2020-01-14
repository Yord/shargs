module.exports = (arg, options = {}) => {
  const {args = [], types = null, only = null, opts = null, desc = ''} = options

  const errs  = []
  const args2 = {}

  if (args !== null && args.length > 0) {
    for (let i = 0; i < args.length; i++) {
      const key  = args[i]
      args2[key] = {arg, types, only, opts, desc}
    }
  } else {
    const noArgumentProvidedInOption = {
      code: 'No arguments provided in option',
      msg:  "Please provide at least one argument (e.g. {args: ['--foo']})",
      info: {arg, options}
    }
    errs.push(noArgumentProvidedInOption)
  }

  return {errs, args: args2}
}