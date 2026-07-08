"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import type { AccountType } from "@/types/auth"

type Props = {
  isAuthenticated: boolean
  accountType: AccountType | null
}

type NavItem = {
  label: string
  href: string
  isActive: (pathname: string) => boolean
}

type ActionItem = {
  label: string
  href: string
  prefetch?: boolean
  forceDocumentNavigation?: boolean
}

function buildCenterItems(accountType: AccountType | null): NavItem[] {
  const feedOrPublishHref = accountType === "ASSOCIATION" ? "/publish" : "/flux"
  const feedOrPublishLabel = accountType === "ASSOCIATION" ? "Publier" : "Flux"

  return [
    {
      label: "Accueil",
      href: "/",
      isActive: (pathname) => pathname === "/",
    },
    {
      label: "Associations",
      href: "/associations",
      isActive: (pathname) =>
        pathname === "/associations" || pathname.startsWith("/association/"),
    },
    {
      label: feedOrPublishLabel,
      href: feedOrPublishHref,
      isActive: (pathname) =>
        pathname === "/flux" ||
        pathname.startsWith("/flux/") ||
        pathname === "/publish" ||
        pathname.startsWith("/publish/"),
    },
  ]
}

const hiddenRoutes = new Set(["/auth/login", "/auth/register"])

export default function AppHeader({ isAuthenticated, accountType }: Props) {
  const pathname = usePathname() ?? "/"

  if (hiddenRoutes.has(pathname)) {
    return null
  }

  return (
    <AppHeaderContent
      key={pathname}
      pathname={pathname}
      isAuthenticated={isAuthenticated}
      accountType={accountType}
    />
  )
}

function AppHeaderContent({
  isAuthenticated,
  accountType,
  pathname,
}: Props & { pathname: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const centerItems = buildCenterItems(accountType)

  const navLinkClass = (active: boolean) =>
    "rounded-full px-3.5 py-1.5 text-[17px] font-medium transition-all duration-150 active:scale-[0.98] " +
    (active
      ? "bg-white/18 text-white font-semibold"
      : "text-white/75 hover:bg-white/10 hover:text-white/95")

  const rightItems: ActionItem[] = isAuthenticated
    ? [
        { label: "Profil", href: "/profile" },
        { label: "Déconnexion", href: "/auth/logout", prefetch: false, forceDocumentNavigation: true },
      ]
    : [
        { label: "Inscription", href: "/auth/register" },
        { label: "Connexion", href: "/auth/login" },
      ]

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-(--app-header-height) border-b border-white/20 bg-[#15181e] shadow-[0_10px_30px_rgba(0,0,0,0.22)]">
        <div className="relative flex h-full w-full items-center px-4 sm:px-6 lg:px-8">
          <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-8 lg:flex">
            {centerItems.map((item) => {
              const active = item.isActive(pathname)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  scroll
                  className={navLinkClass(active)}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="absolute right-4 top-1/2 hidden -translate-y-1/2 items-center justify-end gap-6 sm:right-6 lg:flex lg:right-8">
            {rightItems.map((item) => {
              const active = pathname === item.href

              if (item.forceDocumentNavigation) {
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={navLinkClass(active)}
                  >
                    {item.label}
                  </a>
                )
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={item.prefetch}
                  scroll
                  className={navLinkClass(active)}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="flex items-center justify-end lg:hidden">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-md border border-white/25 px-3 py-2 text-sm font-medium text-white/90 transition hover:border-white/40 hover:text-white"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-header-menu"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
            >
              <span>Menu</span>
              <span className="flex w-4 flex-col gap-1">
                <span className="h-px w-full bg-white/90" />
                <span className="h-px w-full bg-white/90" />
                <span className="h-px w-full bg-white/90" />
              </span>
            </button>
          </div>

          {isMobileMenuOpen ? (
            <div
              id="mobile-header-menu"
              className="absolute inset-x-4 top-[calc(100%-0.25rem)] space-y-2 rounded-lg border border-white/20 bg-[#15181e] p-3 shadow-[0_20px_45px_rgba(0,0,0,0.3)] lg:hidden sm:inset-x-6"
            >
              {centerItems.map((item) => {
                const active = item.isActive(pathname)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    scroll
                    className={
                      "block rounded-xl px-3 py-2 text-base font-medium transition-all duration-150 active:scale-[0.99] " +
                      (active
                        ? "bg-white/18 text-white font-semibold"
                        : "text-white/75 hover:bg-white/10 hover:text-white/95")
                    }
                  >
                    {item.label}
                  </Link>
                )
              })}

              <div className="my-2 h-px w-full bg-white/20" />

              {rightItems.map((item) => {
                const active = pathname === item.href

                if (item.forceDocumentNavigation) {
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className={
                        "block rounded-xl px-3 py-2 text-base font-medium transition-all duration-150 active:scale-[0.99] " +
                        (active
                          ? "bg-white/18 text-white font-semibold"
                          : "text-white/75 hover:bg-white/10 hover:text-white/95")
                      }
                    >
                      {item.label}
                    </a>
                  )
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={item.prefetch}
                    scroll
                    className={
                      "block rounded-xl px-3 py-2 text-base font-medium transition-all duration-150 active:scale-[0.99] " +
                      (active
                        ? "bg-white/18 text-white font-semibold"
                        : "text-white/75 hover:bg-white/10 hover:text-white/95")
                    }
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          ) : null}
        </div>
      </header>
      <div className="h-(--app-header-height)" aria-hidden="true" />
    </>
  )
}
