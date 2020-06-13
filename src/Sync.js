const {pipe} = require('./pipe')

const Sync = {
  resolve: a => a,
  then:    pipe,
  all:     a => a
}

module.exports = {
  Sync
}