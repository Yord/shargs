module.exports = (f1, ...fs) => a => {
  let res = f1(a)
  for (let i = 0; i < fs.length; i++) res = fs[i](res)
  return res
}