import {
  CalendarDays,
  CarFront,
  Gauge,
  LogOut,
  Settings,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { SiteLogo } from "@/components/site-logo";
import { requireAdmin } from "@/lib/admin";
import { signOutAction } from "../connexion/actions";

const navItems = [
  { href: "/admin", label: "Tableau de bord", icon: Gauge },
  { href: "/admin/voitures", label: "Voitures", icon: CarFront },
  { href: "/admin/reservations", label: "Réservations", icon: CalendarDays },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { profile } = await requireAdmin();

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#3a444b]">
      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-black/10 bg-white p-5 lg:block">
        <Link className="flex items-center gap-3" href="/">
          <SiteLogo context="Admin" />
        </Link>

        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                className="flex h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold text-[#4b5660] transition hover:bg-[#f3f4f6] hover:text-[#3a444b]"
                href={item.href}
                key={item.href}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-5 right-5">
          <div className="rounded-md bg-[#f3f4f6] p-3">
            <p className="text-sm font-bold">{profile.email}</p>
            <p className="text-xs uppercase tracking-[0.16em] text-[#6b7280]">
              {profile.role}
            </p>
          </div>
          <form action={signOutAction}>
            <button
              className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-md border border-black/10 bg-white text-sm font-bold transition hover:bg-[#f9fafb]"
              type="submit"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      <header className="sticky top-0 z-10 border-b border-black/10 bg-white px-5 py-4 lg:hidden">
        <div className="flex items-center justify-between">
          <Link className="font-black" href="/admin">
            Islamcars Admin
          </Link>
          <form action={signOutAction}>
            <button className="text-sm font-bold" type="submit">
              Déconnexion
            </button>
          </form>
        </div>
        <nav className="mt-4 grid grid-cols-2 gap-2">
          {navItems.map((item) => (
            <Link
              className="rounded-md bg-[#f3f4f6] px-2 py-2 text-center text-xs font-bold"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="lg:pl-72">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">{children}</div>
      </main>
    </div>
  );
}
