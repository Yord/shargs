module.exports = (only = null) => ({errs = [], argv = []} = {}) => {
  const errs2 = []
  let argv2   = []

  if (typeof only === 'undefined' || only === null) {
    argv2 = argv
  } else {
    for (let i = 0; i < argv.length; i++) {
      const arg = argv[i]
      if (only.indexOf(arg) > -1) {
        argv2.push(arg)
      } else {
        const argsValueRestrictionsViolated = {
          code: 'Argument value restrictions violated',
          msg:  'The argument is not in the allowed set of values',
          info: {arg, only}
        }
        errs2.push(argsValueRestrictionsViolated)
      }
    }
  }

  return {errs: errs.concat(errs2), argv: argv2}
}