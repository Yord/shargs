const traverseArgs = require('./traverseArgs')

module.exports = ({errs = [], args = {_: []}} = {}) => {
  return traverseArgs({
    array: ({key, val, errs, args}) => ({
      errs,
      args: {...args, [key]: val.map(cast)}
    }),
    string: ({key, val, errs, args}) => ({
      errs,
      args: {...args, [key]: cast(val)}
    })
  })({errs, args})
}

function cast (val) {
  let val2 = val

  if (typeof val !== 'undefined' && val !== null && val !== '') {
    const num = Number(val)
    if (Number.isNaN(num)) {
      if (val2 === 'true')       val2 = true
      else if (val2 === 'false') val2 = false
    } else {
      val2 = num
    }
  }

  return val2
}