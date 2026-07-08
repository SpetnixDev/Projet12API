import AssociationsMultiSelect from "@/components/AssociationsMultiSelect"
import AssociationsToolbarControls from "@/components/AssociationsToolbarControls"
import PillBadge from "@/components/PillBadge"
import SurfacePanel from "@/components/SurfacePanel"
import Link from "next/link"
import { redirect } from "next/navigation"
import {
    AssociationApiError,
    searchAssociationsServer,
} from "@/lib/associations/server"
import {
    getDepartmentsServer,
    getTagsServer,
    ReferenceApiError,
} from "@/lib/references/server"

type AssociationsPageSearchParams = Promise<{
    query?: string | string[]
    tags?: string | string[]
    departments?: string | string[]
    page?: string | string[]
    size?: string | string[]
}>

function firstValue(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value
}

function toArray(value: string | string[] | undefined) {
    const rawValues = Array.isArray(value) ? value : value ? [value] : []

    return rawValues
        .flatMap((entry) => entry.split(","))
        .map((entry) => entry.trim())
        .filter(Boolean)
}

function parsePage(value: string | string[] | undefined, fallback = 0) {
    const parsed = Number.parseInt(firstValue(value) ?? "", 10)
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}

function parsePageSize(value: string | string[] | undefined) {
    const parsed = parsePage(value, 10)
    return [10, 25, 50].includes(parsed) ? parsed : 10
}

function buildAssociationsHref(params: {
    query?: string
    tags?: string[]
    departments?: string[]
    page?: number
    size?: number
}) {
    const searchParams = new URLSearchParams()

    if (params.query) {
        searchParams.set("query", params.query)
    }

    if (params.tags?.length) {
        searchParams.set("tags", params.tags.join(","))
    }

    if (params.departments?.length) {
        searchParams.set("departments", params.departments.join(","))
    }

    if (params.page !== undefined) {
        searchParams.set("page", String(params.page))
    }

    if (params.size !== undefined) {
        searchParams.set("size", String(params.size))
    }

    const queryString = searchParams.toString()
    return queryString ? `/associations?${queryString}` : "/associations"
}

function supportCountListLabel(count: number) {
    if (count === 1) {
        return "1 personne soutient cette association."
    }

    return `${count} personnes soutiennent cette association.`
}

function HiddenAssociationInputs({
    query,
    tags,
    departments,
    page,
    size,
}: {
    query?: string
    tags?: string[]
    departments?: string[]
    page?: number
    size?: number
}) {
    return (
        <>
            {query ? <input type="hidden" name="query" value={query} /> : null}
            {tags?.length ? <input type="hidden" name="tags" value={tags.join(",")} /> : null}
            {departments?.length ? (
                <input type="hidden" name="departments" value={departments.join(",")} />
            ) : null}
            {page !== undefined ? <input type="hidden" name="page" value={String(page)} /> : null}
            {size !== undefined ? <input type="hidden" name="size" value={String(size)} /> : null}
        </>
    )
}

export default async function AssociationPage({
    searchParams,
}: {
    searchParams: AssociationsPageSearchParams
}) {
    const params = await searchParams

    const query = firstValue(params.query)?.trim() || undefined
    const tags = toArray(params.tags)
    const departments = toArray(params.departments)
    const page = parsePage(params.page)
    const size = parsePageSize(params.size)

    let data
    let availableTags
    let availableDepartments

    try {
        [data, availableTags, availableDepartments] = await Promise.all([
            searchAssociationsServer({
                query,
                tags,
                departments,
                page,
                size,
            }),
            getTagsServer(),
            getDepartmentsServer(),
        ])
    } catch (error) {
        const errorMessage =
            error instanceof AssociationApiError || error instanceof ReferenceApiError
                ? error.message
                : "Erreur lors du chargement des associations."

        return (
            <div className="app-shell-bg relative min-h-[60vh] text-foreground">
                <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                    <SurfacePanel className="rounded-3xl p-6">
                            <h1 className="text-lg font-semibold text-foreground">Associations</h1>
                            <p className="mt-1 text-sm text-red-300">{errorMessage}</p>
                    </SurfacePanel>
                </div>
            </div>
        )
    }

    if (data.totalPages > 0 && page >= data.totalPages) {
        redirect(
            buildAssociationsHref({
                query,
                tags,
                departments,
                page: data.totalPages - 1,
                size,
            })
        )
    }

    const selectedTagLabels = availableTags.filter((tag) => tags.includes(tag.code))
    const selectedDepartmentLabels = availableDepartments.filter((department) =>
        departments.includes(department.code)
    )
    const clearFiltersHref = buildAssociationsHref({
        query,
        page: 0,
        size,
    })
    const pageLabel = data.totalPages > 0 ? `${page + 1} / ${data.totalPages}` : "0 / 0"

    return (
        <div className="app-shell-bg relative min-h-screen text-foreground">
            <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="rounded-3xl border border-white/10 bg-[rgba(24,28,36,0.84)] p-6 sm:p-8">
                        <div className="flex flex-col gap-4">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                    Associations
                                </h1>
                                <p className="mt-2 text-sm text-white/70">
                                    {data.totalElements} association{data.totalElements > 1 ? "s" : ""} trouvée
                                    {data.totalElements > 1 ? "s" : ""}
                                </p>
                            </div>

                            <form action="/associations" method="GET" className="w-full">
                                <HiddenAssociationInputs tags={tags} departments={departments} size={size} />
                                <input type="hidden" name="page" value="0" />

                                <div className="flex w-full items-center gap-2 rounded-full border border-white/30 bg-black/30 p-1 sm:min-w-100">
                                    <input
                                        type="search"
                                        name="query"
                                        defaultValue={query ?? ""}
                                        placeholder="Rechercher par mots clés"
                                        className="w-full border-0 bg-transparent px-4 py-2 text-sm text-white/90 outline-none placeholder:text-white/45"
                                    />
                                    <button
                                        type="submit"
                                        className="rounded-full border-0 bg-white/12 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/18"
                                    >
                                        Rechercher
                                    </button>
                                </div>
                            </form>

                            <div className="flex flex-wrap items-center gap-2">
                                {query ? (
                                    <span className="ui-chip inline-flex items-center gap-2 px-3 py-1 text-xs font-medium">
                                        <span className="text-white/50">Recherche</span>
                                        <span className="truncate max-w-55 sm:max-w-70">“{query}”</span>
                                    </span>
                                ) : null}

                                {selectedTagLabels.slice(0, 3).map((tag) => (
                                    <span key={tag.code} className="ui-chip inline-flex items-center px-3 py-1 text-xs font-medium">
                                        {tag.label}
                                    </span>
                                ))}

                                {selectedTagLabels.length > 3 ? (
                                    <span className="ui-chip inline-flex items-center px-3 py-1 text-xs font-medium">
                                        +{selectedTagLabels.length - 3} tag{selectedTagLabels.length - 3 > 1 ? "s" : ""}
                                    </span>
                                ) : null}

                                {selectedDepartmentLabels.slice(0, 2).map((department) => (
                                    <span
                                        key={department.code}
                                        className="ui-chip inline-flex items-center gap-2 px-3 py-1 text-xs font-medium"
                                    >
                                        <span>{department.name}</span>
                                        <span className="text-white/40">{department.code}</span>
                                    </span>
                                ))}

                                {selectedDepartmentLabels.length > 2 ? (
                                    <span className="ui-chip inline-flex items-center px-3 py-1 text-xs font-medium">
                                        +{selectedDepartmentLabels.length - 2} département{selectedDepartmentLabels.length - 2 > 1 ? "s" : ""}
                                    </span>
                                ) : null}
                            </div>
                        </div>
                </div>

                <div className="mt-6 grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
                    <aside className="space-y-4 lg:sticky lg:top-[calc(var(--app-header-height)+1.5rem)] lg:self-start">
                        <form action="/associations" method="GET" className="space-y-4">
                            <HiddenAssociationInputs query={query} size={size} />
                            <input type="hidden" name="page" value="0" />

                            <AssociationsMultiSelect
                                title="Tags"
                                name="tags"
                                options={availableTags.map((tag) => ({
                                    value: tag.code,
                                    label: tag.label,
                                    meta: tag.code,
                                }))}
                                selectedValues={tags}
                                searchPlaceholder="Filtrer les tags"
                                emptyLabel="Aucun tag ne correspond à cette recherche."
                            />

                            <AssociationsMultiSelect
                                title="Départements"
                                name="departments"
                                options={availableDepartments.map((department) => ({
                                    value: department.code,
                                    label: department.name,
                                    meta: department.region?.name
                                        ? `${department.code} · ${department.region.name}`
                                        : department.code,
                                }))}
                                selectedValues={departments}
                                searchPlaceholder="Filtrer les départements"
                                emptyLabel="Aucun département ne correspond à cette recherche."
                            />

                            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[rgba(24,28,36,0.84)] p-3">
                                <Link
                                    href={clearFiltersHref}
                                    className="flex-1 rounded-xl border border-white/10 bg-white/4 px-3 py-2 text-center text-sm text-white/70 transition hover:bg-white/8 hover:text-white"
                                >
                                    Réinitialiser
                                </Link>
                                <button
                                    type="submit"
                                    className="flex-1 rounded-xl border border-white/10 bg-white/8 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/12"
                                >
                                    Appliquer
                                </button>
                            </div>
                        </form>
                    </aside>

                    <section className="min-w-0">
                        <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-[rgba(24,28,36,0.84)] p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-medium text-white">Résultats</p>
                                <p className="mt-1 text-sm text-white/55">
                                    Page {pageLabel} · {size} résultats par page
                                </p>
                            </div>

                            <AssociationsToolbarControls
                                query={query}
                                selectedTags={tags}
                                selectedDepartments={departments}
                                currentPage={page}
                                totalPages={data.totalPages}
                                currentSize={size}
                            />
                        </div>

                <div>
                    {data.content.length === 0 ? (
                        <div className="rounded-3xl border border-white/10 bg-[rgba(24,28,36,0.84)] p-10 text-center">
                                <h2 className="text-base font-semibold text-foreground">Aucune association</h2>
                                <p className="mt-2 text-sm text-white/70">
                                    Essayez d’élargir vos filtres ou de modifier votre recherche.
                                </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {data.content.map((a) => (
                                <Link
                                    key={a.id}
                                    href={`/association/${a.id}`}
                                    className="ui-panel ui-panel-interactive group block rounded-3xl p-5"
                                >
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0 flex-1">
                                                <h2 className="text-lg font-semibold text-white">
                                                    {a.name}
                                                </h2>
                                            </div>
                                            <span className="text-xs font-medium text-white/60 transition group-hover:text-white/90">
                                                Voir plus <span aria-hidden="true">→</span>
                                            </span>
                                        </div>

                                        {a.description ? (
                                            <p className="mt-3 text-sm leading-6 text-white/70 line-clamp-3">
                                                {a.description}
                                            </p>
                                        ) : (
                                            <p className="mt-3 text-sm text-white/45 italic">Aucune description.</p>
                                        )}

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {a.tags?.slice(0, 4).map((tag) => (
                                                <PillBadge
                                                    key={`${a.id}-tag-${tag.id}`}
                                                    tone="accent"
                                                >
                                                    {tag.label}
                                                </PillBadge>
                                            ))}

                                            {a.tags && a.tags.length > 4 ? (
                                                <PillBadge tone="accent-muted">
                                                    +{a.tags.length - 4} tag{a.tags.length - 4 > 1 ? "s" : ""}
                                                </PillBadge>
                                            ) : null}
                                        </div>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {a.departments?.slice(0, 3).map((department) => (
                                                <PillBadge
                                                    key={`${a.id}-department-${department.code}`}
                                                >
                                                    {department.name} · {department.code}
                                                </PillBadge>
                                            ))}

                                            {a.departments && a.departments.length > 3 ? (
                                                <PillBadge tone="neutral-muted">
                                                    +{a.departments.length - 3} département{a.departments.length - 3 > 1 ? "s" : ""}
                                                </PillBadge>
                                            ) : null}
                                        </div>

                                        <p className="mt-3 text-xs text-white/60">
                                            {supportCountListLabel(a.supportCount ?? 0)}
                                        </p>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
                    </section>
                </div>
            </div>
        </div>
    )
}