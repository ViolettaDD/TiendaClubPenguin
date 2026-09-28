"use server"

import { STORE_LOCALES } from "@lib/i18n/get-dictionary"

export type Locale = {
  code: string
  name: string
}

/**
 * Storefront languages. Always Spanish and English so the switcher
 * stays available even if the backend has no /store/locales endpoint.
 */
export const listLocales = async (): Promise<Locale[]> => {
  return STORE_LOCALES.map((locale) => ({ ...locale }))
}
