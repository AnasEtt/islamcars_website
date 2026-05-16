import Link from "next/link";
import type { ReactNode } from "react";

type CarFormValues = {
  id?: string;
  slug?: string;
  brand?: string;
  model?: string;
  year?: number;
  daily_price?: number;
  fuel_type?: string;
  transmission?: string;
  seats?: number;
  description?: string | null;
  status?: "available" | "reserved" | "unavailable" | "maintenance";
  featured?: boolean;
};

export function CarForm({
  action,
  car,
  submitLabel,
  children,
}: {
  action: (formData: FormData) => void | Promise<void>;
  car?: CarFormValues;
  submitLabel: string;
  children?: ReactNode;
}) {
  return (
    <form
      action={action}
      className="mt-8 rounded-lg border border-black/10 bg-white p-6 shadow-sm"
    >
      {car?.id ? <input name="id" type="hidden" value={car.id} /> : null}
      {car?.slug ? <input name="slug" type="hidden" value={car.slug} /> : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          defaultValue={car?.brand}
          label="Marque"
          name="brand"
          placeholder="Renault"
        />
        <Field
          defaultValue={car?.model}
          label="Modèle"
          name="model"
          placeholder="Clio 5"
        />
        <Field
          defaultValue={car?.year}
          label="Année"
          name="year"
          placeholder="2022"
          type="number"
        />
        <Field
          defaultValue={car?.daily_price}
          label="Prix par jour"
          name="daily_price"
          placeholder="400"
          type="number"
        />
        <Field
          defaultValue={car?.fuel_type}
          label="Carburant"
          name="fuel_type"
          placeholder="Diesel"
        />
        <Field
          defaultValue={car?.transmission}
          label="Transmission"
          name="transmission"
          placeholder="Manuelle"
        />
        <Field
          defaultValue={car?.seats}
          label="Places"
          name="seats"
          placeholder="5"
          type="number"
        />

        <label className="block text-sm font-semibold">
          Statut
          <select
            className="mt-2 h-11 w-full rounded-md border border-black/15 bg-white px-3 outline-none transition focus:border-[#b45309] focus:ring-2 focus:ring-[#facc15]/30"
            defaultValue={car?.status ?? "available"}
            name="status"
            required
          >
            <option value="available">Disponible</option>
            <option value="reserved">Réservée</option>
            <option value="unavailable">Indisponible</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </label>
      </div>

      <label className="mt-5 block text-sm font-semibold">
        Description
        <textarea
          className="mt-2 min-h-28 w-full rounded-md border border-black/15 px-3 py-3 outline-none transition focus:border-[#b45309] focus:ring-2 focus:ring-[#facc15]/30"
          defaultValue={car?.description ?? ""}
          name="description"
          placeholder="Description courte de la voiture"
        />
      </label>

      {children}

      <label className="mt-5 block text-sm font-semibold">
        Ajouter des photos
        <input
          accept="image/*"
          className="mt-2 w-full rounded-md border border-dashed border-black/20 bg-[#f9fafb] px-3 py-4 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-[#111827] file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
          multiple
          name="images"
          type="file"
        />
        <span className="mt-2 block text-xs font-normal text-[#6b7280]">
          Tu peux ajouter plusieurs photos. Elles seront stockées dans le bucket
          `car-images`.
        </span>
      </label>

      <label className="mt-5 flex items-center gap-3 text-sm font-semibold">
        <input
          className="h-4 w-4"
          defaultChecked={car?.featured ?? false}
          name="featured"
          type="checkbox"
        />
        Mettre en avant sur l&apos;accueil
      </label>

      <div className="mt-8 flex gap-3">
        <button
          className="h-11 rounded-md bg-[#111827] px-5 text-sm font-bold text-white transition hover:bg-[#374151]"
          type="submit"
        >
          {submitLabel}
        </button>
        <Link
          className="inline-flex h-11 items-center rounded-md border border-black/10 bg-white px-5 text-sm font-bold transition hover:bg-[#f9fafb]"
          href="/admin/voitures"
        >
          Annuler
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  defaultValue,
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  defaultValue?: string | number;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        className="mt-2 h-11 w-full rounded-md border border-black/15 px-3 outline-none transition focus:border-[#b45309] focus:ring-2 focus:ring-[#facc15]/30"
        defaultValue={defaultValue}
        name={name}
        placeholder={placeholder}
        required
        type={type}
      />
    </label>
  );
}
