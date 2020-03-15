const style = require('../style')

// TODO: cut off string if it surpasses the line's width
const lineFrom = id => (string = '') => (
  ({[id]: line = style.line} = style) => (
    ''.padStart(line.padStart || 0) + string.padEnd(line.width) + '\n'
  )
)

const line = lineFrom('line')

module.exports = {
  line,
  lineFrom
}
