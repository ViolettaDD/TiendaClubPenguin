import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { getDictionary } from "@lib/i18n/get-dictionary"
import { clx } from "@modules/common/components/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  const dict = await getDictionary()
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()
  const topCategories = (productCategories ?? [])
    .filter((category) => !category.parent_category)
    .slice(0, 6)
  const topCollections = (collections ?? []).slice(0, 6)

  return (
    <footer className="cp-footer w-full">
      <div className="content-container flex flex-col gap-8 py-10 small:py-12">
        <div className="grid grid-cols-1 gap-8 xsmall:grid-cols-2 medium:grid-cols-3">
          <div className="flex flex-col gap-3 max-w-sm">
            <LocalizedClientLink href="/" className="cp-footer-brand">
              {dict.storeName}
            </LocalizedClientLink>
            <p className="text-small-regular leading-relaxed">
              {dict.footer.aboutBody}
            </p>
          </div>

          {topCategories.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="cp-footer-title">{dict.footer.categories}</span>
              <ul className="flex flex-col gap-2" data-testid="footer-categories">
                {topCategories.map((category) => (
                  <li key={category.id}>
                    <LocalizedClientLink
                      className="cp-footer-link"
                      href={`/categories/${category.handle}`}
                      data-testid="category-link"
                    >
                      {category.name}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {topCollections.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="cp-footer-title">{dict.footer.collections}</span>
              <ul
                className={clx("flex flex-col gap-2", {
                  "small:columns-2 small:gap-x-6": topCollections.length > 4,
                })}
              >
                {topCollections.map((collection) => (
                  <li key={collection.id}>
                    <LocalizedClientLink
                      className="cp-footer-link"
                      href={`/collections/${collection.handle}`}
                    >
                      {collection.title}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <span className="cp-footer-title">{dict.footer.about}</span>
            <ul className="flex flex-col gap-2">
              <li>
                <LocalizedClientLink href="/" className="cp-footer-link">
                  {dict.nav.home}
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/store" className="cp-footer-link">
                  {dict.nav.store}
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/account" className="cp-footer-link">
                  {dict.nav.account}
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/cart" className="cp-footer-link">
                  {dict.nav.cart}
                </LocalizedClientLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="cp-footer-bar">
          <p className="txt-compact-small leading-snug">
            © {new Date().getFullYear()} {dict.storeName}. {dict.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
