const {flagIsNotACount} = require('../../errors')

const isFlag  = ({types}) => Array.isArray(types) && types.length === 0
const isCount = ({values}) => typeof values === 'object' && typeof values.count !== 'undefined'

module.exports = ({errs = [], opts = []} = {}) => {
  const errs2 = []
  const opts2 = []

  for (let i = 0; i < opts.length; i++) {
    const opt = opts[i]

    if (isFlag(opt)) {
      if (isCount(opt)) {
        opts2.push({...opt, values: [opt.values.count > 0]})
      } else {
        const {key, types} = opt
        errs2.push(flagIsNotACount({key, types, option: opt}))
      }
    } else {
      opts2.push(opt)
    }
  }

  return {errs: errs.concat(errs2), opts: opts2}
}