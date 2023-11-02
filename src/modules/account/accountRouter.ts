import { supabase } from "@shared/frameworksDrivers/supabase";
import { Request, Response, Router } from "express";
import { v4 } from "uuid";

const accountRouter = Router()

async function createAccount(_request: Request, response: Response) {
  try {
    const { data, error } = await supabase
      .from('account')
      .insert({
        id: v4()
      })
      .select()

    if (error) {
      return response.status(500).json('It was not possible to create the account.')
    }

    return response.status(200).json(data)
  } catch (error) {
    return response.status(500).json('It was not possible to create the account.')
  }
}

accountRouter.post('/create', createAccount)

export default accountRouter
