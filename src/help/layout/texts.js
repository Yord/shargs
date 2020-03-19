const layoutMap  = require('./combinators/layoutMap')
const {textFrom} = require('./text')

const o = (f, g) => x => f(g(x))

const textsFrom = o(layoutMap, textFrom)

const texts = textsFrom('line')

module.exports = {
  texts,
  textsFrom
}