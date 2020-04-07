const traverseOpts = require('./traverseOpts')
const {argumentIsNotABool, argumentIsNotANumber} = require('../errors')
const pipe = require('../combinators/pipe')
const and  = require('../combinators/and')

module.exports = pipe(
  cast('values'),
  cast('defaultValues')
)

function cast (key) {
  return traverseOpts(and(hasValues(key), hasTypes, isNotCommand, isNotFlag))(castKey(key))
}

function castKey (key) {
  return opt => {
    const errs  = []
    const opts = []
  
    const {[key]: values, types} = opt
  
    let values2 = []
  
    for (let j = 0; j < types.length; j++) {
      const type  = types[j]
      const value = values[j]
      switch (type) {
        case 'string':
          values2.push(value)
          break
        case 'number':
          const float = parseFloat(value)
          if (!Number.isNaN(float)) values2.push(float)
          else errs.push(argumentIsNotANumber({[key]: values, index: j, option: opt}))
          break
        case 'bool':
          if (value === 'true' || value === true)        values2.push(true)
          else if (value === 'false' || value === false) values2.push(false)
          else errs.push(argumentIsNotABool({[key]: values, index: j, option: opt}))
          break
        default:
          values2.push(value)
          break
      }
    }
    opts.push({...opt, ...(values2.length === 0 ? {} : {[key]: values2})})
  
    return {errs, opts}
  }
}

function hasTypes ({types}) {
  return typeof types !== 'undefined'
}

function isNotCommand ({types}) {
  return types !== null
}

function isNotFlag ({types}) {
  return !(Array.isArray(types) && types.length === 0)
}

function hasValues (key) {
  return ({[key]: values}) => values !== null && typeof values !== 'undefined'
}