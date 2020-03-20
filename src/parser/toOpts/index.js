const combine = require('../combinators/combine')
const option  = require('../combinators/option')

module.exports = (opts2 = []) => {
  const {args, errs: ERRS = []} = combine(...opts2.map(option))

  return ({errs = [], argv: ARGV = []} = {}) => {
    errs = errs.concat(ERRS)
    const opts = []

    let at  = 0
    let ARG = ARGV[at]

    while (ARG) {
      const options = args[ARG]

      let at2 = at + 1

      if (options) {
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
          } else {
            values = ARGV.slice(at + 1, at + types.length + 1)
          }

          opts.push({...option, values})

          at2 = at + (types === null ? 0 : types.length) + 1
        }
      } else {
        const values = ARGV.slice(at, at + 1)
        opts.push({values})
      }

      at  = at2
      ARG = ARGV[at]
    }

    return {errs, opts}
  }
}