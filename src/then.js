module.exports = (...ps) => a => ps.reduce(
  (acc, p) => acc.then(a => p(a)),
  Promise.resolve(a)
)