const Discord = require('discord.js')
const client = new Discord.Client()
const mongoose = require('mongoose')
require('dotenv').config()

const messageHandler = require('./commands')

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })

client.login(process.env.DISCORD)

client.on('ready', () => {
  client.user.setActivity(
    'Dungeons & Dragons',
  )
  console.log(`Logged in as ${client.user.tag}`)
  // console.log(client)
})

client.on('message', messageHandler)