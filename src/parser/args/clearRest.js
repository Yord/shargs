const traverseArgs = require('./traverseArgs')

module.exports = ({errs = [], args = {_: []}} = {}) => (
  traverseArgs({
    array: ({key, val, errs, args}) => ({
      errs,
      args: {...args, [key]: key === '_' ? [] : val}
    })
  })({errs, args})
)