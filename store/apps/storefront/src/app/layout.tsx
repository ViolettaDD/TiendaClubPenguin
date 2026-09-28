import { getBaseURL } from "@lib/util/env"
import { getStoreLocale } from "@lib/i18n/get-dictionary"
import { Baloo_2, Nunito } from "next/font/google"
import { Metadata } from "next"
import "styles/globals.css"
import "styles/theme-club-penguin.css"

const nunito = Nunito({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
})

const baloo = Baloo_2({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const locale = await getStoreLocale()

  return (
    <html
      lang={locale}
      data-mode="light"
      className={`${nunito.variable} ${baloo.variable}`}
    >
      <body className={nunito.className}>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
