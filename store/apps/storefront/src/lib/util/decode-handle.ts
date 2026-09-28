/**
 * Next.js can leave dynamic `[handle]` params URL-encoded (e.g. puffle-b%C3%A1sico).
 * The Medusa JS SDK then encodes them again, so the Store API looks up
 * puffle-b%25C3%25A1sico and returns no product.
 */
export function decodeHandle(handle: string): string {
  let current = handle

  for (let i = 0; i < 3; i++) {
    try {
      const decoded = decodeURIComponent(current)
      if (decoded === current) {
        break
      }
      current = decoded
    } catch {
      break
    }
  }

  return current
}

export function asciiHandle(handle: string): string {
  return decodeHandle(handle)
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
