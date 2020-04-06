const {synopsis} = require('./synopsis')

test('synopsis README example works as expected', () => {
  const opts = [
    {key: 'answer', types: ['number'], args: ['-a', '--answer'], desc: 'The answer.', required: true},
    {key: 'help', types: [], args: ['-h', '--help'], desc: 'Prints help.', defaultValue: [false]},
    {key: 'version', types: [], args: ['--version'], desc: 'Prints version.', contradicts: ['help']}
  ]
  
  const style = {
    line: {width: 40}
  }
  
  const res = synopsis('deepThought')(opts)(style)

  const txt = 'deepThought (-a|--answer) [-h|--help]   \n'+
              '            [--version]                 \n'
  
  expect(res).toStrictEqual(txt)
})