const {array, assert, base64, constant, oneof, property} = require('fast-check')
const combine = require('./combine')

test('combine combines all options and appends options if they have the same argument', () => {
  const optionsCombined = array(option(), 2, 20).map(opts => {
    const combined = opts.reduce(
      (acc, {args}) => Object.keys(args).reduce(
        (acc2, key) => ({
          errs: [],
          args: {
            ...acc2.args,
            [key]: (
              acc2.args[key] ? [...acc2.args[key], ...args[key].map(arg => ({...arg, types: acc2.args[key][0].types}))]
                             : args[key]
            )
          }
        }),
        acc
      ),
      {errs: [], args: {}}
    )
    const options = Object.keys(combined.args).reduce(
      (acc, arg) => [
        ...acc,
        ...combined.args[arg].map(obj => ({
          errs: [],
          args: {[arg]: [obj]}
        }))
      ],
      []
    )
    return {combined, options}
  })

  assert(
    property(optionsCombined, ({options, combined}) =>
      expect(
        combine(...options)
      ).toStrictEqual(
        combined
      )
    )
  )
})

function option (hasArguments, _arguments) {
  return base64().chain(arg =>
    base64().chain(key =>
      types().map(types =>
        ({
          errs: [],
          args: {
            [arg]: hasArguments ? _arguments : [{key, types}]
          }
        })
      )
    )
  )
}

function types() {
  const oneElem = ['string', 'number', 'bool']
  const arr = array(oneof(...oneElem.map(constant)), 2, 10)
  return oneof(...[...oneElem.map(a => [a]), [], null].map(constant), arr)
}