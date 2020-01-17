const cast     = require('./cast')
const validate = require('./validate')

module.exports = ({args = {}} = {}) => ({errs = [], argv = []} = {}) => {
  let errs2   = []
  const argv2 = []

  let at  = 0
  let arg = argv[at]

  while (arg) {
    const option = args[arg]
    if (option) {
      const {arg, only, opts} = option
      let   {types} = option

      let arr = []
      if (typeof types === 'undefined' || types === null) {
        let i = at + 1
        let arg2 = argv[i] || '--'
        while (arg2 !== '--') {
          if (types === null) types = []
          types.push('string')
          arr.push(arg2)
          i++
          arg2 = argv[i] || '--'
        }
      } else {
        arr = argv.slice(at + 1, at + types.length + 1)
      }

      let res = cast(types)({errs, argv: arr})
      res     = validate(only)(res)

      errs2 = errs2.concat(res.errs)
      argv2.push([arg, res.argv, option.types, opts])

      at += (types === null ? 0 : types.length) + 1
    } else {
      const arr = argv.slice(at, at + 1)
      if (arr.length > 0) argv2.push(arr)
      at++
    }

    arg = argv[at]
  }

  return {errs: errs.concat(errs2), argv: argv2}
}