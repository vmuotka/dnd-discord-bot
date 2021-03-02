const axios = require('axios')
const { MessageEmbed } = require('discord.js')

let users = []


const join = (msg, args) => {
  if (args[1]) {
    let user = users.find(u => u.id === msg.author.id)
    if (!user) {
      const user = {
        id: msg.author.id,
        roomname: args[1],
      }
      users.push(user)
    } else {
      user.roomname = args[1]
    }
    msg.reply(`You joined ${args[1]}'s room.`)
  } else {
    msg.channel.send('Usage: `initiative join <dm ketunkolo-username>`, join the initracker room in Ketunkolo')
  }
}

const character = (msg, args) => {
  if (args[1]) {
    let user = users.find(u => u.id === msg.author.id)
    if (!user) {
      msg.reply('please join a room first.')
      return
    }

    user.character = args[1]
    users = users.map(u => u.id !== msg.author.id ? u : user)
    msg.reply(`You changed your character to ${args[1]}`)
  } else {
    msg.channel.send('Usage: `initiative character <charactername>`, set your character. The character must match the name that your DM uses in their INITracker.')
  }
}

const updateInitiative = async (msg, args) => {
  const user = users.find(u => u.id === msg.author.id)
  if (!user.roomname || !user.character) {
    msg.reply('please join a room and set your characters name before updating initiative.')
    return
  }
  try {
    await axios.get(`http://vmuotka-ketunkolo.herokuapp.com/api/initracker/initiative`, {
      params: {
        roomname: user.roomname,
        character: user.character,
        initiative: args[0]
      }
    })
  } catch (err) {
    console.error(err)
  }

}

const check = (msg, args) => {
  const user = users.find(u => u.id === msg.author.id)
  if (user)
    msg.reply(`Your setup: \nRoom: ${user.roomname ? user.roomname : 'unset'} \nCharacter: ${user.character ? user.character : 'unset'}`)
  else
    msg.reply('You are not a part of a room yet. Join a room with `initiative join <roomname>`')
}

const commands = {
  join,
  character,
  check
}

module.exports = async (msg, args) => {
  if (args.length > 0) {
    if (commands[args[0]])
      commands[args[0]](msg, args)
    else if (Number.isInteger(+args[0]))
      updateInitiative(msg, args)

  } else {
    const card = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Initiative')
      .setDescription('This group of commands allows you to update your initiative roll if your DM is using Ketunkolo\'s INITracker.')
      .addFields(
        { name: 'Join', value: '`initiative join <dm\'s Ketunkolo username>` to join your DM\'s room.' },
        { name: 'Character', value: '`initiative character <name>`, must match the character name in your DM\'s INITracker.' },
        { name: 'Set Initiative', value: '`initiative <number>`, sets your initiative' }
      )
    msg.channel.send(card)
  }
}
