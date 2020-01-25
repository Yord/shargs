const {argumentIsNotABool, argumentIsNotANumber} = require('../../errors')

module.exports = ({errs: ERRS = [], opts: OPTS = []} = {}) => {
  const errs = []
  const opts = []

  for (let i = 0; i < OPTS.length; i++) {
    const option = OPTS[i]
    const {values, types} = option

    let values2 = []

    if (typeof types === 'undefined' || types === null) {
      values2 = values
    } else {
      if (types.length === 0) {
        values2.push(true)
      } else {
        for (let j = 0; j < types.length; j++) {
          const type = types[j]
          const arg  = values[j]
          switch (type) {
            case 'count':
              values2.push(1)
              break
            case 'string':
              values2.push(arg)
              break
            case 'number':
              const float = parseFloat(arg)
              if (!Number.isNaN(float)) values2.push(float)
              else errs.push(argumentIsNotANumber({arg, option}))
              break
            case 'bool':
              if (arg === 'true')       values2.push(true)
              else if (arg === 'false') values2.push(false)
              else errs.push(argumentIsNotABool({arg, option}))
              break
            default:
              break
          }
        }
      }
    }

    opts.push({...option, values: values2, types})
  }

  return {errs: ERRS.concat(errs), opts}
}