const defaultLine = {width: 80}

const defaultStyle = {
  line: defaultLine
}

// TODO: cut off string if it surpasses the line's width
const lineFrom = id => (string = '') => (
  ({[id]: line = defaultLine} = defaultStyle) => (
    ''.padStart(line.padStart || 0) + string.padEnd(line.width) + '\n'
  )
)

const line = lineFrom('line')

module.exports = {
  line,
  lineFrom
}
