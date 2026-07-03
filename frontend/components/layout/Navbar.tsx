"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogOut,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "lucide-react";

import { APP_NAME } from "@/lib/constants";
import { ROUTES } from "@/lib/routes";
import useAuth from "@/hooks/useAuth";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { href: ROUTES.LISTINGS, label: "Listings" },
  { href: ROUTES.BUYER, label: "Buyer" },
  { href: ROUTES.SELLER, label: "Seller" },
  { href: ROUTES.ORDERS, label: "Orders" },
];

export default function Navbar() {
  const router = useRouter();
  const { isLoggedIn, user, logout, loading } = useAuth();
  const { items } = useCart();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  async function handleLogout() {
    await logout();
    router.push(ROUTES.LOGIN);
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("q") as HTMLInputElement;
    const q = input.value.trim();
    router.push(q ? `${ROUTES.SEARCH}?q=${encodeURIComponent(q)}` : ROUTES.SEARCH);
  }

  return (
    <header className="sticky top-0 z-40 shadow-sm">
      {/* Row 1 — brand + search + cart/user */}
      <div className="bg-teal-deep text-white">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 md:gap-6 md:px-6">
          <Link
            href={ROUTES.HOME}
            className="text-xl font-bold tracking-wide md:text-2xl"
          >
            {APP_NAME}
          </Link>

          <form
            onSubmit={handleSearch}
            className="hidden flex-1 md:flex md:justify-center"
            role="search"
          >
            <div className="relative w-full max-w-xl">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                aria-hidden="true"
              />
              <input
                name="q"
                type="search"
                placeholder="Search products..."
                className="w-full rounded-full bg-white py-2 pl-10 pr-4 text-sm text-teal-deep placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal-orange"
              />
            </div>
          </form>

          <div className="ml-auto flex items-center gap-3 md:gap-4">
            <Link
              href={ROUTES.CART}
              className="relative inline-flex items-center rounded-full p-2 hover:bg-white/10"
              aria-label="Cart"
            >
              <ShoppingCart className="h-5 w-5" aria-hidden="true" />
              {items.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-signal-orange px-1 text-[10px] font-semibold leading-none text-white">
                  {items.length}
                </span>
              )}
            </Link>

            {!loading && (
              <UserMenu
                isLoggedIn={isLoggedIn}
                email={user?.email}
                onLogout={handleLogout}
              />
            )}

            <button
              type="button"
              onClick={() => setMobileNavOpen((v) => !v)}
              className="inline-flex items-center rounded-md p-2 hover:bg-white/10 md:hidden"
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileNavOpen}
            >
              {mobileNavOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile search — always visible below brand row on small screens */}
        <form
          onSubmit={handleSearch}
          className="px-4 pb-3 md:hidden"
          role="search"
        >
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
              aria-hidden="true"
            />
            <input
              name="q"
              type="search"
              placeholder="Search products..."
              className="w-full rounded-full bg-white py-2 pl-10 pr-4 text-sm text-teal-deep placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-signal-orange"
            />
          </div>
        </form>
      </div>

      {/* Row 2 — secondary nav links */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center px-4 md:px-6">
          <ul className="hidden gap-6 py-2 text-sm font-medium text-teal-deep md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-md px-2 py-1 hover:bg-gray-100 hover:text-teal-mid"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {mobileNavOpen && (
            <ul className="flex w-full flex-col gap-1 py-2 text-sm font-medium text-teal-deep md:hidden">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileNavOpen(false)}
                    className="block rounded-md px-3 py-2 hover:bg-gray-100 hover:text-teal-mid"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
}

// -----------------------------------------------------------------------------

function UserMenu({
  isLoggedIn,
  email,
  onLogout,
}: {
  isLoggedIn: boolean;
  email?: string | null;
  onLogout: () => void;
}) {
  if (!isLoggedIn) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Link
          href={ROUTES.LOGIN}
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-white/10"
        >
          <User className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Login</span>
        </Link>
        <Link
          href={ROUTES.SIGNUP}
          className="hidden rounded-full bg-signal-orange px-3 py-1 text-xs font-semibold hover:brightness-90 sm:inline-block"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className="hidden max-w-[10rem] truncate text-white/80 lg:inline"
        title={email ?? undefined}
      >
        {email}
      </span>
      <button
        type="button"
        onClick={onLogout}
        className="inline-flex items-center gap-1 rounded-md px-2 py-1 hover:bg-white/10"
        aria-label="Log out"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>
  );
}
