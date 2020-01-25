module.exports = ({errs = [], argv = []} = {}) => {
  const errs2 = []
  const argv2 = []

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg.length > 2 && arg[0] === '-' && arg[1] !== '-') {
      for (let at = 1; at < arg.length; at++) {
        const ch = arg[at]
        argv2.push('-' + ch)
      }
    } else {
      argv2.push(arg)
    }
  }

  return {errs: errs.concat(errs2), argv: argv2}
}