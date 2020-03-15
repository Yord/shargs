const defaultStyle = require('../../style')

module.exports = (functions = []) => (style = defaultStyle) => (
  functions.map(f => f(style)).join('')
)