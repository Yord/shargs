const defaultStyle = require('../style')
const {linesFrom} = require('./lines')

const textFrom = id => (STRING = '') => (
  (style = defaultStyle) => {
    const {[id]: line = defaultStyle.line} = style

    const words = splitWords(STRING)

    const strings = []
    let string    = ''

    for (let i = 0; i < words.length; i++) {
      const word = words[i]

      const lineFull = (string + word).length > line.width
      
      if (lineFull) {
        strings.push(string)
        string = word === ' ' ? '' : word
      } else {
        string += word
      }
    }

    strings.push(string)

    return linesFrom(id)(strings)(style)
  }
)

const text = textFrom('line')

function splitWords (string) {
  return string.split(/(\s+)/g)
}

module.exports = {
  text,
  textFrom
}