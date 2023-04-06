export type FilterColumn = 'price' | 'in_stock' | 'rating' | 'shelf_life' | 'limit'
export type FilterCondition = 'eq' | 'gte' | 'lte'

export type RawFilter = {
  [key in FilterColumn]: `${FilterCondition}:${string}`
}

export type Filter = {
  [key in FilterColumn]: {
    value: string
    condition: FilterCondition
  }
}
