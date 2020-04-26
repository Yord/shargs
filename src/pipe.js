const pipe = (f, ...fs) => a => {
  let res = f(a)
  for (let i = 0; i < fs.length; i++) res = fs[i](res)
  return res
}

module.exports = {
  pipe
}