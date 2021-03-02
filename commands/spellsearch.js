const Spell = require('../models/spell')

module.exports = async (msg, args) => {
  if (args.length > 0) {
    const spellname = args.join(' ')
    if (spellname.length >= 3) {
      let query = {
        name: { '$regex': spellname, '$options': 'i' }
      }
      const data = await Spell.find(query)

      if (data.length > 0) {
        data.sort((a, b) => {
          if (a.name > b.name)
            return 1
          if (b.name > a.name)
            return -1
          return 0
        })
        let response = 'I found these spells:\n'
        response += data.map(spell => `${data.indexOf(spell) + 1}. **${spell.name}** (*${spell.level}*)`).join('\n')
        msg.channel.send(response.substring(0, 1000))
      } else {
        msg.channel.send('Spells not found')
      }
    } else {
      msg.channel.send('Please narrow your search')
    }
  } else {
    msg.channel.send('Usage: `spellsearch <searchword>`')
  }
}