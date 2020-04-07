const traverseOpts = require('./traverseOpts')
const {didYouMean} = require('../errors')
const and = require('../combinators/and')

module.exports = traverseOpts(and(hasTypes, validValues, stringValue))((opt, _, opts) => {
  const argv    = opt.values[0]
  const options = distanceList(argv, opts)

  return {errs: [didYouMean({argv, options})]}
})

function hasTypes ({types}) {
  return typeof types === 'undefined'
}

function validValues ({values}) {
  return Array.isArray(values) && values.length === 1
}

function stringValue ({values}) {
  return typeof values[0] === 'string'
}

function distanceList (str, opts) {
  const distances = []
  let maxDist = 0

  for (let i = 0; i < opts.length; i++) {
    const opt = opts[i]
    const {args = []} = opt

    for (let j = 0; j < args.length; j++) {
      const arg = args[j]

      const dist = levenshteinDistance(str, arg)
      if (dist > maxDist) maxDist = dist

      distances.push([dist, {[arg]: opt}])
    }
  }

  const orderedDistances = Array.from({length: maxDist + 1}, () => [])

  for (let i = 0; i < distances.length; i++) {
    const [dist, argOpt] = distances[i]

    orderedDistances[dist].push(argOpt)
  }

  return orderedDistances
}

function levenshteinDistance (str1, str2) {
  const m  = str1.length
  const n  = str2.length

  let v0   = Array.from({length: n + 1}, (_, i) => i)
  const v1 = Array.from({length: n + 1})

  for (let i = 0; i < m; i++) {
    v1[0] = i + 1

    for (let j = 0; j < n; j++) {
      const deletionCost     = v0[j + 1] + 1
      const insertionCost    = v1[j] + 1
      const substitutionCost = str1[i] === str2[j] ? v0[j] : v0[j] + 1

      v1[j + 1] = Math.min(deletionCost, insertionCost, substitutionCost)
    }

    v0 = Array.from({length: n + 1}, (_, i) => v1[i])
  }

  return v0[n]
}