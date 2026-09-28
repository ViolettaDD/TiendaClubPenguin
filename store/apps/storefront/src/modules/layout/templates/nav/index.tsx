import { Suspense } from "react"

import { listLocales } from "@lib/data/locales"
import { listRegions } from "@lib/data/regions"
import { getDictionary, getStoreLocale } from "@lib/i18n/get-dictionary"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import CountryToggle from "@modules/layout/components/country-toggle"
import LanguageToggle from "@modules/layout/components/language-toggle"
import Search from "@modules/layout/components/search"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, locale, dict] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getStoreLocale(),
    getDictionary(),
  ])

  const links = [
    { href: "/", label: dict.nav.home, testId: "nav-home-link" },
    { href: "/store", label: dict.nav.store, testId: "nav-store-page-link" },
    { href: "/account", label: dict.nav.account, testId: "nav-account-link" },
  ]

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header className="cp-nav relative mx-auto">
        <nav className="content-container grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 w-full min-h-[4.25rem] py-2.5">
          <div className="flex items-center gap-2 min-w-0 justify-self-start">
            <SideMenu
              regions={regions}
              locales={locales}
              currentLocale={locale}
              labels={{
                menu: dict.nav.menu,
                home: dict.nav.home,
                store: dict.nav.store,
                account: dict.nav.account,
                cart: dict.nav.cart,
                storeName: dict.storeName,
                rights: dict.footer.rights,
                language: dict.language.label,
              }}
            />
            <div className="cp-nav-links items-center gap-1">
              {links.map((link) => (
                <LocalizedClientLink
                  key={link.href}
                  href={link.href}
                  className="cp-nav-link"
                  data-testid={link.testId}
                >
                  {link.label}
                </LocalizedClientLink>
              ))}
            </div>
          </div>

          <LocalizedClientLink
            href="/"
            className="cp-nav-brand justify-self-center"
            data-testid="nav-store-link"
          >
            {dict.storeName}
          </LocalizedClientLink>

          <div className="flex items-center justify-end gap-2 min-w-0 justify-self-end">
            <CountryToggle regions={regions} />
            <LanguageToggle current={locale} label={dict.language.label} />
            <Search />
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="cp-nav-link"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  {dict.nav.cart} (0)
                </LocalizedClientLink>
              }
            >
              <CartButton labels={dict.cart} cartLabel={dict.nav.cart} />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
