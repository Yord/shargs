const fromArgs = ({errs = [], args = [{_: []}]} = {errs: [], args: [{_: []}]}) => ({
  errs,
  args: merge(args)
})

module.exports = {
  fromArgs
}

function merge (args) {
  let args2 = {}

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]

    for (let [key, value] of Object.entries(arg)) {
      if (key === '_' && Array.isArray(value)) {
        args2[key] = [...(args2[key] || []), ...value]
      } else if (typeof args2[key] === 'undefined') {
        args2[key] = value
      }
    }
  }

  return args2
}