module.exports = (opt = {}) => {
  const {
    key = null,
    args: ARGS = []
  } = opt

  const errs = []
  const args = {}
  
  if (key !== null && ARGS !== null && ARGS.length > 0) {
    for (let i = 0; i < ARGS.length; i++) {
      const arg  = ARGS[i]
      if (typeof args[arg] === 'undefined') args[arg] = []

      const {__proto__: _2, ...rest} = opt
      args[arg].push(rest)
    }
  }

  return {errs, args}
}