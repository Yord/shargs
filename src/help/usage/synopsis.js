const text = require('../layout/text')

module.exports = (start = '', end = '', id = undefined) => (
  (opts = []) => {
    const argsString  = ({args = []}) => '[' + args.join('|') + ']'
    const argsStrings = (
      opts
      .filter(({types}) => typeof types !== 'undefined' && types !== null) // Filter all commands
      .map(argsString).join(' ')
    )

    return text(start + (start !== '' ? ' ' : '') + argsStrings + (end !== '' ? ' ' : '') + end, id)
  }
)