import { Filter, RawFilter } from "@shared/types/FilterTypes"

export function createFilter(rawFilter: RawFilter): Filter | undefined {
  const entries = Object.entries(rawFilter)

  if (!entries.length) return

  return entries.reduce((acc, entrie) => {
    return {
      ...acc,
      [entrie[0]]: {
        value: entrie[1].split(':')[1],
        condition: entrie[1].split(':')[0],
      }
    }
  }, {} as Filter)
}
