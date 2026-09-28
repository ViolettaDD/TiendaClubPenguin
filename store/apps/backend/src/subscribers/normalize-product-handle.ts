import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows"
import { slugifyHandle } from "../utils/slugify-handle"

export default async function normalizeProductHandle({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "handle", "title"],
    filters: { id: data.id },
  })

  const product = products[0]
  if (!product) {
    return
  }

  const normalized = slugifyHandle(product.handle || product.title || "")
  if (!normalized || normalized === product.handle) {
    return
  }

  await updateProductsWorkflow(container).run({
    input: {
      products: [{ id: product.id, handle: normalized }],
    },
  })

  logger.info(
    `Normalized product handle ${product.handle} → ${normalized} (${product.id})`
  )
}

export const config: SubscriberConfig = {
  event: ["product.created", "product.updated"],
}
