const {defsFrom} = require('../layout/defs')

const optsDefsFrom = id => (filter = () => true) => (opts = []) => {
  const items = (
    opts
    .filter(filter)
    .map(opt => ({types} = opt, Array.isArray(types) && types.length === 0 ? {...opt, types: ['flag']} : opt))
    .map(({args = [], desc = '', types}) => ({
      title: args.join(', ') + ' [' + types.join(', ') + ']',
      desc
    }))
  )

  return defsFrom(id)(items)
}

const optsDefs = optsDefsFrom('defs')

module.exports = {
  optsDefs,
  optsDefsFrom
}