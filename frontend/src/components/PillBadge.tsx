import { ReactNode } from "react"

type PillBadgeProps = {
  children: ReactNode
  tone?: "accent" | "accent-muted" | "neutral" | "neutral-muted"
}

const toneClassNames: Record<NonNullable<PillBadgeProps["tone"]>, string> = {
  accent: "border-sky-400/20 bg-sky-500/10 text-sky-100",
  "accent-muted": "border-sky-400/14 bg-sky-500/8 text-sky-100/70",
  neutral: "border-white/10 bg-black/15 text-white/55",
  "neutral-muted": "border-white/10 bg-black/15 text-white/45",
}

export default function PillBadge({ children, tone = "neutral" }: PillBadgeProps) {
  return (
    <span
      className={
        "rounded-full border px-3 py-1 text-xs font-medium " + toneClassNames[tone]
      }
    >
      {children}
    </span>
  )
}