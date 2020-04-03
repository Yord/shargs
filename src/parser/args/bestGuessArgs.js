const traverseArgs = require('./traverseArgs')

module.exports = ({errs = [], args = {_: []}} = {}) => (
  traverseArgs({
    array: ({key, val: argv, errs, args}) => {
      const errs2 = []
      const args2 = {}

      if (key === '_') {
        const _ = []

        let at  = 0
        let arg = argv[at]

        while (arg) {
          if (isOption(arg)) {
            const key = arg.slice(isShortOption(arg) ? 1 : 2)

            if (typeof args[key] === 'undefined') {
              if (isString(argv[at + 1])) {
                args2[key] = argv[at + 1]
                at += 1
              } else {
                args2[key] = {type: 'flag', count: isFlag(args2[key]) ? args2[key].count + 1 : 1}
              }
            } else _.push(arg)
          } else _.push(arg)

          at += 1

          arg = argv[at]
        }

        args2['_'] = _
      }

      return {errs: errs.concat(errs2), args: {...args, ...args2}}
    }
  })({errs, args})
)

function isOption (arg) {
  return isLongOption(arg) || isShortOption(arg)
}

function isShortOption (arg) {
  return arg.length === 2 && arg[0] === '-' && arg[1] !== '-'
}

function isLongOption (arg) {
  return arg.length > 2 && arg[0] === '-' && arg[1] === '-' && arg[2] !== '-'
}

function isString (arg) {
  return typeof arg === 'string' && arg.length > 0 && arg[0] !== '-'
}

function isFlag ({type, count} = {}) {
  return type === 'flag' && typeof count === 'number'
}