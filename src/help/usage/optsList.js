const {tableFrom} = require('../layout/table')

module.exports = (filter = () => true, id = 'cols') => (
  (opts = []) => {
    const items = (
      opts
      .filter(filter)
      .map(opt => ({types} = opt, Array.isArray(types) && types.length === 0 ? {...opt, types: ['flag']} : opt))
      .map(({args = [], desc = '', types}) => [
        args.join(', '),
        desc + (types === null ? '' : ' [' + types.join(', ') + ']')
      ])
    )

    return tableFrom(id)(items)
  }
)