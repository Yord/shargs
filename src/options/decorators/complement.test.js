const complement = require('./complement')
const {bool, flag, string} = require('..')

test('complement README example works', () => {
  const birthday = string('birthday', ['-b'])
  const tired    = bool('tired', ['-t', '--tired'], {defaultValues: ['true']})
  const notTired = bool('tired', ['--not-t', '--not-tired'], {reverse: true})
  const luck     = flag('luck', ['--luck'], {reverse: true})
  const noLuck   = flag('luck', ['--no-luck'], {reverse: false})

  const opts = [
    birthday,
    complement('--not-')(tired),
    tired,
    complement()(luck),
    luck
  ]

  const exp = [
    birthday,
    notTired,
    tired,
    noLuck,
    luck
  ]

  expect(opts).toStrictEqual(exp)
})

test('complement works if opts is undefined', () => {
  const opt = complement()()

  const exp = {reverse: true, args: []}

  expect(opt).toStrictEqual(exp)
})