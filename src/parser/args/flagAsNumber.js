const transformArgs = require('./transformArgs')

module.exports = transformArgs({
  flag: ({key, val, errs, args}) => ({
    errs,
    args: {...args, [key]: val.count}
  })
})