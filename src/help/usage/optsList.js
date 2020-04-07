const optsF       = require('./combinators/optsF')
const {tableFrom} = require('../layout/table')

const optsListFrom = (id = 'cols') => optsF(
  (defArgs, descOpt, opts) => tableFrom(id)(
    flatMap(opt => {
      const {key, desc = ''} = opt
      if (typeof key === 'undefined') return []
      else return [[
        defArgs(opt),
        desc + descOpt(opt)
      ]]
    })(opts)
  )
)

const optsList = optsListFrom('cols')

module.exports = {
  optsList,
  optsListFrom
}

function flatMap (f) {
  return arr => arr.reduce((acc, val) => [...acc, ...f(val)], [])
}