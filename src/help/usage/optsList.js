const {tableFrom} = require('../layout/table')

const optsListFrom = id => (opts = []) => (
  tableFrom(id)(
    opts
    .map(({args = [], desc = '', types = null} = {}) => [
      args.join(', '),
      desc + (desc === '' ? '' : ' ') + typesLabel(types)
    ])
  )
)

const optsList = optsListFrom('cols')

module.exports = {
  optsList,
  optsListFrom
}

function typesLabel (types) {
  return (
    types === null     ? '' :
    types.length === 0 ? '[flag]'
                       : '[' + types.join(', ') + ']'
  )
}