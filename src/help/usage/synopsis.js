const {tableFrom} = require('../layout/table')

const synopsisFrom = id => (start = '', end = '') => (opts = []) => {
  const argsString  = ({args = []}) => '[' + args.join('|') + ']'
  const argsStrings = opts.map(argsString).join(' ')

  return STYLE => {
    const width = (STYLE.line || {}).width || 80
    const style = {
      ...STYLE,
      synopsis: [
        {
          width: Math.min(start.length, width),
          padEnd: start.length < width ? 1 : 0
        },
        {
          width: start.length < width ? width - start.length - 1 : width
        }
      ]
    }
    return tableFrom(id)([
      [
        start,
        argsStrings + (end !== '' ? ' ' : '') + end
      ]
    ])(style)
  }
}

const synopsis = synopsisFrom('synopsis')

module.exports = {
  synopsis,
  synopsisFrom
}