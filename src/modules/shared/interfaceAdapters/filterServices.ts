import { Filter, RawFilter } from "@shared/types/FilterTypes"

export function createFilter(rawFilter: RawFilter): Filter | undefined {
  const entries = Object.entries(rawFilter)

  if (!entries.length) return

  return entries.reduce((acc, entry) => {
    return {
      ...acc,
      [entry[0]]: {
        value: entry[1].split(':')[1],
        condition: entry[1].split(':')[0],
      }
    }
  }, {} as Filter)
}
