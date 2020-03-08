const layout   = require('./combinators/layout')
const {brFrom} = require('./br')

const brsFrom = id => (length = 1) => layout(
  Array.from({length}, () => brFrom(id))
)

const brs = brsFrom('line')

module.exports = {
  brs,
  brsFrom
}