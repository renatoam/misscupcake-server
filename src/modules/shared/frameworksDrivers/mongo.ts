import { config } from 'dotenv'
import mongoose from 'mongoose'

config()

const mongoURL = process.env.MONGODB_URL ?? ''

export const mongoConnection = async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log('MongoDB has been connected.')
  } catch (error) {
    console.log('Something went wrong on MongoDB connection.')
  }
}
