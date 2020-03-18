const {anything, array: arbArray, assert, base64, constant, oneof, property, unicodeString} = require('fast-check')
const {array} = require('.')

test('types are correctly assembled', () => {
  const typesKeyArgsOptionsResult = types().chain(types =>
    base64().chain(key =>
      anything().filter(a => typeof a !== 'undefined').chain(args =>
        oneof(constant(undefined), anything()).chain(only =>
          oneof(constant(undefined), unicodeString()).chain(desc =>
            oneof(constant(undefined), anything()).chain(opts =>
              oneof(constant(undefined), constant({only, desc, opts})).map(options =>
                ({
                  types,
                  key,
                  args,
                  options,
                  result: {
                    key,
                    types,
                    args,
                    only: typeof options !== 'undefined' && typeof only !== 'undefined' ? only : null,
                    desc: typeof options !== 'undefined' && typeof desc !== 'undefined' ? desc : '',
                    opts: typeof options !== 'undefined' && typeof opts !== 'undefined' ? opts : null
                  }
                })
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

function types () {
  const oneElem = ['string', 'number', 'bool']
  const arr = arbArray(oneof(...oneElem.map(constant)), 2, 10)
  return oneof(...[...oneElem.map(a => [a]), [], null].map(constant), arr)
}