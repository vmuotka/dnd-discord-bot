const Feat = require('../models/feat')
const { MessageEmbed } = require('discord.js')
const paginationEmbed = require('discord.js-pagination')

module.exports = async (msg, args) => {
  const featname = args.join(' ')
  let query = {
    name: { '$regex': featname, '$options': 'i' }
  }
  const data = await Feat.find(query, null, { sort: 'name' })
  if (data.length > 0) {
    let pages = []
    for (let i = 0; i < data.length; i += 15)
      pages.push(createCard(data.slice(i, i + 15)))

    paginationEmbed(msg, pages, ['⏪', '⏩'], 90 * 1000)

  } else {
    msg.channel.send('No feats found. This should not have happened...')
  }
}

const createCard = (data) => {
  return new MessageEmbed()
    .setTitle('Feats')
    .setColor('#ff69b4')
    .setDescription('List of all feats found in our database')
    .addFields(
      { name: 'List', value: data.map(item => item.name).join('\n') }
    )
}
