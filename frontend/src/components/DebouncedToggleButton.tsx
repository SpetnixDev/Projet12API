"use client"

import { useEffect, useRef, useState, useTransition } from "react"

type DebouncedToggleButtonProps = {
  endpoint: string
  active: boolean
  activeLabel: string
  inactiveLabel: string
  activeClassName: string
  inactiveClassName: string
  debounceMs?: number
  onOptimisticChange?: (active: boolean) => void
}

export default function DebouncedToggleButton({
  endpoint,
  active,
  activeLabel,
  inactiveLabel,
  activeClassName,
  inactiveClassName,
  debounceMs = 500,
  onOptimisticChange,
}: DebouncedToggleButtonProps) {
  const timeoutRef = useRef<number | null>(null)
  const desiredActiveRef = useRef(active)
  const submittedActiveRef = useRef(active)
  const inFlightRef = useRef(false)
  const flushAfterFlightRef = useRef(false)

  const [isPending, startTransition] = useTransition()
  const [isActive, setIsActive] = useState(active)

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  function clearQueuedSubmit() {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  function queueSubmit() {
    clearQueuedSubmit()
    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null
      submitDesiredState()
    }, debounceMs)
  }

  function submitDesiredState() {
    if (inFlightRef.current) {
      flushAfterFlightRef.current = true
      return
    }

    const nextActive = desiredActiveRef.current

    if (nextActive === submittedActiveRef.current) {
      return
    }

    inFlightRef.current = true

    startTransition(() => {
      void fetch(endpoint, {
        method: nextActive ? "POST" : "DELETE",
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Toggle request failed")
          }

          return undefined
        })
        .then(() => {
          submittedActiveRef.current = nextActive
        })
        .catch(() => {
          if (desiredActiveRef.current === nextActive) {
            desiredActiveRef.current = submittedActiveRef.current
            setIsActive(submittedActiveRef.current)
            onOptimisticChange?.(submittedActiveRef.current)
          }
        })
        .finally(() => {
          inFlightRef.current = false

          if (flushAfterFlightRef.current) {
            flushAfterFlightRef.current = false
            queueSubmit()
          }
        })
    })
  }

  function handleClick() {
    const nextActive = !desiredActiveRef.current

    desiredActiveRef.current = nextActive
    setIsActive(nextActive)
    onOptimisticChange?.(nextActive)
    queueSubmit()
  }

  return (
    <button
      type="button"
      aria-busy={isPending}
      aria-pressed={isActive}
      className={isActive ? activeClassName : inactiveClassName}
      onClick={handleClick}
    >
      {isActive ? activeLabel : inactiveLabel}
    </button>
  )
}
