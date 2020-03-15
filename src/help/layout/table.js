const defaultStyle = require('../style')
const {colsFrom}   = require('./cols')

const tableFrom = id => (itemsList = []) => (
  (style = defaultStyle) => {
    const {[id]: COLS = defaultStyle.cols} = style

    const colWidths = COLS.map(col => col.width)
    const indexes   = COLS.map((_, i) => i)
    let columns     = indexes.map(() => [])

    for (let i = 0; i < itemsList.length; i++) {
      const items = itemsList[i]

      const wordsList = items.map(splitWords)

      let ks   = indexes.map(() => 0)
      let rows = indexes.map(() => '')

      while (indexes.reduce((bool, index) => bool || ks[index] < (wordsList[index] || []).length, false)) {
        const words = indexes.map(index => (wordsList[index] || [])[ks[index]] || '')

        const fulls = indexes.map(index =>
          ks[index] >= (wordsList[index] || []).length || (rows[index] + words[index]).length > colWidths[index]
        )

        if (fulls.reduce((bool, p) => bool && p, true)) {
          columns = indexes.map(index => [...columns[index], rows[index]])
          rows    = indexes.map(index => words[index] !== ' ' ? words[index] : '')
          ks      = indexes.map(index => ks[index] + 1)
        }

        indexes.forEach(index => {
          if (!fulls[index]) {
            rows[index] = rows[index] + words[index]
            ks[index]   = ks[index] + 1
          }
        })
      }

      columns = indexes.map(index => [...columns[index], rows[index]])
    }

    return colsFrom(id)(columns)(style)
  }
)

const table = tableFrom('cols')

function splitWords (string) {
  return string.split(/(\s+)/g)
}

module.exports = {
  table,
  tableFrom
}