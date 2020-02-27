const {brFrom} = require('../layout/br')

const spaceFrom = id => () => brFrom(id)

const space = spaceFrom('line')

module.exports = {
  space,
  spaceFrom
}