import type { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  createRegionsWorkflow,
  createServiceZonesWorkflow,
  createShippingOptionsWorkflow,
  createTaxRegionsWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"

const COUNTRY_CODE = "ec"
const REGION_NAME = "Ecuador"
const CURRENCY_CODE = "usd"
const SERVICE_ZONE_NAME = "Ecuador"
const SHIPPING_OPTION_NAME = "Standard"
const SHIPPING_AMOUNT = 10

export default async function addEcRegion({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const link = container.resolve(ContainerRegistrationKeys.LINK)

  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code", "countries.iso_2"],
  })

  const existingRegion = regions.find((region) =>
    region.countries?.some((country) => country?.iso_2 === COUNTRY_CODE)
  )

  let region = existingRegion

  if (region) {
    logger.info(`Region for ${COUNTRY_CODE} already exists (${region.id}). Skipping create.`)
  } else {
    const { result } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: REGION_NAME,
            currency_code: CURRENCY_CODE,
            countries: [COUNTRY_CODE],
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    })
    region = result[0]
    logger.info(`Created region ${REGION_NAME} (${region.id}).`)
  }

  const { data: taxRegions } = await query.graph({
    entity: "tax_region",
    fields: ["id", "country_code"],
  })

  const existingTaxRegion = taxRegions.find(
    (taxRegion) => taxRegion.country_code === COUNTRY_CODE
  )

  if (existingTaxRegion) {
    logger.info(`Tax region for ${COUNTRY_CODE} already exists. Skipping create.`)
  } else {
    await createTaxRegionsWorkflow(container).run({
      input: [
        {
          country_code: COUNTRY_CODE,
          provider_id: "tp_system",
        },
      ],
    })
    logger.info(`Created tax region for ${COUNTRY_CODE}.`)
  }

  const { data: stores } = await query.graph({
    entity: "store",
    fields: [
      "id",
      "default_region_id",
      "supported_currencies.currency_code",
      "supported_currencies.is_default",
    ],
  })
  const store = stores[0]

  if (!store) {
    throw new Error("No store found. Run the initial data seed first.")
  }

  const extraCurrencies = (store.supported_currencies ?? [])
    .map((currency) => currency?.currency_code)
    .filter((code): code is string => Boolean(code) && code !== CURRENCY_CODE && code !== "eur")

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_region_id: region.id,
        supported_currencies: [
          { currency_code: CURRENCY_CODE, is_default: true },
          { currency_code: "eur", is_default: false },
          ...extraCurrencies.map((currency_code) => ({
            currency_code,
            is_default: false,
          })),
        ],
      },
    },
  })
  logger.info("Set USD as the store default currency (EUR kept as secondary).")

  const { data: fulfillmentSets } = await query.graph({
    entity: "fulfillment_set",
    fields: [
      "id",
      "name",
      "service_zones.id",
      "service_zones.name",
      "service_zones.geo_zones.country_code",
    ],
  })

  let fulfillmentSet = fulfillmentSets[0]

  if (!fulfillmentSet) {
    const fulfillmentModule = container.resolve(Modules.FULFILLMENT)
    const { data: stockLocations } = await query.graph({
      entity: "stock_location",
      fields: ["id"],
    })
    const stockLocation = stockLocations[0]

    if (!stockLocation) {
      throw new Error("No stock location found. Run the initial data seed first.")
    }

    fulfillmentSet = await fulfillmentModule.createFulfillmentSets({
      name: "Warehouse delivery",
      type: "shipping",
    })

    await link.create({
      [Modules.STOCK_LOCATION]: {
        stock_location_id: stockLocation.id,
      },
      [Modules.FULFILLMENT]: {
        fulfillment_set_id: fulfillmentSet.id,
      },
    })
    logger.info(`Created fulfillment set ${fulfillmentSet.id}.`)
  }

  const existingZone = fulfillmentSet.service_zones?.find(
    (zone) =>
      zone.name === SERVICE_ZONE_NAME ||
      zone.geo_zones?.some((geoZone) => geoZone.country_code === COUNTRY_CODE)
  )

  let serviceZone = existingZone

  if (serviceZone) {
    logger.info(`Service zone for ${COUNTRY_CODE} already exists. Skipping create.`)
  } else {
    const { result } = await createServiceZonesWorkflow(container).run({
      input: {
        data: [
          {
            name: SERVICE_ZONE_NAME,
            fulfillment_set_id: fulfillmentSet.id,
            geo_zones: [
              {
                type: "country",
                country_code: COUNTRY_CODE,
              },
            ],
          },
        ],
      },
    })
    serviceZone = result[0]
    logger.info(`Created service zone ${SERVICE_ZONE_NAME} (${serviceZone.id}).`)
  }

  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const shippingProfile = shippingProfiles[0]

  if (!shippingProfile) {
    throw new Error("No shipping profile found. Run the initial data seed first.")
  }

  const { data: shippingOptions } = await query.graph({
    entity: "shipping_option",
    fields: ["id", "name", "service_zone_id"],
  })

  const existingOption = shippingOptions.find(
    (option) =>
      option.service_zone_id === serviceZone.id &&
      option.name === SHIPPING_OPTION_NAME
  )

  if (existingOption) {
    logger.info(`Shipping option ${SHIPPING_OPTION_NAME} already exists. Skipping create.`)
  } else {
    await createShippingOptionsWorkflow(container).run({
      input: [
        {
          name: SHIPPING_OPTION_NAME,
          price_type: "flat",
          provider_id: "manual_manual",
          service_zone_id: serviceZone.id,
          shipping_profile_id: shippingProfile.id,
          type: {
            label: "Standard",
            description: "Ship in 2-3 days.",
            code: "standard",
          },
          prices: [
            {
              currency_code: CURRENCY_CODE,
              amount: SHIPPING_AMOUNT,
            },
            {
              region_id: region.id,
              amount: SHIPPING_AMOUNT,
            },
          ],
          rules: [
            {
              attribute: "enabled_in_store",
              value: "true",
              operator: "eq",
            },
            {
              attribute: "is_return",
              value: "false",
              operator: "eq",
            },
          ],
        },
      ],
    })
    logger.info(`Created shipping option ${SHIPPING_OPTION_NAME} at ${SHIPPING_AMOUNT} USD.`)
  }

  logger.info("Ecuador region setup is complete.")
}
