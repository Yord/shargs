const {tableFrom} = require('../layout/table')

const optsListFrom = id => (opts = []) => {
  const items = (
    opts
    .map(opt => ({types} = opt, Array.isArray(types) && types.length === 0 ? {...opt, types: ['flag']} : opt))
    .map(({args = [], desc = '', types}) => [
      args.join(', '),
      desc + (types === null ? '' : ' [' + types.join(', ') + ']')
    ])
  )

  return tableFrom(id)(items)
}

const optsList = optsListFrom('cols')

module.exports = {
  optsList,
  optsListFrom
}