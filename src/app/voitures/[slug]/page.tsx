import { ArrowLeft, CalendarCheck, Fuel, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteLogo } from "@/components/site-logo";
import { formatPriceMAD } from "@/lib/format";
import { getPublicCarBySlug } from "@/lib/public-cars";
import { getSiteSettings } from "@/lib/site-settings";
import { createReservationAction } from "./actions";

type CarDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    notification?: string;
    reservation?: string;
  }>;
};

export async function generateMetadata({ params }: CarDetailPageProps) {
  const { slug } = await params;
  const car = await getPublicCarBySlug(slug);

  if (!car) {
    return {
      title: "Voiture introuvable - Islamcars",
    };
  }

  return {
    title: `${car.brand} ${car.model} - Islamcars`,
    description:
      car.description ??
      `Location ${car.brand} ${car.model} à Agadir avec paiement en espèces.`,
  };
}

const reservationMessages: Record<string, string> = {
  dates: "La date de fin doit être après la date de début.",
  error: "Impossible d'envoyer la demande. Réessaie dans quelques instants.",
  validation: "Vérifie les informations du formulaire.",
};

export default async function CarDetailPage({
  params,
  searchParams,
}: CarDetailPageProps) {
  const { slug } = await params;
  const query = searchParams ? await searchParams : {};
  const [car, settings] = await Promise.all([
    getPublicCarBySlug(slug),
    getSiteSettings(),
  ]);

  if (!car) {
    notFound();
  }

  const mainImage = car.car_images[0] ?? null;
  const gallery = car.car_images.slice(1);

  return (
    <main className="min-h-screen bg-[#f7f3ed] text-[#3a444b]">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
          <Link href="/">
            <SiteLogo city={settings.city} />
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-md border border-black/10 px-4 py-2 text-sm font-bold transition hover:bg-[#f9fafb]"
            href="/voitures"
          >
            <ArrowLeft size={16} />
            Retour
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <div>
          <div className="relative min-h-[360px] overflow-hidden rounded-lg bg-[#3a444b] shadow-xl sm:min-h-[520px]">
            {mainImage ? (
              <Image
                alt={mainImage.alt_text ?? `${car.brand} ${car.model}`}
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                src={mainImage.image_url}
              />
            ) : (
              <div className="grid h-full min-h-[360px] place-items-center text-white/70">
                Photo à venir
              </div>
            )}
          </div>

          {gallery.length ? (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {gallery.map((image) => (
                <div
                  className="relative h-28 overflow-hidden rounded-md bg-[#f3f4f6]"
                  key={image.image_url}
                >
                  <Image
                    alt={image.alt_text ?? `${car.brand} ${car.model}`}
                    className="object-cover"
                    fill
                    sizes="33vw"
                    src={image.image_url}
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <aside className="self-start rounded-lg border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b45309]">
            {car.status === "available" ? "Disponible" : "Réservée"}
          </p>
          <h1 className="mt-3 text-4xl font-black">
            {car.brand} {car.model}
          </h1>
          <p className="mt-2 text-[#6b7280]">{car.year}</p>

          <div className="mt-6 rounded-lg bg-[#f7f3ed] p-4">
            <p className="text-sm font-semibold text-[#6b7280]">Prix</p>
            <p className="mt-1 text-4xl font-black">
              {formatPriceMAD(car.daily_price)}
            </p>
            <p className="text-sm text-[#6b7280]">par jour</p>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Info
              icon={<Fuel size={18} />}
              label="Carburant"
              value={car.fuel_type}
            />
            <Info
              icon={<CalendarCheck size={18} />}
              label="Boîte"
              value={car.transmission}
            />
            <Info
              icon={<Users size={18} />}
              label="Places"
              value={`${car.seats}`}
            />
          </div>

          <div className="mt-6 border-t border-black/10 pt-6">
            <h2 className="font-bold">Description</h2>
            <p className="mt-2 leading-7 text-[#4b5563]">
              {car.description ??
                `Cette voiture est disponible à la location chez ${settings.agency_name} à ${settings.city}.`}
            </p>
          </div>

          <div className="mt-6 rounded-md border border-[#d6b98c] bg-[#fffbeb] p-4 text-sm leading-6 text-[#7c2d12]">
            Paiement uniquement en espèces. La réservation sera confirmée par téléphone, email ou WhatsApp.
          </div>

          {query.reservation === "success" ? (
            <div className="mt-6 rounded-md border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
              Demande envoyée. Le gérant va vous recontacter pour confirmer la
              réservation.
              {query.notification === "failed" ? (
                <span className="mt-2 block">
                  La demande est bien enregistrée, mais l&apos;email automatique
                  n&apos;a pas pu partir.
                </span>
              ) : null}
            </div>
          ) : null}

          {query.reservation && query.reservation !== "success" ? (
            <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              {reservationMessages[query.reservation] ??
                "Impossible d'envoyer la demande."}
            </div>
          ) : null}

          <form action={createReservationAction} className="mt-6 space-y-4">
            <input name="car_id" type="hidden" value={car.id} />
            <input name="car_slug" type="hidden" value={car.slug} />
            <input
              name="car_label"
              type="hidden"
              value={`${car.brand} ${car.model}`}
            />

            <Field label="Nom complet" name="customer_name" required />
            <Field label="Email" name="customer_email" required type="email" />
            <Field label="Téléphone" name="customer_phone" required />

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Date de début"
                name="start_date"
                required
                type="date"
              />
              <Field
                label="Date de fin"
                name="end_date"
                required
                type="date"
              />
            </div>

            <label className="block text-sm font-semibold">
              Message
              <textarea
                className="mt-2 min-h-24 w-full rounded-md border border-black/15 px-3 py-3 outline-none transition focus:border-[#b45309] focus:ring-2 focus:ring-[#facc15]/30"
                name="message"
                placeholder="Lieu de livraison, heure souhaitée, question..."
              />
            </label>

            <button
              className="h-12 w-full rounded-md bg-[#3a444b] font-bold text-white transition hover:bg-[#4b5660]"
              type="submit"
            >
              Demander une réservation
            </button>
          </form>
        </aside>
      </section>
    </main>
  );
}

function Field({
  label,
  name,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        className="mt-2 h-11 w-full rounded-md border border-black/15 px-3 outline-none transition focus:border-[#b45309] focus:ring-2 focus:ring-[#facc15]/30"
        name={name}
        required={required}
        type={type}
      />
    </label>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-black/10 p-3">
      <div className="text-[#b45309]">{icon}</div>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#6b7280]">
        {label}
      </p>
      <p className="mt-1 font-bold">{value}</p>
    </div>
  );
}
