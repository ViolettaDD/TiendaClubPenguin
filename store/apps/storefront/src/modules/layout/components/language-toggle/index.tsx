"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"

import { updateLocale } from "@lib/data/locale-actions"
import { clx } from "@modules/common/components/ui"
import type { StoreLang } from "@lib/i18n/dictionaries"

const OPTIONS: { code: StoreLang; label: string }[] = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
]

type LanguageToggleProps = {
  current: StoreLang
  label: string
}

const LanguageToggle = ({ current, label }: LanguageToggleProps) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const select = (code: StoreLang) => {
    if (code === current || isPending) {
      return
    }

    startTransition(async () => {
      await updateLocale(code)
      router.refresh()
    })
  }

  return (
    <div
      className="flex items-center gap-1 rounded-full border-2 border-white bg-white/20 px-1 py-1"
      role="group"
      aria-label={label}
    >
      {OPTIONS.map((option) => {
        const isActive = option.code === current

        return (
          <button
            key={option.code}
            type="button"
            disabled={isPending}
            onClick={() => select(option.code)}
            aria-pressed={isActive}
            className={clx(
              "min-h-8 min-w-8 rounded-full px-2.5 text-xs font-display leading-none transition-colors",
              isActive
                ? "bg-[var(--cp-gold)] text-[var(--cp-navy)]"
                : "text-white hover:text-[var(--cp-gold-soft)]"
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export default LanguageToggle
