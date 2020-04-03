module.exports = (p = opt => false) => (f = (opt, index, opts) => ({})) => ({errs = [], opts = []} = {}) => {
  let errs2 = []
  let opts2 = []

  for (let i = 0; i < opts.length; i++) {
    const opt = opts[i]
    const {errs: errs3 = [], opts: opts3 = [opt]} = p(opt) ? f(opt, i, opts) : {errs: [], opts: [opt]}

    errs2 = errs2.concat(errs3)
    opts2 = opts2.concat(opts3)
  }

  return {errs: errs.concat(errs2), opts: opts2}
}