module.exports = (p = arg => false) => (f = (arg, index, argv) => ({})) => ({errs = [], argv = []} = {}) => {
  let errs2 = []
  let argv2 = []

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]

    const {errs: errs3 = [], argv: argv3 = [arg]} = p(arg) ? f(arg, i, argv) : {errs: [], argv: [arg]}

    errs2 = errs2.concat(errs3)
    argv2 = argv2.concat(argv3)
  }

  return {errs: errs.concat(errs2), argv: argv2}
}