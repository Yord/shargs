const traverseArgs = require('./traverseArgs')

const fs = merge => ({
  object: ({key, val, errs, args}) => {
    const {errs: errs2, args: args2} = traverseArgs(fs)({args: val})
    const {[key]: _, ...rest} = args

    return {
      errs: errs.concat(errs2),
      args: merge(rest, args2)
    }
  }
})

module.exports = (merge = mergeLeft) => traverseArgs(fs(merge))

function mergeLeft (obj1, obj2) {
  return {...obj2, ...obj1, _: [...(obj1._ || []), ...(obj2._ || [])]}
}