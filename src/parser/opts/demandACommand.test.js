const demandACommand = require('./demandACommand')
const {commandRequired} = require('../../errors')
const {array, bool, command, flag, number, string} = require('../../options')

const numberBool = array(['number', 'bool'])

test('demandACommand README example works', () => {
  const opts = [
    string('title', ['--title'], {values: ["The Hitchhiker's Guide to the Galaxy"]}),
    numberBool('numBool', ['-n', '--nb'], {values: ['23', 'true']}),
    number('answer', ['-a', '--answer'], {values: ['42']}),
    bool('verbose', ['--verbose'], {values: ['false']}),
    flag('version', ['--version'], {values: [1]})
  ]

  const {errs} = demandACommand({opts})

  const exp = [
    commandRequired({options: opts})
  ]

  expect(errs).toStrictEqual(exp)
})

test('demandACommand records no error if a command is defined', () => {
  const opts = [
    string('title', ['--title'], {values: ["The Hitchhiker's Guide to the Galaxy"]}),
    numberBool('numBool', ['-n', '--nb'], {values: ['23', 'true']}),
    number('answer', ['-a', '--answer'], {values: ['42']}),
    command('help', ['-h', '--help'], {values: ['foo', '--bar']}),
    bool('verbose', ['--verbose'], {values: ['false']}),
    flag('version', ['--version'], {values: [1]})
  ]

  const {errs} = demandACommand({opts})

  const exp = []

  expect(errs).toStrictEqual(exp)
})

test('demandACommand records no error if two commands are defined', () => {
  const opts = [
    command('help', ['-h', '--help'], {values: ['foo', '--bar']}),
    command('verbose', ['--verbose'], {values: ['false']})
  ]

  const {errs} = demandACommand({opts})

  const exp = []

  expect(errs).toStrictEqual(exp)
})