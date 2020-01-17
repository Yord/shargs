const {anything, array, assert, base64, property} = require('fast-check')
const option = require('./option')

test('option transforms options DSL into arguments DSL', () => {
  const optionsArguments = base64().chain(arg =>
    array(base64(), 1, 20).chain(args =>
      anything().chain(types =>
        anything().chain(only =>
          anything().chain(desc =>
            anything().map(opts => {
              const options = {
                arg,
                types: typeof types !== 'undefined' ? types : null,
                only:  typeof only  !== 'undefined' ? only  : null,
                desc:  typeof desc  !== 'undefined' ? desc  : '',
                opts:  typeof opts  !== 'undefined' ? opts  : null
              }
              return {
                options: {...options, args},
                _arguments: {
                  errs: [],
                  args: args.reduce((obj, key) => ({...obj, [key]: options}), {})
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

test('option fails if no arg is given', () => {
  const optionsArguments = array(base64(), 1, 20).chain(args =>
    anything().chain(types =>
      anything().chain(only =>
        anything().chain(desc =>
          anything().map(opts => {
            const options = {
              types: typeof types !== 'undefined' ? types : null,
              only:  typeof only  !== 'undefined' ? only  : null,
              desc:  typeof desc  !== 'undefined' ? desc  : '',
              opts:  typeof opts  !== 'undefined' ? opts  : null
            }
            return {
              options: {...options, args},
              _arguments: {
                errs: [{
                  code: 'No argument provided in option',
                  msg:  "Please provide an arg key (e.g. {arg: 'foo'})",
                  info: {options: {...options, args}}
                }],
                args: {}
              }
            }
          })
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
  const optionsArguments = base64().chain(arg =>
    anything().chain(types =>
      anything().chain(only =>
        anything().chain(desc =>
          anything().map(opts => {
            const options = {
              arg,
              types: typeof types !== 'undefined' ? types : null,
              only:  typeof only  !== 'undefined' ? only  : null,
              desc:  typeof desc  !== 'undefined' ? desc  : '',
              opts:  typeof opts  !== 'undefined' ? opts  : null
            }
            return {
              options,
              _arguments: {
                errs: [{
                  code: 'No arguments provided in option',
                  msg:  "Please provide at least one argument (e.g. {args: ['--foo']})",
                  info: {options}
                }],
                args: {}
              }
            }
          })
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
      {
        code: 'No argument provided in option',
        msg:  "Please provide an arg key (e.g. {arg: 'foo'})",
        info: {options: {}}
      },
      {
        code: 'No arguments provided in option',
        msg:  "Please provide at least one argument (e.g. {args: ['--foo']})",
        info: {options: {}}
      }
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