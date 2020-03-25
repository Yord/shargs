const combine       = require('./combine')
const option        = require('./option')
const addUnusedOpts = require('./addUnusedOpts')

module.exports = (opts = []) => {
  const {args, errs: ERRS} = combine(...opts.map(option))

  return ({errs = [], argv: ARGV = []} = {}) => {
    errs = errs.concat(ERRS)
    const opts2 = []

    let at  = 0
    let ARG = ARGV[at]

    while (ARG) {
      const options = args[ARG]

      let at2 = at + 1

      if (Array.isArray(options)) {
        for (let j = 0; j < options.length; j++) {
          const option = options[j]

          let {types} = option
          let values  = []
          if (typeof types === 'undefined' || types === null) {
            let i = at + 1
            let arg = ARGV[i] || '--'
            while (arg !== '--') {
              if (types === null) types = []
              types.push('string')
              values.push(arg)
              i++
              arg = ARGV[i] || '--'
            }
          } else if (Array.isArray(types) && types.length === 0) {
            values = [1]
          } else {
            values = ARGV.slice(at + 1, at + types.length + 1)
          }

          opts2.push({...option, values})

          at2 = at + (types === null ? 0 : types.length) + 1
        }
      } else {
        const values = ARGV.slice(at, at + 1)
        opts2.push({values})
      }

      at  = at2
      ARG = ARGV[at]
    }

    const {errs: errs2, opts: opts3} = addUnusedOpts(opts)({opts: opts2})

    return {errs: errs.concat(errs2), opts: opts3}
  }
}