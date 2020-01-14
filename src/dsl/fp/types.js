const array   = types => (args, {only = null, opts = null, desc = ''} = {}) => ({types, args, only, opts, desc})

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