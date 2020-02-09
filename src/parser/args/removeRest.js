module.exports = ({errs = [], args: ARGS = []} = {}) => {
  const args = {}

  const keys = Object.keys(ARGS)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (key !== '_') args[key] = ARGS[key]
  }

  return {errs, args}
}