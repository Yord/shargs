const defaultStyle = require('../style')
const {tableFrom} = require('../layout/table')

const synopsisFrom = id => (start = '', end = '') => (opts = []) => {
  const argsString  = ({args = []} = {}) => (
    args.length === 0 ? '' : '[' + args.join('|') + ']'
  )
  const argsStrings = opts.reduce(
    (str, opt) => (str && str + ' ') + argsString(opt),
    ''
  )

  return (STYLE = defaultStyle) => {
    const width = (STYLE.line || defaultStyle.line).width
    const style = {
      ...STYLE,
      synopsis: [
        {
          width:  Math.min(start.length, width),
          padEnd: start.length !== 0 && start.length < width ? 1 : 0
        },
        {
          width:  start.length !== 0 && start.length < width ? width - start.length - 1 : width
        }
      ]
    }

    return tableFrom(id)([
      [
        start,
        argsStrings + (argsStrings !== '' && end !== '' ? ' ' : '') + end
      ]
    ])(style)
  }
}

const synopsis = synopsisFrom('synopsis')

module.exports = {
  synopsis,
  synopsisFrom
}