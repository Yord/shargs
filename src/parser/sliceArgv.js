module.exports = ({errs = [], argv = []} = {}) => {
  const errs2 = []
  let argv2   = []

  const minLength = 2

  if (argv.length < minLength) {
    const tooFewArguments = {
      code: 'Too few arguments',
      msg:  `The passed command line arguments must have at least ${minLength} items`,
      info: {argv}
    }
    errs2.push(tooFewArguments)
  } else {
    argv2 = argv.slice(2)
  }

  return {errs: errs.concat(errs2), argv: argv2}
}