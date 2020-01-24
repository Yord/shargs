const {argumentIsNotABool, argumentIsNotANumber} = require('../errors')

module.exports = option => ({errs = [], argv = []} = {}) => {
  const errs2 = []
  const argv2 = []

  const {types} = option

  if (types !== null) {
    if (types.length === 0) {
      argv2.push(true)
    } else {
      for (let i = 0; i < types.length; i++) {
        const type = types[i]
        const arg  = argv[i]
        switch (type) {
          case 'count':
            argv2.push(1)
            break
          case 'string':
            argv2.push(arg)
            break
          case 'number':
            const float = parseFloat(arg)
            if (!Number.isNaN(float)) argv2.push(float)
            else errs2.push(argumentIsNotANumber({option, arg}))
            break
          case 'bool':
            if (arg === 'true')       argv2.push(true)
            else if (arg === 'false') argv2.push(false)
            else errs2.push(argumentIsNotABool({option, arg}))
            break
          default:
            break
        }
      }
    }
  }

  return {errs: errs.concat(errs2), argv: argv2}
}