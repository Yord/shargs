const array   = types => (arg, args, {only = null, desc = '', opts = null} = {}) => ({arg, types, args, only, desc, opts})

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