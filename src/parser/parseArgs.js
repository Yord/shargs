module.exports = args => ({errs = [], argv = []} = {}) => {
  let errs2   = []
  const argv2 = []

  let at  = 0
  let arg = argv[at]

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
          let arg2 = argv[i] || '--'
          while (arg2 !== '--') {
            if (types === null) types = []
            types.push('string')
            values.push(arg2)
            i++
            arg2 = argv[i] || '--'
          }
        } else {
          values = argv.slice(at + 1, at + types.length + 1)
        }

        argv2.push({...option, values})

        newAt = at + (types === null ? 0 : types.length) + 1
      }
    } else {
      const values = argv.slice(at, at + 1)
      if (values.length > 0) argv2.push({values})
    }

    at  = newAt
    arg = argv[at]
  }

  return {errs: errs.concat(errs2), argv: argv2}
}