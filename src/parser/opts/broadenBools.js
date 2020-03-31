const {invalidBoolMapping} = require('../../errors')

module.exports = (alt = {}) => {
  const altToBool = reverse(alt)

  return ({errs = [], opts = []} = {}) => {
    const {errs: errs2, opts: opts2} = broadenValues('values', altToBool, alt, opts)
    const {errs: errs3, opts: opts3} = broadenValues('defaultValues', altToBool, alt, opts2)

    return {
      errs: errs.concat(errs2).concat(errs3),
      opts: opts3
    }
  }
}

function broadenValues (key, altToBool, alt, opts) {
  let errs2   = []
  const opts2 = []

  for (let i = 0; i < opts.length; i++) {
    const opt = opts[i]
    const {types, [key]: values} = opt

    if (hasBool(opt) && validValues(types, values)) {
      const values2 = []

      for (let j = 0; j < values.length; j++) {
        const value = values[j]
        const type  = types[j]

        if (type === 'bool') {
          const bool = altToBool[value]
          if (bool === 'true' || bool === 'false') {
            values2.push(bool)
          } else {
            errs2.push(invalidBoolMapping({key: value, alt}))
            values2.push(value)
          }
        } else {
          values2.push(value)
        }
      }

      opts2.push({...opt, [key]: values2})
    } else {
      opts2.push(opt)
    }
  }

  return {errs: errs2, opts: opts2}
}

function hasBool ({types}) {
  return Array.isArray(types) && types.length > 0 && types.indexOf('bool') > -1
}

function validValues (types, values) {
  return Array.isArray(values) && values.length === types.length
}

function reverse (alt) {
  return Object.keys(alt).reduce(
    (mapping, key) => {
      const alternatives = alt[key]
      if (Array.isArray(alternatives)) {
        return alternatives.reduce(
          (mapping, alternative) => ({...mapping, [alternative]: key}),
          mapping
        )
      } else {
        return mapping
      }
    },
    {true: 'true', false: 'false'}
  )
}