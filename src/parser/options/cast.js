const {argumentIsNotABool, argumentIsNotANumber} = require('../../errors')

module.exports = ({errs: ERRS = [], opts: OPTS = []} = {}) => {
  const errs = []
  const opts = []

  for (let i = 0; i < OPTS.length; i++) {
    const option = OPTS[i]
    const {values: VALUES, types} = option

    let values = []

    if (typeof types === 'undefined' || types === null) {
      values = VALUES
    } else {
      if (types.length === 0) {
        values.push(true)
      } else {
        for (let j = 0; j < types.length; j++) {
          const type = types[j]
          const arg  = VALUES[j]
          switch (type) {
            case 'count':
              values.push(1)
              break
            case 'string':
              values.push(arg)
              break
            case 'number':
              const float = parseFloat(arg)
              if (!Number.isNaN(float)) values.push(float)
              else errs.push(argumentIsNotANumber({arg, option}))
              break
            case 'bool':
              if (arg === 'true')       values.push(true)
              else if (arg === 'false') values.push(false)
              else errs.push(argumentIsNotABool({arg, option}))
              break
            default:
              break
          }
        }
      }
    }

    opts.push({...option, values, types})
  }

  return {errs: ERRS.concat(errs), opts}
}