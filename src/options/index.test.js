const {anything, array: arbArray, assert, base64, constant, oneof, property, unicodeString} = require('fast-check')
const {array} = require('.')

test('options types are correctly assembled', () => {
  const typesKeyArgsOptionsResult = types().chain(types =>
    base64().chain(key =>
      anything().filter(a => typeof a !== 'undefined').chain(args =>
        oneof(constant(undefined), unicodeString()).chain(desc =>
          oneof(constant(undefined), anything()).chain(implies =>
            oneof(constant(undefined), anything()).chain(only =>
              oneof(constant(undefined), anything()).chain(opts =>
                oneof(constant(false), constant(true)).chain(required =>
                  oneof(constant(false), constant(true)).chain(reverse =>
                    oneof(constant(undefined), anything()).chain(values =>
                      oneof(constant(undefined), constant({desc, implies, only, opts, required, reverse, values})).map(options =>
                        ({
                          types,
                          key,
                          args,
                          options,
                          result: {
                            key,
                            types,
                            args,
                            desc:     typeof options !== 'undefined' && typeof desc     !== 'undefined' ? desc     : '',
                            implies:  typeof options !== 'undefined' && typeof implies  !== 'undefined' ? implies  : {},
                            only:     typeof options !== 'undefined' && typeof only     !== 'undefined' ? only     : null,
                            opts:     typeof options !== 'undefined' && typeof opts     !== 'undefined' ? opts     : null,
                            values:   typeof options !== 'undefined' && typeof values   !== 'undefined' ? values   : null,
                            required: typeof options !== 'undefined' && typeof required !== 'undefined' ? required : false,
                            reverse:  typeof options !== 'undefined' && typeof reverse  !== 'undefined' ? reverse  : false
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

test('options allows any user defined field except __proto__', () => {
  const answer = array(['number'])('answer', ['-a'], {foo: 'bar', baz: 42, __proto__: 42})

  const exp = {
    foo: 'bar',
    baz: 42,
    key: 'answer',
    types: ['number'],
    args: ['-a'],
    desc: '',
    implies: {},
    only: null,
    opts: null,
    required: false,
    reverse: false,
    values: null
  }

  expect(answer).toStrictEqual(exp)
})

function types () {
  const oneElem = ['string', 'number', 'bool']
  const arr = arbArray(oneof(...oneElem.map(constant)), 2, 10)
  return oneof(...[...oneElem.map(a => [a]), [], null].map(constant), arr)
}