module.exports = (p, ...ps) => a => {
  let res = p(a)
  for (let i = 0; i < ps.length; i++) res = res && ps[i](a)
  return res
}