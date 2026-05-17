import { Trash2 } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { CarForm } from "../car-form";
import { DeleteCarButton } from "../delete-car-button";
import { deleteCarImageAction, updateCarAction } from "../actions";

type EditCarPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
    updated?: string;
  }>;
};

type AdminCar = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  daily_price: number;
  fuel_type: string;
  transmission: string;
  seats: number;
  description: string | null;
  status: "available" | "reserved" | "unavailable" | "maintenance";
  featured: boolean;
  car_images: {
    id: string;
    image_url: string;
    alt_text: string | null;
    sort_order: number;
  }[];
};

export default async function EditCarPage({
  params,
  searchParams,
}: EditCarPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const { supabase } = await requireAdmin();
  const { data: car, error } = await supabase
    .from("cars")
    .select(
      "id,slug,brand,model,year,daily_price,fuel_type,transmission,seats,description,status,featured,car_images(id,image_url,alt_text,sort_order)",
    )
    .eq("id", id)
    .single<AdminCar>();

  if (error || !car) {
    notFound();
  }

  const images = [...(car.car_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order,
  );

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b45309]">
            Voitures
          </p>
          <h1 className="mt-2 text-3xl font-black">
            Modifier {car.brand} {car.model}
          </h1>
          <p className="mt-3 text-[#4b5563]">
            Modifie les informations, ajuste le prix ou ajoute de nouvelles
            photos sans créer une nouvelle voiture.
          </p>
        </div>
        <a
          className="inline-flex h-11 items-center rounded-md border border-black/10 bg-white px-4 text-sm font-bold transition hover:bg-[#f9fafb]"
          href={`/voitures/${car.slug}`}
          target="_blank"
        >
          Voir côté public
        </a>
      </div>

      {query.updated ? (
        <div className="mt-6 rounded-md border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
          Voiture mise à jour.
        </div>
      ) : null}

      {query.error ? (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          Impossible de mettre à jour la voiture. Vérifie les champs et les
          photos.
        </div>
      ) : null}

      <section className="mt-8 rounded-lg border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-bold">Photos existantes</h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              La première photo sert de miniature sur le site public.
            </p>
          </div>
          <p className="text-sm font-bold text-[#6b7280]">
            {images.length} photo{images.length > 1 ? "s" : ""}
          </p>
        </div>

        {images.length ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <div
                className="overflow-hidden rounded-lg border border-black/10 bg-white"
                key={image.id}
              >
                <div className="relative h-40 bg-[#f3f4f6]">
                  <Image
                    alt={image.alt_text ?? `${car.brand} ${car.model}`}
                    className="object-cover"
                    fill
                    sizes="(min-width: 1024px) 30vw, 100vw"
                    src={image.image_url}
                  />
                </div>
                <div className="p-3">
                  <form action={deleteCarImageAction}>
                    <input name="image_id" type="hidden" value={image.id} />
                    <input name="car_id" type="hidden" value={car.id} />
                    <input
                      name="image_url"
                      type="hidden"
                      value={image.image_url}
                    />
                    <button
                      className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 text-sm font-bold text-red-700 transition hover:bg-red-100"
                      type="submit"
                    >
                      <Trash2 size={15} />
                      Supprimer
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-md border border-dashed border-black/20 bg-[#f9fafb] p-5 text-sm text-[#6b7280]">
            Aucune photo pour cette voiture.
          </div>
        )}
      </section>

      <CarForm action={updateCarAction} car={car} submitLabel="Enregistrer" />

      <section className="mt-8 rounded-lg border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-black text-red-800">
          Supprimer la voiture
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-red-700">
          Cette action retire la voiture du site public et supprime ses photos.
          Elle est bloquée si des réservations sont encore liées à cette voiture.
        </p>
        <div className="mt-4">
          <DeleteCarButton
            carId={car.id}
            carLabel={`${car.brand} ${car.model}`}
            fullWidth
            slug={car.slug}
          />
        </div>
      </section>
    </div>
  );
}
