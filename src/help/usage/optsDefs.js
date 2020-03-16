const {defsFrom} = require('../layout/defs')

const optsDefsFrom = (id1, id2) => (opts = []) => (
  defsFrom(id1, id2)(
    opts
    .map(({args = [], desc = '', types = null} = {}) => [
      args.join(', ') + typesLabel(types),
      desc
    ])
  )
)

const optsDefs = optsDefsFrom('line', 'desc')

module.exports = {
  optsDefs,
  optsDefsFrom
}

function typesLabel (types) {
  return (
    types === null     ? '' :
    types.length === 0 ? ' [flag]'
                       : ' [' + types.join(', ') + ']'
  )
}