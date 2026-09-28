"use client"

import { useDictionary } from "@lib/i18n/i18n-context"
import FilterRadioGroup from "@modules/common/components/filter-radio-group"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: string) => void
  "data-testid"?: string
}

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  const dict = useDictionary()
  const sortOptions = [
    {
      value: "created_at",
      label: dict.store.latestArrivals,
    },
    {
      value: "price_asc",
      label: dict.store.priceLowHigh,
    },
    {
      value: "price_desc",
      label: dict.store.priceHighLow,
    },
  ]

  const handleChange = (value: string) => {
    setQueryParams("sortBy", value as SortOptions)
  }

  return (
    <FilterRadioGroup
      title={dict.store.sortBy}
      items={sortOptions}
      value={sortBy}
      handleChange={handleChange}
      data-testid={dataTestId}
    />
  )
}

export default SortProducts
