const { MessageEmbed } = require('discord.js')

module.exports = async (msg, args) => {
  if (args.length > 0) {
    const [count, sides] = args[0].split('d')

    const advantage = args.includes('-a')
    const disadvantage = args.includes('-d')
    console.log(advantage)

    let rolls = []
    for (let i = 0; i < count; i++)
      rolls.push(Math.floor(Math.random() * sides + 1))

    const regex = /[+||-](\d)+/
    let modifier = args.find(str => regex.exec(str))

    let total
    if (advantage)
      total = +modifier ? Math.max(...rolls) + +modifier : Math.max(...rolls)
    else if (disadvantage)
      total = +modifier ? Math.min(...rolls) + +modifier : Math.min(...rolls)
    else
      total = +modifier ? rolls.reduce((a, b) => { return a + b }) + +modifier : rolls.reduce((a, b) => { return a + b })

    msg.channel.send(`[${rolls.join(', ')}] ${modifier ? `${modifier}` : ''} = **${total}**`)
  } else {
    const card = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Roll')
      .setDescription('This command allows you to roll dice inside discord chats.')
      .addFields(
        { name: 'Basic usage', value: '`roll 1d20`, replace the number before the separator (d) with how many dice you want to throw, and the number after with how many sides you want the dice to have.\n' },
        { name: 'Modifiers', value: '`roll 2d6 +5`, adds or subtracks the modifier from the calculated total.\n' },
        { name: 'Advantage or disadvantage', value: 'Roll with advantage: `roll 2d20 -a` or with disadvantage: `2d20 -d`. You can also use modifiers with advantage or disadvantage' }
      )
    msg.channel.send(card)
  }
}