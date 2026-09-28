"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text } from "@modules/common/components/ui"
import { Fragment } from "react"
import CountryToggle from "../country-toggle"
import LanguageToggle from "../language-toggle"
import { Locale } from "@lib/data/locales"
import type { StoreLang } from "@lib/i18n/dictionaries"

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
  labels: {
    menu: string
    home: string
    store: string
    account: string
    cart: string
    storeName: string
    rights: string
    language: string
  }
}

const SideMenu = ({
  regions,
  locales: _locales,
  currentLocale,
  labels,
}: SideMenuProps) => {
  const items = [
    { name: labels.home, href: "/", testId: "home-link" },
    { name: labels.store, href: "/store", testId: "store-link" },
    { name: labels.account, href: "/account", testId: "account-link" },
    { name: labels.cart, href: "/cart", testId: "cart-link" },
  ]

  return (
    <Popover className="h-full flex items-center">
      {({ open, close }) => (
        <>
          <Popover.Button
            data-testid="nav-menu-button"
            className="cp-hamburger"
            aria-label={labels.menu}
          >
            <span className="cp-hamburger-bars" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </Popover.Button>

          {open && (
            <div
              className="fixed inset-0 z-[50] bg-[rgba(27,58,92,0.35)]"
              onClick={close}
              data-testid="side-menu-backdrop"
            />
          )}

          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-150"
            enterFrom="opacity-0 -translate-x-3"
            enterTo="opacity-100 translate-x-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-x-0"
            leaveTo="opacity-0 -translate-x-3"
          >
            <PopoverPanel className="absolute left-0 top-[calc(100%+0.6rem)] z-[51] w-[min(20rem,calc(100vw-1.5rem))]">
              <div
                data-testid="nav-menu-popup"
                className="cp-menu-panel flex flex-col gap-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="cp-menu-title">{labels.storeName}</p>
                  <button
                    data-testid="close-menu-button"
                    onClick={close}
                    className="cp-menu-close"
                    aria-label={labels.menu}
                  >
                    <XMark />
                  </button>
                </div>

                <ul className="flex flex-col gap-2">
                  {items.map((item) => (
                    <li key={item.href}>
                      <LocalizedClientLink
                        href={item.href}
                        className="cp-menu-link"
                        onClick={close}
                        data-testid={item.testId}
                      >
                        {item.name}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>

                <div className="cp-menu-meta">
                  <div className="flex flex-wrap items-center gap-2">
                    <LanguageToggle
                      current={
                        (currentLocale?.toLowerCase().startsWith("en")
                          ? "en"
                          : "es") as StoreLang
                      }
                      label={labels.language}
                    />
                    <CountryToggle regions={regions} />
                  </div>
                  <Text className="txt-compact-small leading-snug">
                    © {new Date().getFullYear()} {labels.storeName}.{" "}
                    {labels.rights}
                  </Text>
                </div>
              </div>
            </PopoverPanel>
          </Transition>
        </>
      )}
    </Popover>
  )
}

export default SideMenu
