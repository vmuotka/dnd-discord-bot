const spell = require('./commands/spell')
const spellsearch = require('./commands/spellsearch')
const roll = require('./commands/roll')

const commands = {
  spell,
  spellsearch,
  roll
}
const prefix = '§'

module.exports = async (msg) => {
  if (msg.author.bot)
    return

  let tokens = msg.content.split(' ')
  let command = tokens.shift()

  if (command.charAt(0) === prefix) {
    command = command.substring(1)
    commands[command] ?
      commands[command](msg, tokens)
      : msg.channel.send('That command is not available')
  }

  // bots need love too
  if (msg.content.includes('love u'))
    msg.reply('love u too <3')
}