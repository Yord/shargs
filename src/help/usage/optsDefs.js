const defs = require('../layout/defs')

module.exports = (filter = () => true, id = undefined) => (
  (opts = []) => {
    const items = (
      opts
      .filter(filter)
      .map(opt => ({types} = opt, Array.isArray(types) && types.length === 0 ? {...opt, types: ['flag']} : opt))
      .map(({args = [], desc = '', types}) => ({
        title: args.join(', ') + ' [' + types.join(', ') + ']',
        desc
      }))
    )

    return defs(items, id)
  }
)