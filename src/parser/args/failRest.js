const traverseArgs = require('./traverseArgs')
const {unexpectedArgument} = require('../errors')

module.exports = traverseArgs({
  array: ({key, val: array, errs, args}) => {
    const errs2 = []

    if (key === '_') {
      for (let i = 0; i < array.length; i++) {
        const argument = array[i]
    
        errs2.push(unexpectedArgument({argument}))
      }
    }
    return {errs: errs.concat(errs2), args}
  }
})