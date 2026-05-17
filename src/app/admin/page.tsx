import { CalendarClock, CarFront, CheckCircle2, Clock3 } from "lucide-react";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";

async function countRows(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  table: "cars" | "reservations",
  column?: string,
  value?: string,
) {
  let query = supabase.from(table).select("id", {
    count: "exact",
    head: true,
  });

  if (column && value) {
    query = query.eq(column, value);
  }

  const { count } = await query;
  return count ?? 0;
}

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();

  const [carsCount, availableCars, pendingReservations, confirmedReservations] =
    await Promise.all([
      countRows(supabase, "cars"),
      countRows(supabase, "cars", "status", "available"),
      countRows(supabase, "reservations", "status", "pending"),
      countRows(supabase, "reservations", "status", "confirmed"),
    ]);

  const cards = [
    {
      label: "Voitures",
      value: carsCount,
      icon: CarFront,
      tone: "bg-[#eff6ff] text-[#1d4ed8]",
    },
    {
      label: "Disponibles",
      value: availableCars,
      icon: CheckCircle2,
      tone: "bg-[#ecfdf5] text-[#047857]",
    },
    {
      label: "Demandes en attente",
      value: pendingReservations,
      icon: Clock3,
      tone: "bg-[#fffbeb] text-[#b45309]",
    },
    {
      label: "Confirmées",
      value: confirmedReservations,
      icon: CalendarClock,
      tone: "bg-[#f5f3ff] text-[#6d28d9]",
    },
  ];

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b45309]">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-black">Tableau de bord</h1>
        </div>
        <Link
          className="inline-flex h-11 items-center justify-center rounded-md bg-[#3a444b] px-4 text-sm font-bold text-white transition hover:bg-[#4b5660]"
          href="/admin/voitures/nouveau"
        >
          Ajouter une voiture
        </Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              className="rounded-lg border border-black/10 bg-white p-5 shadow-sm"
              key={card.label}
            >
              <div
                className={`grid h-11 w-11 place-items-center rounded-md ${card.tone}`}
              >
                <Icon size={21} />
              </div>
              <p className="mt-5 text-3xl font-black">{card.value}</p>
              <p className="mt-1 text-sm font-semibold text-[#6b7280]">
                {card.label}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
