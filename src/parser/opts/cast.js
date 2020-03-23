const {argumentIsNotABool, argumentIsNotANumber} = require('../../errors')

module.exports = ({errs = [], opts: OPTS = []} = {}) => {
  const opts = []

  for (let i = 0; i < OPTS.length; i++) {
    const option = OPTS[i]
    const {values: VALUES, types} = option

    let values = []

    if (typeof types === 'undefined' || types === null) {
      values = VALUES
    } else {
      if (types.length !== 0) {
        for (let j = 0; j < types.length; j++) {
          const type = types[j]
          const value  = VALUES[j]
          switch (type) {
            case 'string':
              values.push(value)
              break
            case 'number':
              const float = parseFloat(value)
              if (!Number.isNaN(float)) values.push(float)
              else errs.push(argumentIsNotANumber({value, option}))
              break
            case 'bool':
              if (value === 'true')       values.push(true)
              else if (value === 'false') values.push(false)
              else errs.push(argumentIsNotABool({value, option}))
              break
            default:
              values.push(value)
              break
          }
        }
      }
    }

    opts.push({...option, values, types})
  }

  return {errs, opts}
}