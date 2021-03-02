const mongoose = require('mongoose')

const featSchema = new mongoose.Schema({
  name: { type: String },
  desc: { type: String },
  prerequisite: { type: String }
})

featSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Spell = mongoose.model('Feat', featSchema)

module.exports = Spell