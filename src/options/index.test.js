const {anything, array: arbArray, assert, base64, constant, oneof, property, unicodeString} = require('fast-check')
const {array} = require('.')

test('options types are correctly assembled', () => {
  const typesKeyArgsOptionsResult = types().chain(types =>
    base64().chain(key =>
      anything().filter(a => typeof a !== 'undefined').chain(args =>
        oneof(constant(undefined), unicodeString()).chain(desc =>
          oneof(constant(undefined), anything()).chain(rules =>
            oneof(constant(undefined), anything()).chain(only =>
              oneof(constant(undefined), anything()).chain(opts =>
                oneof(constant(false), constant(true)).chain(required =>
                  oneof(constant(false), constant(true)).chain(reverse =>
                    oneof(constant(undefined), anything()).chain(defaultValues =>
                      oneof(constant(undefined), constant({desc, rules, only, opts, required, reverse, defaultValues})).map(options =>
                        ({
                          types,
                          key,
                          args,
                          options,
                          result: {
                            key,
                            types,
                            args,
                            ...(typeof options !== 'undefined' ? {desc}          : {}),
                            ...(typeof options !== 'undefined' ? {only}          : {}),
                            ...(typeof options !== 'undefined' ? {opts}          : {}),
                            ...(typeof options !== 'undefined' ? {defaultValues} : {}),
                            ...(typeof options !== 'undefined' ? {required}      : {}),
                            ...(typeof options !== 'undefined' ? {reverse}       : {}),
                            ...(typeof options !== 'undefined' ? {rules}         : {})
                          }
                        })
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )
    )
  )

  assert(
    property(typesKeyArgsOptionsResult, ({types, key, args, options, result}) =>
      expect(
        array(types)(key, args, options)
      ).toStrictEqual(
        result
      )
    )
  )
})

test('options does not allow __proto__ field', () => {
  const answer = array(['number'])('answer', ['-a'], {__proto__: {I: {am: 'evil'}}})

  expect(answer).toStrictEqual(
    array(['number'])('answer', ['-a'], {})
  )
})

test('options allows any user defined field except __proto__, key, args, and types', () => {
  const answer = array(['number'])('answer', ['-a'], {foo: 'bar', baz: 42, __proto__: 42, key: 42, args: 42, types: 42})

  const exp = {
    key: 'answer',
    types: ['number'],
    args: ['-a'],
    foo: 'bar',
    baz: 42
  }

  expect(answer).toStrictEqual(exp)
})

function types () {
  const oneElem = ['string', 'number', 'bool']
  const arr = arbArray(oneof(...oneElem.map(constant)), 2, 10)
  return oneof(...[...oneElem.map(a => [a]), [], null].map(constant), arr)
}