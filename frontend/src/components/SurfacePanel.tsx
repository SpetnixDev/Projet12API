import type { ReactNode } from "react"

type SurfacePanelProps = {
  children: ReactNode
  className?: string
  as?: "div" | "section" | "article"
}

export default function SurfacePanel({
  children,
  className,
  as = "div",
}: SurfacePanelProps) {
  const Tag = as
  const classes = ["ui-panel", className ?? ""].filter(Boolean).join(" ")

  return <Tag className={classes}>{children}</Tag>
}