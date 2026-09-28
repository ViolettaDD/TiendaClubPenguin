"use client"

import { createContext, useContext } from "react"

import { dictionaries, type Dictionary, type StoreLang } from "./dictionaries"

const I18nContext = createContext<Dictionary>(dictionaries.es)

export function I18nProvider({
  locale,
  children,
}: {
  locale: StoreLang
  children: React.ReactNode
}) {
  return (
    <I18nContext.Provider value={dictionaries[locale]}>
      {children}
    </I18nContext.Provider>
  )
}

export function useDictionary() {
  return useContext(I18nContext)
}
