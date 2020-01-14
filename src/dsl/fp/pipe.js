module.exports = (f1, ...fs) => a => {
  let res = f1(a)

  for (let i = 0; i < fs.length; i++) {
    const f = fs[i]
    res = f(res)
  }

  return res
}