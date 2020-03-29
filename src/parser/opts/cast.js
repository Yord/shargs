const {argumentIsNotABool, argumentIsNotANumber} = require('../../errors')

module.exports = ({errs = [], opts: OPTS = []} = {}) => {
  let errs2 = []
  const opts = []

  for (let i = 0; i < OPTS.length; i++) {
    const option = OPTS[i]
    
    const {errs: errs3, option: option2} = transformOption(option, 'values')
    const {errs: errs4, option: option3} = transformOption(option2, 'defaultValues')

    errs2 = errs2.concat(errs3).concat(errs4)
    opts.push(option3)
  }

  return {errs: errs.concat(errs2), opts}
}

function transformOption (option, key) {
  const errs  = []
  let option2 = option

  const {[key]: VALUES, types} = option

  if (VALUES === null || typeof VALUES === 'undefined') {
    option2 = option
  } else {
    let values = []

    if (typeof types === 'undefined' || types === null) {
      values = VALUES
    } else if (Array.isArray(types) && types.length === 0) {
      values = VALUES
    } else {
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
            else errs.push(argumentIsNotANumber({[key]: VALUES, index: j, option}))
            break
          case 'bool':
            if (value === 'true' || value === true)        values.push(true)
            else if (value === 'false' || value === false) values.push(false)
            else errs.push(argumentIsNotABool({[key]: VALUES, index: j, option}))
            break
          default:
            values.push(value)
            break
        }
      }
    }

    option2 = {...option, ...(values.length === 0 ? {} : {[key]: values})}
  }

  return {errs, option: option2}
}