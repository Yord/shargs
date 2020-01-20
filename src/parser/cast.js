module.exports = ({types}) => ({errs = [], argv = []} = {}) => {
  const errs2 = []
  const argv2 = []

  if (types !== null) {
    if (types.length === 0) {
      argv2.push(true)
    } else {
      for (let i = 0; i < types.length; i++) {

        const type = types[i]
        const arg  = argv[i]
        switch (type) {
          case 'count':
            argv2.push(1)
            break
          case 'string':
            argv2.push(arg)
            break
          case 'number':
            const float = parseFloat(arg)
            if (Number.isNaN(float)) {
              const argumentIsNotANumber = {
                code: 'Argument is not a number',
                msg:  'The passed command line argument must be a number',
                info: {arg}
              }
              errs2.push(argumentIsNotANumber)
            } else {
              argv2.push(float)
            }
            break
          case 'bool':
            if (arg === 'true')       argv2.push(true)
            else if (arg === 'false') argv2.push(false)
            else {
              const argumentIsNotABool = {
                code: 'Argument is not a boolean',
                msg:  "The passed command line argument must either be 'true' or 'false'",
                info: {arg}
              }
              errs2.push(argumentIsNotABool)
            }
            break
          default:
            break
        }
      }
    }
  }

  return {errs: errs.concat(errs2), argv: argv2}
}