module.exports = (text = '', id = undefined) => (
  ({line = {}, [id]: idLine} = {}) => (
    ''.padStart((idLine || line).padStart) + text.padEnd((idLine || line).width) + '\n'
  )
)