import mongoose from "mongoose"

const PageSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  sections: [{
    name: String,
    elements: [
      {
        name: String,
        content: String
      }
    ]
  }]
})

export const PageModel = mongoose.model('Page', PageSchema)
