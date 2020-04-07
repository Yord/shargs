const optsF      = require('./combinators/optsF')
const {defsFrom} = require('../layout/defs')

const optsDefsFrom = (id1 = 'line', id2 = 'desc') => optsF(
  (defArgs, descOpts, opts) => defsFrom(id1, id2)(
    flatMap(opt => {
      const {key, desc = ''} = opt
      if (typeof key === 'undefined') return []
      else return [[
        defArgs(opt) + descOpts(opt),
        desc
      ]]
    })(opts)
  )
)

const optsDefs = optsDefsFrom('line', 'desc')

module.exports = {
  optsDefs,
  optsDefsFrom
}

function flatMap (f) {
  return arr => arr.reduce((acc, val) => [...acc, ...f(val)], [])
}