const transformArgs = require('./transformArgs')

module.exports = ({errs = [], args = {_: []}} = {}) => (
  transformArgs({
    array: ({key, val, errs, args}) => ({
      errs,
      args: {...args, [key]: key === '_' ? [] : val}
    })
  })({errs, args})
)