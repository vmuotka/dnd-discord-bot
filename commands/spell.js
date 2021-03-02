const Spell = require('../models/spell')
const { MessageEmbed } = require('discord.js')

module.exports = async (msg, args) => {
  if (args.length > 0) {
    const spellname = args.join(' ')
    let query = {
      name: { '$regex': spellname, '$options': 'i' }
    }
    const data = await Spell.find(query)

    if (data.length > 0) {
      const spell = data[0]
      const materialstring = `(${spell.material})`

      const card = new MessageEmbed()
        .setTitle(`${spell.name} ${spell.ritual ? '(ritual)' : ''}`)
        .setColor('#ff69b4')
        .setURL(`https://vmuotka-ketunkolo.herokuapp.com/spell/${spell._id}`)
        .setDescription(spell.level + ' ' + spell.school)
        .addFields(
          { name: 'Casting Time', value: spell.casting_time },
          { name: 'Range', value: spell.range },
          {
            name: 'Components', value: `${spell.components.join(', ')} ${spell.material && materialstring}`
          },
          { name: 'Duration', value: `${spell.duration} ${spell.concentration && '(c)'}` },
          { name: 'classes', value: spell.class.join(', ') },
          { name: 'Description', value: spell.desc }
        )
      msg.channel.send(card)
    } else {
      msg.channel.send('Spell not found')
    }

  } else {
    msg.channel.send('Usage: `spell <spellname>`')
  }

}