module.exports = (toStrings = []) => (style = {}) => (
  toStrings.map(toString => toString(style)).join('')
)