// TODO: cut off string if it surpasses the line's width
module.exports = (string = '', id = 'line') => (
  ({[id]: line = {padStart: 0, width: 80}} = {}) => {
    return ''.padStart(line.padStart) + string.padEnd(line.width) + '\n'
  }
)