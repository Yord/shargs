const traverseOpts = require('./traverseOpts')
const {invalidBoolMapping} = require('../errors')
const pipe = require('../combinators/pipe')
const and  = require('../combinators/and')

module.exports = (alt = {}) => {
  const altToBool = reverse(alt)

  return pipe(
    broadenValues('values', altToBool, alt),
    broadenValues('defaultValues', altToBool, alt)
  )
}

function broadenValues (key, altToBool, alt) {
  return traverseOpts(and(hasBool, validValues(key)))(opt => {
    let errs   = []

    const {types, [key]: values} = opt

    const values2 = []

    for (let i = 0; i < values.length; i++) {
      const value = values[i]
      const type  = types[i]

      if (type === 'bool') {
        const bool = altToBool[value]
        if (bool === 'true' || bool === 'false') {
          values2.push(bool)
        } else {
          errs.push(invalidBoolMapping({key: value, alt}))
          values2.push(value)
        }
      } else {
        values2.push(value)
      }
    }

    return {errs, opts: [{...opt, [key]: values2}]}
  })
}

function hasBool ({types}) {
  return Array.isArray(types) && types.length > 0 && types.indexOf('bool') > -1
}

function validValues (key) {
  return ({types, [key]: values}) => Array.isArray(values) && values.length === types.length
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