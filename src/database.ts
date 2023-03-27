
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import mongoose from 'mongoose'

config()

const url = process.env.SUPABASE_URL || ''
const key = process.env.SUPABASE_KEY || ''
const mongoURL = process.env.MONGODB_URL || ''

export const supabase = createClient(url, key)
export const mongoConnection = async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log('MongoDB has been connected.')
  } catch (error) {
    console.log('Something went wrong on MongoDB connection.')
  }
}
