module.exports = (functions = []) => (style = {}) => (
  functions.map(f => f(style)).join('')
)