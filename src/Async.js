const {then} = require('./then')

const Async = {
  resolve: a => Promise.resolve(a),
  then:    then,
  all:     a => Promise.all(a)
}

module.exports = {
  Async
}