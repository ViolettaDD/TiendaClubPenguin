import { getDictionary } from "@lib/i18n/get-dictionary"
import { Heading, Text } from "@modules/common/components/ui"

import InteractiveLink from "@modules/common/components/interactive-link"

const EmptyCartMessage = async () => {
  const dict = await getDictionary()

  return (
    <div
      className="py-48 px-2 flex flex-col justify-center items-start"
      data-testid="empty-cart-message"
    >
      <Heading
        level="h1"
        className="flex flex-row text-3xl-regular gap-x-2 items-baseline"
      >
        {dict.cart.title}
      </Heading>
      <Text className="text-base-regular mt-4 mb-6 max-w-[32rem]">
        {dict.cart.emptyBody}
      </Text>
      <div>
        <InteractiveLink href="/store">{dict.cart.explore}</InteractiveLink>
      </div>
    </div>
  )
}

export default EmptyCartMessage
