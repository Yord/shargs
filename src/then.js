const then = (...ps) => a => ps.reduce(
  (acc, p) => acc.then(a => p(a)),
  Promise.resolve(a)
)

module.exports = {
  then
}