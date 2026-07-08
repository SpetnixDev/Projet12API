"use client"

import { useDeferredValue, useEffect, useState } from "react"

type Option = {
  value: string
  label: string
  meta?: string
}

type Props = {
  title: string
  name: string
  options: Option[]
  selectedValues: string[]
  searchPlaceholder: string
  emptyLabel: string
}

export default function AssociationsMultiSelect({
  title,
  name,
  options,
  selectedValues,
  searchPlaceholder,
  emptyLabel,
}: Props) {
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<string[]>(selectedValues)
  const deferredQuery = useDeferredValue(query)
  const normalizedQuery = deferredQuery.trim().toLowerCase()

  useEffect(() => {
    setSelected(selectedValues)
  }, [selectedValues])

  function toggleValue(value: string) {
    setSelected((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    )
  }

  const filteredOptions = normalizedQuery
    ? options.filter((option) =>
        `${option.label} ${option.meta ?? ""} ${option.value}`
          .toLowerCase()
          .includes(normalizedQuery)
      )
    : options

  return (
    <section className="rounded-2xl border border-white/10 bg-[rgba(24,28,36,0.84)] p-4">
      {selected.map((value) => (
        <input key={`${name}-${value}`} type="hidden" name={name} value={value} />
      ))}

      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        <span className="rounded-full border border-white/10 bg-white/6 px-2 py-0.5 text-xs text-white/55">
          {selected.length}
        </span>
      </div>

      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={searchPlaceholder}
        className="mt-3 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/85 outline-none transition placeholder:text-white/35 focus:border-white/20"
      />

      <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-3">
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => toggleValue(option.value)}
              className={
                "flex w-full items-start gap-3 rounded-xl border px-3 py-2 text-left text-sm transition " +
                (selected.includes(option.value)
                  ? "border-sky-400/40 bg-sky-500/14 text-white shadow-[0_0_0_1px_rgba(56,189,248,0.12)]"
                  : "border-white/8 bg-white/3 text-white/78 hover:border-white/14 hover:bg-white/5")
              }
            >
              <span
                className={
                  "mt-0.5 h-2.5 w-2.5 rounded-full transition " +
                  (selected.includes(option.value) ? "bg-sky-300" : "bg-white/18")
                }
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-white/88">{option.label}</span>
                {option.meta ? (
                  <span className="mt-0.5 block truncate text-xs text-white/45">
                    {option.meta}
                  </span>
                ) : null}
              </span>
            </button>
          ))
        ) : (
          <p className="rounded-xl border border-dashed border-white/10 px-3 py-4 text-sm text-white/45">
            {emptyLabel}
          </p>
        )}
      </div>
    </section>
  )
}