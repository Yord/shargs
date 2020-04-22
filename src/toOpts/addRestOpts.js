module.exports = (opts = []) => ({errs = [], opts: opts2 = []} = {}) => {
  const errs2 = []
  const opts3 = opts2

  for (let i = 0; i < opts.length; i++) {
    const opt = opts[i]

    if (!optsContainsOpt(opt, opts2)) {
      opts3.push(opt)
    }
  }

  return {errs: errs.concat(errs2), opts: opts3}
}

function optsContainsOpt (opt, opts) {
  return opts.find(opt2 => opt2.key === opt.key)
}