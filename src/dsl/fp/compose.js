module.exports = (f, ...fs) => a => {
  let res = a
  for (let i = fs.length - 1; i > -1; i--) res = fs[i](res)
  return f(res)
}