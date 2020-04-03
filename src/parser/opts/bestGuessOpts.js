const {flag, string} = require('../../options')

module.exports = ({errs = [], opts = []} = {}) => {
  const errs2 = []
  const opts2 = []

  let at  = 0
  let opt = opts[at]

  while (opt) {
    if (isRest(opt) && isOption(opt)) {
      const key = opt.values[0].slice(isShortOption(opt) ? 1 : 2)

      if (keyIsNotDefined(key, opts)) {
        const opt2 = opts[at + 1]

        if (opt2 && isRest(opt2)) {
          if (isString(opt2)) {
            const str = {...string(key, []), values: opt2.values}
            opts2.push(str)
            at += 1
          } else {
            const flg = {...flag(key, []), values: [1]}
            opts2.push(flg)
          }
        } else {
          const flg = {...flag(key, []), values: [1]}
          opts2.push(flg)
        }
      } else opts2.push(opt)
    } else opts2.push(opt)

    at += 1
    opt = opts[at]
  }

  return {errs: errs.concat(errs2), opts: opts2}
}

function keyIsNotDefined (key2, opts) {
  return !opts.some(({key}) => key === key2)
}

function isRest ({key, values}) {
  return typeof key === 'undefined' && Array.isArray(values) && values.length === 1 && typeof values[0] === 'string'
}

function isOption (opt) {
  return isLongOption(opt) || isShortOption(opt)
}

function isShortOption ({values: [arg]}) {
  return arg.length === 2 && arg[0] === '-' && arg[1] !== '-'
}

function isLongOption ({values: [arg]}) {
  return arg.length > 2 && arg[0] === '-' && arg[1] === '-' && arg[2] !== '-'
}

function isString ({values: [arg]}) {
  return typeof arg === 'string' && arg.length > 0 && arg[0] !== '-'
}