import { UUID_REGEX } from "@shared/constants"

export const isValidUUID = (uuid: string): boolean => {
  return UUID_REGEX.test(uuid)
}
