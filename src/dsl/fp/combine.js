module.exports = (...options) => {
  let errs2   = []
  const args2 = {}

  for (let i = 0; i < options.length; i++) {
    const {errs = [], args} = options[i]

    if (errs.length > 0) {
      errs2 = errs2.concat(errs)
    } else {
      const keys = Object.keys(args)

      for (let i = 0; i < keys.length; i++) {
        const key   = keys[i]
        const value = args[key]
        args2[key]  = value
      }
    }
  }

  return {errs: errs2, args: args2}
}