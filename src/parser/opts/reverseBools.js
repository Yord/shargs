module.exports = ({errs = [], opts = []} = {}) => {
  const opts2 = []

  for (let i = 0; i < opts.length; i++) {
    const opt = opts[i]
    const {reverse, values} = opt

    if (reverse === true && isBool(opt) && hasValidValues(opt)) {
      const val = values[0]
      let res   = val
      if (val === 'false')               res = 'true'
      else if (val === 'true')           res = 'false'
      else if (typeof val === 'boolean') res = !val
      opts2.push({...opt, values: [res]})
    } else {
      opts2.push(opt)
    }
  }

  return {errs, opts: opts2}
}

function isBool ({types}) {
  return Array.isArray(types) && types.length > 0 && types[0] === 'bool'
}

function hasValidValues ({values}) {
  return Array.isArray(values) && values.length === 1
}