import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { formatPriceMAD } from "@/lib/format";
import { DeleteCarButton } from "./delete-car-button";

type CarRow = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  daily_price: number;
  fuel_type: string;
  transmission: string;
  seats: number;
  status: "available" | "reserved" | "unavailable" | "maintenance";
  featured: boolean;
  car_images: {
    image_url: string;
  }[];
};

type AdminCarsPageProps = {
  searchParams: Promise<{
    deleted?: string;
    error?: string;
  }>;
};

const statusLabels: Record<CarRow["status"], string> = {
  available: "Disponible",
  reserved: "Réservée",
  unavailable: "Indisponible",
  maintenance: "Maintenance",
};

const errorMessages: Record<string, string> = {
  delete: "Impossible de supprimer cette voiture.",
  missing: "Voiture introuvable.",
  reservations:
    "Cette voiture a des reservations liees. Termine ou supprime d'abord ces reservations avant de supprimer la voiture.",
};

export default async function AdminCarsPage({
  searchParams,
}: AdminCarsPageProps) {
  const params = await searchParams;
  const { supabase } = await requireAdmin();
  const { data: cars, error } = await supabase
    .from("cars")
    .select(
      "id,slug,brand,model,year,daily_price,fuel_type,transmission,seats,status,featured,car_images(image_url)",
    )
    .order("created_at", { ascending: false })
    .returns<CarRow[]>();

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b45309]">
            Gestion
          </p>
          <h1 className="mt-2 text-3xl font-black">Voitures</h1>
        </div>
        <Link
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#3a444b] px-4 text-sm font-bold text-white transition hover:bg-[#4b5660]"
          href="/admin/voitures/nouveau"
        >
          <Plus size={17} />
          Nouvelle voiture
        </Link>
      </div>

      {error ? (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          Impossible de charger les voitures.
        </div>
      ) : null}

      {params.deleted ? (
        <div className="mt-6 rounded-md border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
          Voiture supprimée.
        </div>
      ) : null}

      {params.error ? (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          {errorMessages[params.error] ?? "Une erreur est survenue."}
        </div>
      ) : null}

      <div className="mt-8 overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] border-collapse text-left text-sm">
            <thead className="bg-[#f9fafb] text-xs uppercase tracking-[0.14em] text-[#6b7280]">
              <tr>
                <th className="px-4 py-3">Voiture</th>
                <th className="px-4 py-3">Prix</th>
                <th className="px-4 py-3">Détails</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Accueil</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {(cars ?? []).map((car) => (
                <tr key={car.id}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-20 overflow-hidden rounded-md bg-[#f3f4f6]">
                        {car.car_images?.[0]?.image_url ? (
                          <Image
                            alt={`${car.brand} ${car.model}`}
                            className="object-cover"
                            fill
                            sizes="80px"
                            src={car.car_images[0].image_url}
                          />
                        ) : null}
                      </div>
                      <div>
                        <p className="font-bold">
                          {car.brand} {car.model}
                        </p>
                        <p className="text-[#6b7280]">{car.year}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-bold">
                    {formatPriceMAD(car.daily_price)}
                  </td>
                  <td className="px-4 py-4 text-[#4b5563]">
                    {car.fuel_type} - {car.transmission} - {car.seats} places
                  </td>
                  <td className="px-4 py-4">
                    <span className="rounded-md bg-[#f3f4f6] px-2 py-1 text-xs font-bold">
                      {statusLabels[car.status]}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {car.featured ? "Oui" : "Non"}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        className="inline-flex h-9 items-center rounded-md border border-black/10 px-3 text-sm font-bold transition hover:bg-[#f9fafb]"
                        href={`/admin/voitures/${car.id}`}
                      >
                        Modifier
                      </Link>
                      <DeleteCarButton
                        carId={car.id}
                        carLabel={`${car.brand} ${car.model}`}
                        slug={car.slug}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {!cars?.length ? (
                <tr>
                  <td className="px-4 py-8 text-center text-[#6b7280]" colSpan={6}>
                    Aucune voiture pour le moment.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
