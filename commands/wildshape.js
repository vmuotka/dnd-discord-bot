const Monster = require('../models/monster')
const { MessageEmbed } = require('discord.js')
const paginationEmbed = require('discord.js-pagination')

module.exports = async (msg, args) => {
  if (args.length > 0) {
    let challenge_rating = [
      '0', '1/8', '1/4', '1/2'
    ]

    for (let i = 1; i <= 30; i++)
      challenge_rating.push(`${i}`)

    if (challenge_rating.includes(args[0])) {
      if (challenge_rating.includes(args[1]))
        challenge_rating = challenge_rating.slice(challenge_rating.indexOf(args[0]), challenge_rating.indexOf(args[1]) + 1)
      else
        challenge_rating = challenge_rating.slice(0, challenge_rating.indexOf(args[0]) + 1)

      let beasts = await Monster.find({ challenge_rating, type: 'beast' })
      beasts.sort((a, b) => {
        if (a.challenge_rating > b.challenge_rating)
          return 1
        if (a.challenge_rating < b.challenge_rating)
          return -1
        return 0
      })
      if (beasts.length > 0) {
        let pages = []
        for (let i = 0; i < beasts.length; i += 15)
          pages.push(createCard(beasts.slice(i, i + 15)))

        paginationEmbed(msg, pages, ['⏪', '⏩'], 90 * 1000)
      }
    } else {
      const beastname = args.join(' ')
      let beasts = await Monster.find({ name: { '$regex': '^' + beastname + '$', '$options': 'i' }, type: 'beast' })
      if (beasts.length === 0) {
        msg.channel.send(`Beast not found.`)
      } else if (beasts.length === 1) {
        const beast = beasts[0]

        const card = new MessageEmbed()
          .setTitle(`${beast.name} (CR: ${beast.challenge_rating})`)
          .setURL(`https://vmuotka-ketunkolo.herokuapp.com/monster/${beast._id}`)
          .setColor('#b5651d')
          .setDescription(`${beast.size} ${beast.type}, ${beast.alignment}`)
          .addFields(
            { name: 'Armor Class', value: beast.armor_class, inline: true },
            { name: 'Hit Points', value: `${beast.hit_points} (${beast.hit_dice})`, inline: true },
            { name: 'Speed', value: beast.speed_types.map(type => `${beast.speed[type]} ${type}`).join(', '), inline: true },
          )
        Object.keys(beast.attributes).forEach(att => {
          card.addFields({ name: att.toUpperCase(), value: `${beast.attributes[att]} (${Math.floor(beast.attributes[att] / 2 - 5)})`, inline: true })
        })
        if (Object.keys(beast.skills).length > 0)
          card.addFields({ name: 'Skills', value: Object.keys(beast.skills).map(skill => `${skill} ${beast.skills[skill]}`).join(', ') })
        if (Object.keys(beast.saving_throws).length > 0)
          card.addFields({ name: 'Saving Throws', value: Object.keys(beast.saving_throws).map(save => `${save} ${beast.saving_throws[save]}`).join(', ') })
        if (beast.senses)
          card.addFields({ name: 'Senses', value: beast.senses.join(', ') })
        if (beast.special_abilities)
          card.addFields({ name: 'Special Abilities', value: beast.special_abilities.map(ability => `**${ability.name}**\n${ability.desc}`).join('\n') })
        if (beast.actions)
          card.addFields(
            { name: 'Action', value: beast.actions.map(action => `**${action.name}**\n${action.desc}`).join('\n') })

        msg.channel.send(card)
      }
    }
  } else {
    msg.channel.send('Usage: `wildshape <max-cr>` return all beasts from 0 to given challenge rating. \n`wildshape <min-cr> <max-cr>` return all beasts within given range. \n`wildshape <beastname> returns a statblock for given beast.`')
  }
}

const createCard = (data) => {
  return new MessageEmbed()
    .setTitle('Wildshapes')
    .setColor('#ff69b4')
    .setDescription('List of wildshapes available at your level.')
    .addFields(
      { name: 'List', value: data.map(item => `${item.name} (CR: ${item.challenge_rating})`).join('\n') }
    )
}