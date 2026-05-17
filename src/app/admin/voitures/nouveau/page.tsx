import { CarForm } from "../car-form";
import { createCarAction } from "../actions";

type NewCarPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewCarPage({ searchParams }: NewCarPageProps) {
  const params = await searchParams;

  return (
    <div className="max-w-3xl">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b45309]">
          Voitures
        </p>
        <h1 className="mt-2 text-3xl font-black">Ajouter une voiture</h1>
        <p className="mt-3 text-[#4b5563]">
          Ajoute la fiche voiture, le prix, les options et les photos visibles
          sur le site public.
        </p>
      </div>

      {params.error ? (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          Impossible d&apos;ajouter la voiture. Vérifie les champs, les photos et
          réessaie.
        </div>
      ) : null}

      <CarForm action={createCarAction} submitLabel="Ajouter" />
    </div>
  );
}
