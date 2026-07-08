"use client"

import { useRef, useState } from "react"
import DebouncedToggleButton from "@/components/DebouncedToggleButton"

type AssociationEngagementControlsProps = {
  associationId: string
  isSubscribed: boolean | null
  isSupported: boolean | null
  supportCount: number
}

function supportCountDetailLabel(count: number) {
  if (count === 1) {
    return "Cette association est soutenue par 1 personne."
  }

  return `Cette association est soutenue par ${count} personnes.`
}

export default function AssociationEngagementControls({
  associationId,
  isSubscribed,
  isSupported,
  supportCount,
}: AssociationEngagementControlsProps) {
  const supportActiveRef = useRef(isSupported)
  const [optimisticSupportCount, setOptimisticSupportCount] = useState(supportCount)

  function handleSupportChange(nextActive: boolean) {
    if (supportActiveRef.current === null || supportActiveRef.current === nextActive) {
      return
    }

    supportActiveRef.current = nextActive
    setOptimisticSupportCount((current) =>
      Math.max(0, current + (nextActive ? 1 : -1))
    )
  }

  return (
    <div className="shrink-0 flex flex-col items-end gap-2">
      <div className="flex flex-wrap items-center justify-end gap-2">
        {isSubscribed !== null ? (
          <DebouncedToggleButton
            key={`subscription-${isSubscribed}`}
            endpoint={`/api/users/me/subscriptions/${encodeURIComponent(associationId)}`}
            active={isSubscribed}
            activeLabel="Se désabonner"
            inactiveLabel="S'abonner"
            activeClassName="rounded-xl px-4 py-2 text-sm font-semibold border border-red-400/35 bg-red-500/18 text-red-100 transition hover:bg-red-500/26 hover:border-red-300/45"
            inactiveClassName="ui-button rounded-xl px-4 py-2 text-sm"
          />
        ) : null}

        {isSupported !== null ? (
          <DebouncedToggleButton
            key={`support-${isSupported}`}
            endpoint={`/api/users/me/supports/${encodeURIComponent(associationId)}`}
            active={isSupported}
            activeLabel="Ne plus soutenir"
            inactiveLabel="Soutenir"
            activeClassName="rounded-xl px-4 py-2 text-sm font-semibold border border-amber-300/35 bg-amber-400/18 text-amber-100 transition hover:bg-amber-400/26 hover:border-amber-200/45"
            inactiveClassName="rounded-xl px-4 py-2 text-sm font-semibold border border-white/20 bg-white/8 text-white transition hover:bg-white/14"
            onOptimisticChange={handleSupportChange}
          />
        ) : null}
      </div>

      <p className="text-right text-sm text-white/65">
        {supportCountDetailLabel(optimisticSupportCount)}
      </p>
    </div>
  )
}
