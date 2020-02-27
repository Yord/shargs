const {tableFrom} = require('../layout/table')

module.exports = (start = '', end = '', filter = ({types}) => typeof types !== 'undefined' && types !== null, id = 'cols') => (
  (opts = []) => {
    const argsString  = ({args = []}) => '[' + args.join('|') + ']'
    const argsStrings = (
      opts
      .filter(filter)
      .map(argsString).join(' ')
    )

    return STYLE => {
      const width = STYLE.line.width
      const style = {
        ...STYLE,
        cols: [
          {width: Math.min(start.length, width), padEnd: start.length < width ? 1 : 0},
          {width: start.length < width ? width - start.length - 1 : width}
        ]
      }
      return tableFrom(id)(
        [[start, argsStrings + (end !== '' ? ' ' : '') + end]]
      )(style)
    }
  }
)