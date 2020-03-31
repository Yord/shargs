const broadenBools = require('./broadenBools')
const {invalidBoolMapping} = require('../../errors')
const {array, bool, number} = require('../../options')

const numberBool = array(['number', 'bool'])

test('broadenBools README example works', () => {
  const obj = {
    opts: [
      {...number('answer', ['-a', '--answer']), values: ['42']},
      {...numberBool('numBool', ['-n', '--nb']), values: ['23', 'yes']},
      {...bool('verbose', ['--verbose']), values: ['no']},
      {...bool('verbose', ['--verbose']), values: ['false']}
    ]
  }

  const alt = {
    true: ['yes'],
    false: ['no', 'f']
  }

  const {opts} = broadenBools(alt)(obj)

  const exp = [
    {...number('answer', ['-a', '--answer']), values: ['42']},
    {...numberBool('numBool', ['-n', '--nb']), values: ['23', 'true']},
    {...bool('verbose', ['--verbose']), values: ['false']},
    {...bool('verbose', ['--verbose']), values: ['false']}
  ]

  expect(opts).toStrictEqual(exp)
})

test('broadenBools README example works for defaultValues', () => {
  const obj = {
    opts: [
      number('answer', ['-a', '--answer'], {defaultValues: ['42']}),
      numberBool('numBool', ['-n', '--nb'], {defaultValues: ['23', 'yes']}),
      bool('verbose', ['--verbose'], {defaultValues: ['no']}),
      bool('verbose', ['--verbose'], {defaultValues: ['f']})
    ]
  }

  const alt = {
    true: ['yes'],
    false: ['no', 'f']
  }

  const {opts} = broadenBools(alt)(obj)

  const exp = [
    number('answer', ['-a', '--answer'], {defaultValues: ['42']}),
    numberBool('numBool', ['-n', '--nb'], {defaultValues: ['23', 'true']}),
    bool('verbose', ['--verbose'], {defaultValues: ['false']}),
    bool('verbose', ['--verbose'], {defaultValues: ['false']})
  ]

  expect(opts).toStrictEqual(exp)
})

test('broadenBools README example works for both, values and defaultValues together', () => {
  const obj = {
    opts: [
      number('answer', ['-a', '--answer'], {defaultValues: ['42']}),
      {...numberBool('numBool', ['-n', '--nb'], {defaultValues: ['23', 'yes']}), values: ['42', 'no']},
      {...bool('verbose', ['--verbose'], {defaultValues: ['no']}), values: ['yes']},
      {...bool('verbose', ['--verbose'], {defaultValues: ['f']}), values: ['t']}
    ]
  }

  const alt = {
    true: ['yes', 't'],
    false: ['no', 'f']
  }

  const {opts} = broadenBools(alt)(obj)

  const exp = [
    number('answer', ['-a', '--answer'], {defaultValues: ['42']}),
    {...numberBool('numBool', ['-n', '--nb'], {defaultValues: ['23', 'true']}), values: ['42', 'false']},
    {...bool('verbose', ['--verbose'], {defaultValues: ['false']}), values: ['true']},
    {...bool('verbose', ['--verbose'], {defaultValues: ['false']}), values: ['true']}
  ]

  expect(opts).toStrictEqual(exp)
})

test('broadenBools reports error on unknown bool value', () => {
  const obj = {
    opts: [
      {...numberBool('numBool', ['-n', '--nb']), values: ['23', 't']},
      {...bool('verbose', ['--verbose']), values: ['no']},
      {...bool('verbose', ['--verbose']), values: ['f']}
    ]
  }

  const alt = {
    true: ['yes'],
    false: ['no', 'f']
  }

  const {errs, opts} = broadenBools(alt)(obj)

  const expOpts = [
    {...numberBool('numBool', ['-n', '--nb']), values: ['23', 't']},
    {...bool('verbose', ['--verbose']), values: ['false']},
    {...bool('verbose', ['--verbose']), values: ['false']}
  ]

  const expErrs = [
    invalidBoolMapping({key: 't', alt})
  ]

  expect(opts).toStrictEqual(expOpts)
  expect(errs).toStrictEqual(expErrs)
})

test('broadenBools reports error on unknown bool defaultValue', () => {
  const obj = {
    opts: [
      numberBool('numBool', ['-n', '--nb'], {defaultValues: ['23', 't']}),
      bool('verbose', ['--verbose'], {defaultValues: ['no']}),
      bool('verbose', ['--verbose'], {defaultValues: ['f']})
    ]
  }

  const alt = {
    true: ['yes'],
    false: ['no', 'f']
  }

  const {errs, opts} = broadenBools(alt)(obj)

  const expOpts = [
    numberBool('numBool', ['-n', '--nb'], {defaultValues: ['23', 't']}),
    bool('verbose', ['--verbose'], {defaultValues: ['false']}),
    bool('verbose', ['--verbose'], {defaultValues: ['false']})
  ]

  const expErrs = [
    invalidBoolMapping({key: 't', alt})
  ]

  expect(opts).toStrictEqual(expOpts)
  expect(errs).toStrictEqual(expErrs)
})

test('broadenBools reports error on broken alt object', () => {
  const obj = {
    opts: [
      {...numberBool('numBool', ['-n', '--nb']), values: ['23', 'yes']},
      {...bool('verbose', ['--verbose']), values: ['no']},
      {...bool('verbose', ['--verbose']), values: ['f']}
    ]
  }

  const alt = {
    true: 'yes',
    false: ['no', 'f']
  }

  const {errs, opts} = broadenBools(alt)(obj)

  const expOpts = [
    {...numberBool('numBool', ['-n', '--nb']), values: ['23', 'yes']},
    {...bool('verbose', ['--verbose']), values: ['false']},
    {...bool('verbose', ['--verbose']), values: ['false']}
  ]

  const expErrs = [
    invalidBoolMapping({key: 'yes', alt})
  ]

  expect(opts).toStrictEqual(expOpts)
  expect(errs).toStrictEqual(expErrs)
})