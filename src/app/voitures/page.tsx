import { CarFront } from "lucide-react";
import Link from "next/link";
import { CarCard } from "@/components/car-card";
import { getPublicCars } from "@/lib/public-cars";
import { getSiteSettings } from "@/lib/site-settings";

export const metadata = {
  title: "Voitures disponibles - Islamcars",
  description: "Consultez les voitures disponibles à la location à Agadir.",
};

export default async function CarsPage() {
  const [cars, settings] = await Promise.all([
    getPublicCars(),
    getSiteSettings(),
  ]);

  return (
    <main className="min-h-screen bg-[#f7f3ed] text-[#111827]">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <Link href="/">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#b45309]">
              {settings.city}
            </p>
            <p className="text-2xl font-bold">{settings.agency_name}</p>
          </Link>
          <Link
            className="rounded-md bg-[#111827] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#374151]"
            href="/connexion"
          >
            Admin
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-[#d6b98c] bg-white px-3 py-2 text-sm font-medium text-[#7c2d12]">
              <CarFront size={16} />
              Flotte en temps réel
            </div>
            <h1 className="text-4xl font-black sm:text-5xl">
              Voitures disponibles
            </h1>
            <p className="mt-4 max-w-2xl leading-7 text-[#4b5563]">
              Toutes les voitures affichées ici viennent de Supabase. Le gérant
              peut les ajouter et les mettre à jour depuis l&apos;interface admin.
            </p>
          </div>
          <p className="rounded-md bg-white px-4 py-3 text-sm font-bold shadow-sm">
            {cars.length} voiture{cars.length > 1 ? "s" : ""}
          </p>
        </div>

        {cars.length ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {cars.map((car) => (
              <CarCard car={car} key={car.id} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-lg border border-dashed border-black/20 bg-white p-8 text-center text-[#6b7280]">
            Aucune voiture disponible pour le moment.
          </div>
        )}
      </section>
    </main>
  );
}
