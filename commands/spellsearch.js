const Spell = require('../models/spell')

module.exports = async (msg, args) => {
  if (args.length > 0) {
    const spellname = args.join(' ')
    let query = {
      name: { '$regex': spellname, '$options': 'i' }
    }
    const data = await Spell.find(query)

    if (data.length > 0) {
      let response = 'I found these spells:\n'
      response += data.map(spell => `${data.indexOf(spell) + 1}. **${spell.name}** (*${spell.level}*)`).join('\n')
      msg.channel.send(response)
    } else {
      msg.channel.send('Spells not found')
    }

  } else {
    msg.channel.send('Usage: `§spellsearch <searchword>`')
  }
}