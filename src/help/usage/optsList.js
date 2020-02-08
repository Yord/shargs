const table = require('../layout/table')

// Filter all commands
module.exports = (filter = ({types}) => typeof types !== 'undefined' && types !== null, id = undefined) => (
  (opts = []) => {
    const items = (
      opts
      .filter(filter)
      .map(opt => ({types} = opt, types !== null && types.length === 0 ? {...opt, types: ['flag']} : opt))
      .map(({args, desc, types}) => [args.join(', '), desc + (types === null ? '' : ' [' + types.join(', ') + ']')])
    )

    return table(items, id)
  }
)