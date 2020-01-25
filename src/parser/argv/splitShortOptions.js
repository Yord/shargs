module.exports = ({errs = [], argv: ARGV = []} = {}) => {
  const argv = []

  for (let i = 0; i < ARGV.length; i++) {
    const arg = ARGV[i]
    if (arg.length > 2 && arg[0] === '-' && arg[1] !== '-') {
      for (let at = 1; at < arg.length; at++) {
        const ch = arg[at]
        argv.push('-' + ch)
      }
    } else {
      argv.push(arg)
    }
  }

  return {errs, argv}
}