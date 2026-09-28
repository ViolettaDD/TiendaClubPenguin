/** ASCII slug so product URLs stay safe in Next.js dynamic routes. */
export function slugifyHandle(value: string): string {
  const slug = value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return slug || "product"
}
