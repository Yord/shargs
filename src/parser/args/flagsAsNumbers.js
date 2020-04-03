const traverseArgs = require('./traverseArgs')

module.exports = traverseArgs({
  flag: ({key, val, errs, args}) => ({
    errs,
    args: {...args, [key]: val.count}
  })
})