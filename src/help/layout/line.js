module.exports = (string = '', id = undefined) => (
  ({line: LINE = {}, [id]: idLine} = {}) => {
    const line = idLine || LINE
    return ''.padStart(line.padStart) + string.padEnd(line.width) + '\n'
  }
)