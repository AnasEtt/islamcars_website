import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { PublicCar } from "@/lib/public-cars";
import { formatPriceMAD } from "@/lib/format";

const statusLabels: Record<PublicCar["status"], string> = {
  available: "Disponible",
  reserved: "Réservée",
};

export function CarCard({ car }: { car: PublicCar }) {
  const image = car.car_images[0];

  return (
    <article className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link className="block" href={`/voitures/${car.slug}`}>
        <div className="relative h-56 w-full bg-[#f3f4f6]">
          {image ? (
            <Image
              alt={image.alt_text ?? `${car.brand} ${car.model}`}
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              src={image.image_url}
            />
          ) : (
            <div className="grid h-full place-items-center text-sm font-semibold text-[#6b7280]">
              Photo à venir
            </div>
          )}
        </div>
      </Link>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-[#3a444b]">
              {car.brand} {car.model}
            </h3>
            <p className="text-sm text-[#6b7280]">
              {car.year} - {car.fuel_type} - {car.transmission}
            </p>
          </div>
          <span className="rounded-md bg-[#ecfdf5] px-2 py-1 text-xs font-bold text-[#047857]">
            {statusLabels[car.status]}
          </span>
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-black/10 pt-4">
          <div>
            <p className="text-2xl font-black text-[#3a444b]">
              {formatPriceMAD(car.daily_price)}
            </p>
            <p className="text-sm text-[#6b7280]">par jour</p>
          </div>
          <Link
            className="inline-flex h-10 items-center gap-2 rounded-md bg-[#3a444b] px-3 text-sm font-bold text-white transition hover:bg-[#4b5660]"
            href={`/voitures/${car.slug}`}
          >
            Détails
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  );
}
