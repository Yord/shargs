module.exports = args => ({errs: ERRS = [], argv: ARGV = []} = {}) => {
  let errs   = []
  const opts = []

  let at  = 0
  let arg = ARGV[at]

  while (arg) {
    const options = args[arg]

    let newAt = at + 1

    if (options) {
      for (let j = 0; j < options.length; j++) {
        const option = options[j]

        let {types} = option
        let values  = []
        if (typeof types === 'undefined' || types === null) {
          let i = at + 1
          let arg2 = ARGV[i] || '--'
          while (arg2 !== '--') {
            if (types === null) types = []
            types.push('string')
            values.push(arg2)
            i++
            arg2 = ARGV[i] || '--'
          }
        } else {
          values = ARGV.slice(at + 1, at + types.length + 1)
        }

        opts.push({...option, values})

        newAt = at + (types === null ? 0 : types.length) + 1
      }
    } else {
      const values = ARGV.slice(at, at + 1)
      if (values.length > 0) opts.push({values})
    }

    at  = newAt
    arg = ARGV[at]
  }

  return {errs: ERRS.concat(errs), opts}
}