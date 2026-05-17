import { ArrowRight, CalendarCheck, CarFront, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CarCard } from "@/components/car-card";
import { SiteLogo } from "@/components/site-logo";
import { formatPriceMAD } from "@/lib/format";
import { getFeaturedCars } from "@/lib/public-cars";
import { getSiteSettings } from "@/lib/site-settings";

export default async function Home() {
  const [featuredCars, settings] = await Promise.all([
    getFeaturedCars(3),
    getSiteSettings(),
  ]);
  const heroCar = featuredCars[0] ?? null;
  const heroImage = heroCar?.car_images[0] ?? null;

  return (
    <main className="min-h-screen bg-[#f7f3ed] text-[#3a444b]">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between border-b border-black/10 pb-5">
          <Link href="/">
            <SiteLogo city={settings.city} />
          </Link>
          <Link
            className="inline-flex h-11 items-center gap-2 rounded-md bg-[#3a444b] px-4 text-sm font-semibold text-white transition hover:bg-[#4b5660]"
            href="/voitures"
          >
            Voir les voitures
            <ArrowRight size={16} />
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-[#d6b98c] bg-white/70 px-3 py-2 text-sm font-medium text-[#7c2d12]">
              <CalendarCheck size={16} />
              Réservation simple, confirmation rapide
            </div>
            <h2 className="text-5xl font-black leading-[1.02] text-[#3a444b] sm:text-6xl lg:text-7xl">
              Location de voitures à {settings.city}.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#4b5563]">
              Choisissez votre voiture, envoyez une demande de réservation et
              payez en espèces au moment de la remise du véhicule.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#b45309] px-5 font-semibold text-white transition hover:bg-[#92400e]"
                href="/voitures"
              >
                Parcourir la flotte
                <CarFront size={18} />
              </Link>
              <a
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-black/15 bg-white px-5 font-semibold text-[#3a444b] transition hover:bg-[#f9fafb]"
                href="#contact"
              >
                Nous contacter
                <MapPin size={18} />
              </a>
            </div>
          </div>

          <div className="relative min-h-[430px] overflow-hidden rounded-lg bg-[#3a444b] shadow-2xl">
            {heroImage ? (
              <Image
                alt={heroImage.alt_text ?? "Voiture disponible chez Islamcars"}
                className="absolute inset-0 h-full w-full object-cover opacity-85"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                src={heroImage.image_url}
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center bg-[#2f3940] text-white/70">
                Les voitures arrivent bientôt
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <p className="text-sm uppercase tracking-[0.2em] text-white/70">
                À partir de
              </p>
              <p className="mt-1 text-4xl font-black">
                {heroCar ? formatPriceMAD(heroCar.daily_price) : "400 MAD"} /
                jour
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="voitures" className="bg-white px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b45309]">
                Flotte
              </p>
              <h2 className="mt-2 text-3xl font-black text-[#3a444b]">
                Voitures disponibles
              </h2>
            </div>
            <p className="max-w-xl text-[#4b5563]">
              Retrouvez une sélection de véhicules prêts pour vos déplacements
              à Agadir et ses alentours.
            </p>
          </div>

          {featuredCars.length ? (
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {featuredCars.map((car) => (
                <CarCard car={car} key={car.id} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-lg border border-dashed border-black/20 bg-[#f9fafb] p-8 text-center text-[#6b7280]">
              Aucune voiture disponible pour le moment.
            </div>
          )}

          <div className="mt-8">
            <Link
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-black/15 bg-white px-5 font-semibold text-[#3a444b] transition hover:bg-[#f9fafb]"
              href="/voitures"
            >
              Voir toute la flotte
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-[#3a444b] px-5 py-12 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-black">Paiement en espèces</h2>
            <p className="mt-2 text-white/70">
              La demande est confirmée par téléphone, email ou
              WhatsApp.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {settings.contact_phone ? (
              <a
                className="inline-flex h-12 items-center justify-center rounded-md bg-white px-5 font-semibold text-[#3a444b] transition hover:bg-[#f3f4f6]"
                href={`tel:${settings.contact_phone}`}
              >
                {settings.contact_phone}
              </a>
            ) : null}
            {settings.contact_email ? (
              <a
                className="inline-flex h-12 items-center justify-center rounded-md border border-white/20 px-5 font-semibold text-white transition hover:bg-white/10"
                href={`mailto:${settings.contact_email}`}
              >
                {settings.contact_email}
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
