const Feat = require('../models/feat')
const { MessageEmbed } = require('discord.js')

module.exports = async (msg, args) => {
  if (args.length > 0) {
    const featname = args.join(' ')
    let query = {
      name: { '$regex': featname, '$options': 'i' }
    }
    const data = await Feat.find(query)
    if (data.length > 0) {
      const feat = data[0]

      const card = new MessageEmbed()
        .setTitle(feat.name)
        .setColor('#ff69b4')
        .setDescription(feat.prerequisite ? feat.prerequisite : 'No prerequisite')
        .addFields(
          { name: 'Description', value: feat.desc }
        )

      msg.channel.send(card)
    } else {
      msg.channel.send('No feats found.')
    }
  } else {
    msg.channel.send('Usage: `feat <featname>`')
  }
}