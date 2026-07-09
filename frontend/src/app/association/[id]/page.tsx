import Link from "next/link"
import { unstable_rethrow } from "next/navigation"
import { getAssociationByIdServer } from "@/lib/association/server"
import { getAssociationPostsServer } from "@/lib/posts/server"
import {
  getMySupportsServer,
  getMySubscriptionsServer,
} from "@/lib/users/server"
import { ApiError } from "@/lib/http/api-error"
import AssociationEngagementControls from "@/components/AssociationEngagementControls"
import PillBadge from "@/components/PillBadge"
import SurfacePanel from "@/components/SurfacePanel"

type AssociationPageSearchParams = Promise<{
  page?: string | string[]
  size?: string | string[]
}>

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

function parsePositiveInt(value: string | string[] | undefined, fallback: number): number {
  const parsed = Number.parseInt(firstValue(value) ?? "", 10)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}

function buildAssociationPostsHref(id: string, page: number, size: number) {
  const sp = new URLSearchParams()
  sp.set("page", String(page))
  sp.set("size", String(size))

  return `/association/${encodeURIComponent(id)}?${sp.toString()}`
}

function toDateLabel(value?: string) {
  if (!value) return null

  try {
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value))
  } catch {
    return null
  }
}

function getPostDate(post: {
  postedAt?: string
  modifiedAt?: string
}) {
  return post.postedAt ?? post.modifiedAt
}

function hasText(value: string | null | undefined) {
  return Boolean(value?.trim())
}

function websiteHref(value: string) {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: AssociationPageSearchParams
}) {
  const { id } = await params
  const query = await searchParams
  const page = parsePositiveInt(query.page, 0)
  const size = [10, 25, 50].includes(parsePositiveInt(query.size, 10))
    ? parsePositiveInt(query.size, 10)
    : 10

  try {
    const [association, posts] = await Promise.all([
      getAssociationByIdServer(id),
      getAssociationPostsServer({
        associationId: id,
        page,
        size,
      }),
    ])

    let isSubscribed: boolean | null = null
    let isSupported: boolean | null = null

    try {
      const subscriptions = await getMySubscriptionsServer()
      isSubscribed = subscriptions.some((entry) => entry.id === id)
    } catch (error) {
      if (
        error instanceof ApiError &&
        (error.status === 401 || error.status === 403 || error.status === 404)
      ) {
        isSubscribed = null
      } else {
        throw error
      }
    }

    try {
      const supports = await getMySupportsServer()
      isSupported = supports.some((entry) => entry.id === id)
    } catch (error) {
      if (
        error instanceof ApiError &&
        (error.status === 401 || error.status === 403 || error.status === 404)
      ) {
        isSupported = null
      } else {
        throw error
      }
    }

    const createdAtLabel = association.createdAt
      ? new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "long",
        timeStyle: "short",
      }).format(new Date(association.createdAt))
      : null
    const supportCount = association.supportCount ?? 0
    const phoneNumber = association.phoneNumber?.trim() ?? ""
    const contactEmail = association.contactEmail?.trim() ?? ""
    const address = association.address?.trim() ?? ""
    const websiteUrl = association.websiteUrl?.trim() ?? ""
    const rnaNumber = association.rnaNumber?.trim() ?? ""
    const donationUseDescription = association.donationUseDescription?.trim() ?? ""
    const hasPublicInfo =
      hasText(phoneNumber) ||
      hasText(contactEmail) ||
      hasText(address) ||
      hasText(websiteUrl) ||
      hasText(rnaNumber) ||
      hasText(donationUseDescription)

    return (
      <main className="app-shell-bg min-h-screen px-6 py-10">
        <div className="mx-auto w-full max-w-5xl space-y-6">
          <header className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-[2.6rem]">
                  {association.name}
                </h1>

                {createdAtLabel ? (
                  <p className="mt-1 text-sm text-white/55">
                    Créée le {createdAtLabel}
                  </p>
                ) : null}
              </div>

              <AssociationEngagementControls
                associationId={id}
                isSubscribed={isSubscribed}
                isSupported={isSupported}
                supportCount={supportCount}
              />
            </div>

            {association.tags?.length ? (
              <div className="flex flex-wrap gap-2">
                {association.tags.map((tag) => (
                  <PillBadge key={tag.id} tone="accent">
                    {tag.label}
                  </PillBadge>
                ))}
              </div>
            ) : null}

            {association.departments?.length ? (
              <div className="flex flex-wrap gap-2 md:hidden">
                {association.departments.map((department) => (
                  <PillBadge key={department.code}>
                    {department.name} · {department.code}
                  </PillBadge>
                ))}
              </div>
            ) : null}
          </header>

          <SurfacePanel as="section" className="rounded-2xl p-6">
            <h2 className="text-sm font-medium text-white/80">Description</h2>
            <p className="mt-2 leading-relaxed text-white/70">
              {association.description || "Aucune description."}
            </p>
          </SurfacePanel>

          {hasPublicInfo ? (
            <SurfacePanel as="section" className="rounded-2xl p-6">
              <h2 className="text-sm font-medium text-white/80">Informations pratiques</h2>

              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                {hasText(phoneNumber) ? (
                  <div>
                    <dt className="text-xs font-medium uppercase text-white/45">Téléphone</dt>
                    <dd className="mt-1 text-sm text-white/78">
                      <a
                        href={`tel:${phoneNumber}`}
                        className="underline-offset-2 hover:text-white hover:underline"
                      >
                        {phoneNumber}
                      </a>
                    </dd>
                  </div>
                ) : null}

                {hasText(contactEmail) ? (
                  <div>
                    <dt className="text-xs font-medium uppercase text-white/45">Email</dt>
                    <dd className="mt-1 text-sm text-white/78">
                      <a
                        href={`mailto:${contactEmail}`}
                        className="underline-offset-2 hover:text-white hover:underline"
                      >
                        {contactEmail}
                      </a>
                    </dd>
                  </div>
                ) : null}

                {hasText(websiteUrl) ? (
                  <div>
                    <dt className="text-xs font-medium uppercase text-white/45">Site internet</dt>
                    <dd className="mt-1 text-sm text-white/78">
                      <a
                        href={websiteHref(websiteUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="break-words underline-offset-2 hover:text-white hover:underline"
                      >
                        {websiteUrl}
                      </a>
                    </dd>
                  </div>
                ) : null}

                {hasText(rnaNumber) ? (
                  <div>
                    <dt className="text-xs font-medium uppercase text-white/45">RNA</dt>
                    <dd className="mt-1 text-sm text-white/78">{rnaNumber}</dd>
                  </div>
                ) : null}

                {hasText(address) ? (
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-medium uppercase text-white/45">Adresse</dt>
                    <dd className="mt-1 whitespace-pre-wrap text-sm text-white/78">
                      {address}
                    </dd>
                  </div>
                ) : null}

                {hasText(donationUseDescription) ? (
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-medium uppercase text-white/45">
                      Utilisation des dons
                    </dt>
                    <dd className="mt-1 whitespace-pre-wrap text-sm leading-6 text-white/78">
                      {donationUseDescription}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </SurfacePanel>
          ) : null}

          <div className="grid gap-6 md:grid-cols-[18rem_minmax(0,1fr)]">
            <section className="hidden rounded-2xl border border-white/10 bg-[rgba(24,28,36,0.84)] p-4 md:block md:self-start">
              <h2 className="text-sm font-semibold text-white">Départements</h2>

              {association.departments?.length ? (
                <ul className="mt-3 space-y-2">
                  {association.departments.map((department) => (
                    <li
                      key={department.code}
                      className="rounded-xl border border-white/8 bg-white/3 px-3 py-2 text-left text-sm text-white/78"
                    >
                      <span className="block truncate text-white/88">{department.name}</span>
                      <span className="mt-0.5 block truncate text-xs text-white/45">
                        {department.code}
                        {department.region?.name ? ` · ${department.region.name}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-white/60">Aucun département.</p>
              )}
            </section>

            <section className="space-y-3">
              <div className="text-center">
                <h2 className="text-lg font-semibold text-white">Posts</h2>
                <p className="mt-1 text-xs text-white/55">
                  {posts.totalElements} post{posts.totalElements > 1 ? "s" : ""}
                </p>
              </div>

              {posts.content.length === 0 ? (
                <SurfacePanel as="article" className="rounded-xl p-4">
                  <p className="text-sm text-white/60">Aucun post pour cette association.</p>
                </SurfacePanel>
              ) : (
                posts.content.map((post) => {
                  const published = toDateLabel(getPostDate(post))

                  return (
                    <SurfacePanel key={post.id} as="article" className="rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <h3 className="text-base font-semibold text-white">{post.title}</h3>
                      </div>

                      {published ? (
                        <p className="mt-1 text-xs text-white/50">Publié le {published}</p>
                      ) : null}

                      {post.contentRenderedHtml ? (
                        <div
                          className="post-content mt-3"
                          dangerouslySetInnerHTML={{ __html: post.contentRenderedHtml }}
                        />
                      ) : (
                        <p className="post-content mt-3 whitespace-pre-wrap">
                          {post.contentSource}
                        </p>
                      )}
                    </SurfacePanel>
                  )
                })
              )}

              {posts.totalPages > 1 ? (
                <div className="pt-1 flex items-center justify-between gap-3">
                  {page > 0 ? (
                    <Link
                      href={buildAssociationPostsHref(id, page - 1, size)}
                      className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/80 transition hover:border-white/30 hover:text-white"
                    >
                      Page précédente
                    </Link>
                  ) : (
                    <span className="rounded-lg border border-white/8 px-3 py-1.5 text-sm text-white/35">
                      Page précédente
                    </span>
                  )}

                  <span className="text-xs text-white/55">
                    Page {posts.totalPages > 0 ? page + 1 : 0} / {posts.totalPages}
                  </span>

                  {page + 1 < posts.totalPages ? (
                    <Link
                      href={buildAssociationPostsHref(id, page + 1, size)}
                      className="rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/80 transition hover:border-white/30 hover:text-white"
                    >
                      Page suivante
                    </Link>
                  ) : (
                    <span className="rounded-lg border border-white/8 px-3 py-1.5 text-sm text-white/35">
                      Page suivante
                    </span>
                  )}
                </div>
              ) : null}
            </section>
          </div>
        </div>
      </main>
    )
  } catch (error) {
    unstable_rethrow(error)

    if (error instanceof Error) {
      return (
        <main className="app-shell-bg min-h-screen px-6 py-10">
          <div className="mx-auto w-full max-w-3xl">
            <SurfacePanel as="section" className="rounded-2xl p-6">
              <h1 className="text-xl font-semibold text-white">Association</h1>
              <p className="mt-3 text-sm text-red-200">{error.message}</p>
            </SurfacePanel>
          </div>
        </main>
      )
    }

    return (
      <main className="app-shell-bg min-h-screen px-6 py-10">
        <div className="mx-auto w-full max-w-3xl">
          <SurfacePanel as="section" className="rounded-2xl p-6">
            <h1 className="text-xl font-semibold text-white">Association</h1>
            <p className="mt-3 text-sm text-red-200">Impossible de contacter le serveur.</p>
          </SurfacePanel>
        </div>
      </main>
    )
  }
}
