module.exports = (f, ...fs) => usageFunction => (
  [f, ...fs].reduce((uf, f) => f(uf), usageFunction)
)