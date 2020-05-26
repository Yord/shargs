const pipe = (...fs) => a => {
  let res = a
  for (let i = 0; i < fs.length; i++) res = fs[i](res)
  return res
}

module.exports = {
  pipe
}