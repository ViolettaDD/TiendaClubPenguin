import { HttpTypes } from "@medusajs/types"
import ProductRail from "@modules/home/components/featured-products/product-rail"

export default async function FeaturedProducts({
  collections,
  region,
  viewAllLabel,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
  viewAllLabel: string
}) {
  return collections.map((collection) => (
    <li key={collection.id}>
      <ProductRail
        collection={collection}
        region={region}
        viewAllLabel={viewAllLabel}
      />
    </li>
  ))
}
