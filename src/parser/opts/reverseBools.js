module.exports = ({errs = [], opts = []} = {}) => {
  const opts2 = []

  for (let i = 0; i < opts.length; i++) {
    const opt = opts[i]
    const {reverse, values} = opt

    if (reverse === true && isBool(opt) && hasValidValues(opt)) {
      const bool = values[0]
      let res    = bool
      if (bool === 'false')               res = 'true'
      else if (bool === 'true')           res = 'false'
      else if (typeof bool === 'boolean') res = !bool
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