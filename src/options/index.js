const array   = types => (key, args, fields = {}) => {
  const {__proto__, key: _1, types: _2, args: _3, values: _4, ...rest} = fields

  return {
    key,
    types,
    args,
    ...rest
  }
}

const number  = array(['number'])
const string  = array(['string'])
const bool    = array(['bool'])
const flag    = array([])
const command = array(null)

module.exports = {
  array,
  number,
  string,
  bool,
  flag,
  command
}