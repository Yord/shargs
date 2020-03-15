const layout     = require('./combinators/layout')
const {textFrom} = require('./text')

const textsFrom = id => (strings = []) => layout(
  strings.map(textFrom(id))
)

const texts = textsFrom('line')

module.exports = {
  texts,
  textsFrom
}