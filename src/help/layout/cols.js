const {linesFrom} = require('./lines')

const defaultCols = [
  {width: 25},
  {width: 55}
]

const defaultStyle = {
  cols: defaultCols
}

// TODO: make sure cols are long enough for all elements or have default cols available
// TODO: cut strings if they are too long for a column!
const colsFrom = id => (columns = []) => (
  (style = defaultStyle) => {
    const {[id]: cols = defaultCols} = style
    const length = columns.reduce((max, column) => Math.max(max, column.length), 0)

    const strings = []

    for (let i = 0; i < length; i++) {
      let string = ''

      for (let j = 0; j < columns.length; j++) {
        const text = columns[j][i] || ''

        const width    = (cols[j] || {}).width
        const padStart = (cols[j] || {}).padStart || 0
        const padEnd   = (cols[j] || {}).padEnd   || 0

        string += ''.padStart(padStart) + text.padEnd(width) + ''.padEnd(padEnd)
      }

      strings.push(string)
    }

    return linesFrom(id)(strings)(style)
  }
)

const cols = colsFrom('cols')

module.exports = {
  cols,
  colsFrom
}