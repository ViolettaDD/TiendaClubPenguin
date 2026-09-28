import type { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows"
import { slugifyHandle } from "../utils/slugify-handle"

export default async function normalizeProductHandles({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "handle", "title"],
  })

  const updates = products
    .map((product) => {
      const handle = slugifyHandle(product.handle || product.title || "")
      if (!handle || handle === product.handle) {
        return null
      }
      return { id: product.id, handle }
    })
    .filter((product): product is { id: string; handle: string } => Boolean(product))

  if (updates.length) {
    await updateProductsWorkflow(container).run({
      input: { products: updates },
    })

    for (const product of updates) {
      logger.info(`Updated handle ${product.id} → ${product.handle}`)
    }
  } else {
    logger.info("All product handles are already ASCII slugs.")
  }

  const search = container.resolve(Modules.SEARCH)
  await search.ingest({
    name: "product.updated",
    data: products.map((product) => ({ id: product.id })),
  } as never)
  logger.info(`Search index refreshed for ${products.length} product(s).`)
}
