const { MessageEmbed } = require('discord.js')

module.exports = async (msg, args) => {
  const card = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Help')
    .setDescription('Get more detailed usage by typing the command name in chat.')
    .addFields(
      { name: 'Spell', value: '`spell <spellname>`, returns the first spell matching given searchword' },
      { name: 'Spellsearch', value: '`spellsearch <searchword>`, returns a list of spell names matching the given searchword' },
      { name: 'Roll', value: '`roll 2d6`, rolls dice and adds them together. \nGet more detailed instructions by typing `roll`' },
      { name: 'Feat', value: '`feat <featname>`, returns the first feat matching given searchword.' },
      { name: 'Feats', value: '`feats`, returns a list of all feats in the database.' }
    )
  msg.channel.send(card)
}