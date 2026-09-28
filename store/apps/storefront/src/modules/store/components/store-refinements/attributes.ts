import { PRODUCT_INDEX_NAME, priceAttribute } from "@lib/search-client"

export const OPTION_VALUES_ATTRIBUTE = "option_values"
export const CATEGORY_ATTRIBUTE = "category"
// The index calls the product's tags "labels".
export const LABELS_ATTRIBUTE = "labels"

export const getSortOptions = (
  currencyCode: string,
  labels: {
    relevance: string
    latestArrivals: string
    priceLowHigh: string
    priceHighLow: string
    titleAZ: string
    titleZA: string
  }
) => {
  const minPrice = priceAttribute("min_price", currencyCode)

  return [
    { value: PRODUCT_INDEX_NAME, label: labels.relevance },
    {
      value: `${PRODUCT_INDEX_NAME}/sort/created_at:desc`,
      label: labels.latestArrivals,
    },
    {
      value: `${PRODUCT_INDEX_NAME}/sort/${minPrice}:asc`,
      label: labels.priceLowHigh,
    },
    {
      value: `${PRODUCT_INDEX_NAME}/sort/${minPrice}:desc`,
      label: labels.priceHighLow,
    },
    { value: `${PRODUCT_INDEX_NAME}/sort/title:asc`, label: labels.titleAZ },
    { value: `${PRODUCT_INDEX_NAME}/sort/title:desc`, label: labels.titleZA },
  ]
}
