module.exports = (string = '', id = undefined) => (
  ({line = {}, [id]: idLine} = {}) => (
    ''.padStart((idLine || line).padStart) + string.padEnd((idLine || line).width) + '\n'
  )
)