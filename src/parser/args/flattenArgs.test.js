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

test('flattenArgs takes custom merge functions 1/2', () => {
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

  const mergeLeft  = (obj1, obj2) => ({...obj2, ...obj1})

  const {args} = flattenArgs(mergeLeft)(obj)

  const exp = {
    version: {type: 'flag', count: 2},
    name: 'Logan',
    help: true,
    verbose: true
  }

  expect(args).toStrictEqual(exp)
})