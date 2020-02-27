// TODO: cut off string if it surpasses the line's width
const lineFrom = id => (string = '') => (
  ({[id]: line = {padStart: 0, width: 80}} = {}) => (
    ''.padStart(line.padStart) + string.padEnd(line.width) + '\n'
  )
)

const line = lineFrom('line')

module.exports = {
  line,
  lineFrom
}
