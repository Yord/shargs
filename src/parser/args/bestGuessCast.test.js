const bestGuessCast = require('./bestGuessCast')

test('bestGuessCast README example works', () => {
  const obj = {
    args: {
      _: ['--name', 'Logan'],
      str1: 'yay',
      num1: '42.3',
      num2: '123e-1',
      num3: '0x11',
      num4: '0b11',
      bool1: 'true',
      arr1: ['-42', 'true', 'yay'],
      obj: {
        num5: '0o11',
        num6: '-Infinity',
        num7: '',
        num8: null,
        bool2: 'false',
        bool3: undefined
      }
    }
  }

  const {args} = bestGuessCast(obj)

  const exp = {
    _: ['--name', 'Logan'],
    str1: 'yay',
    num1: 42.3,
    num2: 12.3,
    num3: 17,
    num4: 3,
    bool1: true,
    arr1: [-42, true, 'yay'],
    obj: {
      num5: 9,
      num6: -Infinity,
      num7: '',
      num8: null,
      bool2: false,
      bool3: undefined
    }
  }

  expect(args).toStrictEqual(exp)
})

test('bestGuessCast even empties rest if args is undefined', () => {
  const obj = {}

  const {args} = bestGuessCast(obj)

  expect(args._).toStrictEqual([])
})

test('bestGuessCast even empties rest if input is undefined', () => {
  const {args} = bestGuessCast()

  expect(args._).toStrictEqual([])
})

test('bestGuessCast passes on errors', () => {
  const ERRS = ['foo']

  const {errs} = bestGuessCast({errs: ERRS})

  expect(errs).toStrictEqual(ERRS)
})