const defaultLine = {width: 80}

const defaultDesc = {padStart: 4, width: 76}

const defaultCols = [
  {width: 25},
  {width: 55}
]

const defaultStyle = {
  line: defaultLine,
  desc: defaultDesc,
  cols: defaultCols
}

module.exports = (functions = []) => (style = defaultStyle) => (
  functions.map(f => f(style)).join('')
)