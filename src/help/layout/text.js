const lines = require('./lines')

module.exports = (STRING = '', id = undefined) => (
  (style = {}) => {
    const {line = {}, [id]: idLine} = style

    const words = splitWords(STRING)

    const strings = []
    let string    = ''

    for (let i = 0; i < words.length; i++) {
      const word = words[i]

      const lineFull = (string + word).length > (idLine || line).width
      
      if (lineFull) {
        strings.push(string)
        string = word === ' ' ? '' : word
      } else {
        string += word
      }
    }

    strings.push(string)

    return lines(strings, id)(style)
  }
)

function splitWords (string) {
  return string.split(/(\s+)/g)
}