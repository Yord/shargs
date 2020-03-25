const flattenArgs = require('./flattenArgs')

test('flattenArgs README example works', () => {
  const obj = {
    args: {
      version: {type: 'flag', count: 2},
      name: 'Logan',
      command: {
        version: {type: 'flag', count: 1},
        name: 'Charles',
        help: true
      },
      verbose: true
    }
  }

  const {args} = flattenArgs()(obj)

  const exp = {
    version: {type: 'flag', count: 2},
    name: 'Logan',
    help: true,
    verbose: true
  }

  expect(args).toStrictEqual(exp)
})