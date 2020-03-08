const {defsFrom} = require('../layout/defs')

const optsDefsFrom = (id1, id2) => (opts = []) => {
  const items = (
    opts
    .map(opt => ({types} = opt, Array.isArray(types) && types.length === 0 ? {...opt, types: ['flag']} : opt))
    .map(({args = [], desc = '', types}) => [
      args.join(', ') + (types === null ? '' : ' [' + types.join(', ') + ']'),
      desc
    ])
  )

  return defsFrom(id1, id2)(items)
}

const optsDefs = optsDefsFrom('line', 'desc')

module.exports = {
  optsDefs,
  optsDefsFrom
}