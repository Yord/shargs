module.exports = ({errs = [], opts = []} = {}) => {
  const opts2 = []

  for (let i = 0; i < opts.length; i++) {
    const opt = opts[i]

    if (opt.reverse === true && isBool(opt) && hasValidValues(opt)) {
      opts2.push({...opt, values: [!opt.values[0]]})
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