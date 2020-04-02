module.exports = ({errs = [], opts = []} = {}) => {
  const errs2 = []
  const opts2 = []

  const keysIndex = {}

  for (let i = 0; i < opts.length; i++) {
    const opt = opts[i]
    
    if (hasValues(opt) && isArray(opt)) {
      const {key, types, values} = opt

      if (typeof keysIndex[key] === 'undefined') {
        keysIndex[key] = i
        opts2.push(opt)
      } else {
        const prev = opts2[keysIndex[key]]

        opts2[keysIndex[key]] = {
          ...prev,
          types: [...prev.types, ...types],
          values: [...prev.values, ...values]
        }
      }
    } else {
      opts2.push(opt)
    }
  }

  return {errs: errs.concat(errs2), opts: opts2}
}

function hasValues ({values}) {
  return Array.isArray(values) && values.length > 0
}

function isArray ({types}) {
  return Array.isArray(types) && types.length > 0
}