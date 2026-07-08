"use client"

import { startTransition, useEffect, useRef, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

type Props = {
  query?: string
  selectedTags: string[]
  selectedDepartments: string[]
  currentPage: number
  totalPages: number
  currentSize: number
}

type MenuOption = {
  value: string
  label: string
}

function buildQueryString(params: {
  query?: string
  selectedTags: string[]
  selectedDepartments: string[]
  page: number
  size: number
}) {
  const searchParams = new URLSearchParams()

  if (params.query) {
    searchParams.set("query", params.query)
  }

  if (params.selectedTags.length) {
    searchParams.set("tags", params.selectedTags.join(","))
  }

  if (params.selectedDepartments.length) {
    searchParams.set("departments", params.selectedDepartments.join(","))
  }

  searchParams.set("page", String(params.page))
  searchParams.set("size", String(params.size))

  return searchParams.toString()
}

function SelectMenu({
  label,
  value,
  options,
  onSelect,
}: {
  label: string
  value: string
  options: MenuOption[]
  onSelect: (value: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={
          "group inline-flex h-11 min-w-34 items-center justify-between gap-4 rounded-full border px-3 py-2 text-sm transition " +
          (isOpen
            ? "border-white/22 bg-white/10 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.05)]"
            : "border-white/10 bg-[rgba(255,255,255,0.05)] text-white/70 hover:border-white/18 hover:bg-[rgba(255,255,255,0.08)]")
        }
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-white/55">{label}</span>
        <span className="inline-flex min-w-0 flex-1 items-center justify-end gap-2 text-sm font-medium text-white transition group-hover:text-white">
          <span>{value}</span>
          <span
            className={
              "text-[10px] text-white/55 transition duration-150 group-hover:text-white/75 " +
              (isOpen ? "rotate-180 text-white/80" : "rotate-0")
            }
          >
            ▼
          </span>
        </span>
      </button>

      {isOpen ? (
        <div
          className="absolute right-0 z-20 mt-2 min-w-full overflow-hidden rounded-2xl border border-white/12 bg-[#1b1f25] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
          role="listbox"
          aria-label={label}
        >
          {options.map((option) => {
            const active = option.value === value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  onSelect(option.value)
                }}
                className={
                  "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition " +
                  (active
                    ? "bg-white/12 text-white"
                    : "text-white/72 hover:bg-white/8 hover:text-white")
                }
                role="option"
                aria-selected={active}
              >
                <span>{option.label}</span>
                {active ? <span className="text-xs text-white/55">Actuel</span> : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export default function AssociationsToolbarControls({
  query,
  selectedTags,
  selectedDepartments,
  currentPage,
  totalPages,
  currentSize,
}: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const safeTotalPages = Math.max(totalPages, 1)

  function navigate(nextPage: number, nextSize: number) {
    const queryString = buildQueryString({
      query,
      selectedTags,
      selectedDepartments,
      page: nextPage,
      size: nextSize,
    })

    startTransition(() => {
      router.push(`${pathname}?${queryString}`, { scroll: true })
    })
  }

  const isFirstPage = currentPage <= 0
  const isLastPage = safeTotalPages <= 1 || currentPage >= safeTotalPages - 1

  const chevronClass = "h-3.5 w-3.5"

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <SelectMenu
        label="Taille"
        value={String(currentSize)}
        options={[10, 25, 50].map((size) => ({
          value: String(size),
          label: `${size} résultats`,
        }))}
        onSelect={(value) => navigate(0, Number(value))}
      />

      <div className="inline-flex h-11 min-w-34 items-center justify-between gap-3 rounded-full border border-white/10 bg-[rgba(255,255,255,0.05)] px-3 py-2 text-sm text-white/70">
        <span className="text-white/55">Page</span>
        <div className="inline-flex items-center gap-2 text-sm font-medium text-white">
          <button
            type="button"
            onClick={() => navigate(currentPage - 1, currentSize)}
            disabled={isFirstPage}
            aria-label="Page précédente"
            className={
              "inline-flex h-7 w-7 items-center justify-center rounded-full border text-sm transition " +
              (isFirstPage
                ? "border-white/8 text-white/25"
                : "border-white/12 text-white/70 hover:border-white/22 hover:bg-white/8 hover:text-white")
            }
          >
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={chevronClass}>
              <path
                d="M9.75 3.5 5.25 8l4.5 4.5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <span className="min-w-12 text-center text-white">{currentPage + 1} / {safeTotalPages}</span>

          <button
            type="button"
            onClick={() => navigate(currentPage + 1, currentSize)}
            disabled={isLastPage}
            aria-label="Page suivante"
            className={
              "inline-flex h-7 w-7 items-center justify-center rounded-full border text-sm transition " +
              (isLastPage
                ? "border-white/8 text-white/25"
                : "border-white/12 text-white/70 hover:border-white/22 hover:bg-white/8 hover:text-white")
            }
          >
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={chevronClass}>
              <path
                d="M6.25 3.5 10.75 8l-4.5 4.5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}