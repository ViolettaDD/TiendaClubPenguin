import { getLocale } from "@lib/data/locale-actions"
import { dictionaries, type Dictionary, type StoreLang } from "./dictionaries"

export const STORE_LOCALES = [
  { code: "es", name: "Español" },
  { code: "en", name: "English" },
] as const

export const isStoreLang = (value: string | null | undefined): value is StoreLang =>
  value === "es" || value === "en"

export const normalizeStoreLang = (
  value: string | null | undefined
): StoreLang => {
  if (!value) {
    return "es"
  }

  const code = value.toLowerCase().split(/[-_]/)[0]
  return isStoreLang(code) ? code : "es"
}

export const getStoreLocale = async (): Promise<StoreLang> => {
  return normalizeStoreLang(await getLocale())
}

export const getDictionary = async (
  locale?: string | null
): Promise<Dictionary> => {
  const lang = locale ? normalizeStoreLang(locale) : await getStoreLocale()
  return dictionaries[lang]
}
