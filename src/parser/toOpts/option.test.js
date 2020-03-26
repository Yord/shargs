const {anything, array, assert, base64, property} = require('fast-check')
const option = require('./option')
const {array: arrayType} = require('../../options')
const {noArgumentsProvidedInOption, noKeyProvidedInOption} = require('../../errors')

test('option transforms arguments DSL into options DSL', () => {
  const optionsArguments = base64().chain(key =>
    array(base64(), 1, 20).chain(args =>
      anything().chain(types =>
        anything().chain(desc =>
          anything().chain(only =>
            anything().chain(opts =>
              anything().map(values => {
                const options = {
                  key,
                  types:  typeof types  !== 'undefined' ? types  : null,
                  args:   typeof args   !== 'undefined' ? args   : null,
                  only:   typeof only   !== 'undefined' ? only   : null,
                  desc:   typeof desc   !== 'undefined' ? desc   : '',
                  opts:   typeof opts   !== 'undefined' ? opts   : null,
                  values: typeof values !== 'undefined' ? values : null
                }
                return {
                  options: {...options, args},
                  _arguments: {
                    errs: [],
                    args: args.reduce(
                      (obj, arg) => ({
                        ...obj,
                        [arg]: obj[arg] ? obj[arg].concat([options]) : [options]
                      }),
                      {}
                    )
                  }
                }
              })
            )
          )
        )
      )
    )
  )

  assert(
    property(optionsArguments, ({options, _arguments}) => {
      expect(
        option(options)
      ).toStrictEqual(
        _arguments
      )
    })
  )
})

test('option fails if no key is given', () => {
  const optionsArguments = array(base64(), 1, 20).chain(args =>
    anything().chain(types =>
      anything().chain(desc =>
        anything().chain(only =>
          anything().chain(opts =>
            anything().map(values => {
              const options = {
                types:  typeof types  !== 'undefined' ? types  : null,
                only:   typeof only   !== 'undefined' ? only   : null,
                desc:   typeof desc   !== 'undefined' ? desc   : '',
                opts:   typeof opts   !== 'undefined' ? opts   : null,
                values: typeof values !== 'undefined' ? values : null
              }
              return {
                options: {...options, args},
                _arguments: {
                  errs: [
                    noKeyProvidedInOption({option: {...options, args}})
                  ],
                  args: {}
                }
              }
            })
          )
        )
      )
    )
  )

  assert(
    property(optionsArguments, ({options, _arguments}) => {
      expect(
        option(options)
      ).toStrictEqual(
        _arguments
      )
    })
  )
})

test('option fails if no args are given', () => {
  const optionsArguments = base64().chain(key =>
    anything().chain(types =>
      anything().chain(desc =>
        anything().chain(only =>
          anything().chain(opts =>
            anything().map(values => {
              const options = {
                key,
                types:  typeof types  !== 'undefined' ? types  : null,
                only:   typeof only   !== 'undefined' ? only   : null,
                desc:   typeof desc   !== 'undefined' ? desc   : '',
                opts:   typeof opts   !== 'undefined' ? opts   : null,
                values: typeof values !== 'undefined' ? values : null
              }
              return {
                options,
                _arguments: {
                  errs: [
                    noArgumentsProvidedInOption({option: options})
                  ],
                  args: {}
                }
              }
            })
          )
        )
      )
    )
  )

  assert(
    property(optionsArguments, ({options, _arguments}) => {
      expect(
        option(options)
      ).toStrictEqual(
        _arguments
      )
    })
  )
})

test('option fails if passed undefined', () => {
  const _arguments = {
    errs: [
      noKeyProvidedInOption({option: {}}),
      noArgumentsProvidedInOption({option: {}})
    ],
    args: {}
  }

  expect(
    option()
  ).toStrictEqual(
    _arguments
  )

  expect(
    option(undefined)
  ).toStrictEqual(
    _arguments
  )
})

test('option removes args and __proto__ fields', () => {
  const answer = arrayType(['number'])('answer', ['-a'], {foo: 'bar', baz: 42, __proto__: 42})

  const {args} = option(answer)

  const exp = {
    '-a': [
      {
        key: 'answer',
        types: ['number'],
        args: ['-a'],
        foo: 'bar',
        baz: 42
      }
    ]
  }

  expect(args).toStrictEqual(exp)
})