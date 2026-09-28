import { retrieveCart } from "@lib/data/cart"
import type { Dictionary } from "@lib/i18n/dictionaries"
import CartDropdown from "../cart-dropdown"

type CartButtonProps = {
  labels: Dictionary["cart"]
  cartLabel: string
}

export default async function CartButton({
  labels,
  cartLabel,
}: CartButtonProps) {
  const cart = await retrieveCart().catch(() => null)

  return <CartDropdown cart={cart} labels={labels} cartLabel={cartLabel} />
}
