const {optsList} = require('./optsList')

test('optsList README example works as expected', () => {
  const opts = [
    {key: 'answer', types: ['number'], args: ['-a', '--answer'], desc: 'The answer.'},
    {key: 'help', types: [], args: ['-h', '--help'], desc: 'Prints help.'},
    {key: 'version', types: [], args: ['--version'], desc: 'Prints version.'}
  ]
  
  const style = {
    cols: [
      {width: 30},
      {width: 25}
    ]
  }
  
  const res = optsList(opts)(style)

  const txt = '-a, --answer=<number>         The answer.              \n' +
              '-h, --help                    Prints help.             \n' +
              '--version                     Prints version.          \n'
  
  expect(res).toStrictEqual(txt)
})