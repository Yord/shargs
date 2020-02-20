const {anything, array, assert, base64, constant, integer, oneof, property} = require('fast-check')
const combine = require('./combine')
const {invalidOptionsListInCombine, invalidTypesInArgument} = require('../errors')

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

test("combine fails with an error if an argument's list is null, undefined or empty", () => {
  const optionResult = integer(1, 20).chain(len =>
    array(
      oneof(...[null, undefined, []].map(constant)).chain(list =>
        base64().chain(arg =>
          option(arg, true, list).map(option => ({option, arg, list}))
        )
      ),
      1,
      len
    ).map(options =>
      ({
        options: options.map(info => info.option),
        results: {
          args: {},
          errs: options.map(invalidOptionsListInCombine)
        }
      })
    )
  )

  assert(
    property(optionResult, ({options, results}) =>
      expect(
        combine(...options)
      ).toStrictEqual(
        results
      )
    )
  )
})

test("combine fails with an error if an argument has a types key that is not null or an array", () => {
  const optionResult = (
    array(
      anything()
      .filter(a => a !== null && !Array.isArray(a))
      .chain(types =>
        option(undefined, false, undefined, true, types)
        .map(option => ({option, types}))
      ),
      1,
      10
    )
    .map(os =>
      ({
        options: os.map(o => o.option),
        result: {
          args: {},
          errs: os.map(o =>
            invalidTypesInArgument({types: o.types, argument: Object.values(o.option.args)[0][0]})
          )
        }
      })
    )
  )

  assert(
    property(optionResult, ({options, result}) =>
      expect(
        combine(...options)
      ).toStrictEqual(
        result
      )
    )
  )
})

test("combine passes on errors", () => {
  const optionsResult = (
    array(
      array(anything(), 1, 5).map(a => ({args: {}, errs: a})),
      1,
      10
    )
    .map(options => ({
      options,
      result: options.reduce(
        ({args, errs}, option) => ({args, errs: [...errs, ...option.errs]}),
        {args: {}, errs: []}
      )
    }))
  )

  assert(
    property(optionsResult, ({options, result}) =>
      expect(
        combine(...options)
      ).toStrictEqual(
        result
      )
    )
  )
})

function option (_arg, hasArguments, _arguments, hasTypes, _types) {
  return base64().chain(arg =>
    base64().chain(key =>
      types().map(types =>
        ({
          errs: [],
          args: {
            [_arg || arg]: hasArguments ? _arguments : [{key, types: hasTypes ? _types : types}]
          }
        })
      )
    )
  )
}

function types () {
  const oneElem = ['string', 'number', 'bool']
  const arr = array(oneof(...oneElem.map(constant)), 2, 10)
  return oneof(...[...oneElem.map(a => [a]), [], null].map(constant), arr)
}