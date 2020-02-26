const {brsFrom} = require('../layout/brs')

const spacesFrom = id => (length = 1) => () => brsFrom(id)(length)

const spaces = spacesFrom('line')

module.exports = {
  spaces,
  spacesFrom
}