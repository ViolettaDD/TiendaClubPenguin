import { Button, Heading } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { dictionaries, type Dictionary } from "@lib/i18n/dictionaries"

type HeroProps = {
  copy?: Dictionary["hero"]
}

const Hero = ({ copy = dictionaries.es.hero }: HeroProps) => {
  return (
    <div className="cp-section-sky relative w-full border-b border-ui-border-base">
      <div className="content-container relative z-10 flex flex-col small:flex-row small:items-center gap-8 small:gap-12 py-12 small:py-16">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-5 text-left">
          <Heading
            level="h1"
            className="text-3xl small:text-5xl leading-tight text-ui-fg-base font-normal"
          >
            {copy.welcome}
          </Heading>
          <Heading
            level="h2"
            className="text-xl small:text-2xl leading-snug text-ui-fg-subtle font-normal"
          >
            {copy.subtitle}
          </Heading>
          <p className="max-w-xl text-base small:text-lg leading-relaxed text-white">
            {copy.body}
          </p>
          <LocalizedClientLink href="/store">
            <Button variant="secondary">{copy.cta}</Button>
          </LocalizedClientLink>
        </div>

        <div className="cp-decor-frame cp-decor-frame-crowd shrink-0">
          <img src="/decor/puffle-crowd.jpg" alt="" />
        </div>
      </div>
    </div>
  )
}

export default Hero
