import { UniqueEntityID } from "@base/UniqueEntityID";
import { supabase } from "@database";
import { CartItemRepository } from "./CartItemRepository";

export class CustomCartItemRepository implements CartItemRepository {
  async getByCartId(cartId: UniqueEntityID): Promise<any> {
    const { data, error } = await supabase
      .from('cart_item')
      .select('*')
      .eq('cart_id', cartId)
      .single()
    
    return data
  }
  getAll(filter?: unknown): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  getById(id: string): Promise<unknown> {
    throw new Error("Method not implemented.");
  }
  save(data: unknown): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}