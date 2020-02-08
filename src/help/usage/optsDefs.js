const defs = require('../layout/defs')

module.exports = (filter = ({types}) => typeof types !== 'undefined' && types !== null, id = undefined) => (
  (opts = []) => {
    const items = (
      opts
      .filter(filter)
      .map(opt => ({types} = opt, types !== null && types.length === 0 ? {...opt, types: ['flag']} : opt))
      .map(({args, desc, types}) => ({
        title: args.join(', ') + ' [' + types.join(', ') + ']',
        desc
      }))
    )

    return defs(items, id)
  }
)