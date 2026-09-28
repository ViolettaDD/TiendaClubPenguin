"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useParams, usePathname } from "next/navigation"
import ReactCountryFlag from "react-country-flag"

import { updateRegion } from "@lib/data/cart"
import { useDictionary } from "@lib/i18n/i18n-context"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@modules/common/components/ui"

type CountryOption = {
  country: string
  region: string
  label: string
}

type CountryToggleProps = {
  regions: HttpTypes.StoreRegion[] | null
  className?: string
}

const CountryToggle = ({ regions, className }: CountryToggleProps) => {
  const dict = useDictionary()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const { countryCode } = useParams()
  const currentPath = usePathname().split(`/${countryCode}`)[1] || ""

  const options = useMemo(() => {
    return (regions ?? [])
      .flatMap((region) =>
        (region.countries ?? []).map((country) => ({
          country: country.iso_2 ?? "",
          region: region.id,
          label: country.display_name ?? "",
        }))
      )
      .filter((option): option is CountryOption => Boolean(option.country))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [regions])

  const current =
    options.find((option) => option.country === countryCode) ?? options[0]

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [])

  if (!current) {
    return null
  }

  return (
    <div className={clx("relative", className)} ref={rootRef}>
      <button
        type="button"
        className="cp-nav-chip"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={dict.nav.shippingTo}
        onClick={() => setOpen((value) => !value)}
      >
        <ReactCountryFlag
          svg
          countryCode={current.country.toUpperCase()}
          style={{ width: "18px", height: "18px" }}
        />
        <span className="uppercase tracking-wide">{current.country}</span>
      </button>
      {open && (
        <ul
          className="cp-dropdown absolute right-0 top-[calc(100%+0.5rem)] z-[80] min-w-[12rem] max-h-72 overflow-y-auto"
          role="listbox"
        >
          {options.map((option) => (
            <li key={`${option.region}-${option.country}`}>
              <button
                type="button"
                role="option"
                aria-selected={option.country === current.country}
                className={clx(
                  "flex w-full items-center gap-2 px-3 py-2 text-left text-sm",
                  option.country === current.country && "is-active"
                )}
                onClick={() => {
                  setOpen(false)
                  if (option.country !== current.country) {
                    updateRegion(option.country, currentPath)
                  }
                }}
              >
                <ReactCountryFlag
                  svg
                  countryCode={option.country.toUpperCase()}
                  style={{ width: "16px", height: "16px" }}
                />
                <span className="leading-tight">{option.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CountryToggle
