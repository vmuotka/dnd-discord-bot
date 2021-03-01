const spell = require('./commands/spell')
const spellsearch = require('./commands/spellsearch')

const commands = {
  spell,
  spellsearch
}
const prefix = '§'

module.exports = async (msg) => {
  let tokens = msg.content.split(' ')
  let command = tokens.shift()

  if (command.charAt(0) === prefix) {
    command = command.substring(1)
    commands[command] ?
      commands[command](msg, tokens)
      : msg.channel.send('That command is not available')
  }

  // bots need love too
  if (msg.content === 'love u')
    msg.reply('love u too <3')
}