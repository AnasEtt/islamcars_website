import { getSiteSettings } from "@/lib/site-settings";
import { updateSettingsAction } from "./actions";

type SettingsPageProps = {
  searchParams: Promise<{
    error?: string;
    updated?: string;
  }>;
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const [settings, query] = await Promise.all([
    getSiteSettings(),
    searchParams,
  ]);

  return (
    <div className="max-w-3xl">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b45309]">
          Site
        </p>
        <h1 className="mt-2 text-3xl font-black">Paramètres</h1>
        <p className="mt-3 text-[#4b5563]">
          Modifie les informations publiques de l&apos;agence : contact,
          WhatsApp, adresse, horaires et zone de service.
        </p>
      </div>

      {query.updated ? (
        <div className="mt-6 rounded-md border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
          Informations mises à jour.
        </div>
      ) : null}

      {query.error ? (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          Impossible d&apos;enregistrer les informations. Vérifie les champs.
        </div>
      ) : null}

      <form
        action={updateSettingsAction}
        className="mt-8 rounded-lg border border-black/10 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            defaultValue={settings.agency_name}
            label="Nom de l'agence"
            name="agency_name"
            required
          />
          <Field
            defaultValue={settings.city}
            label="Ville"
            name="city"
            required
          />
          <Field
            defaultValue={settings.contact_email ?? ""}
            label="Email de contact"
            name="contact_email"
            type="email"
          />
          <Field
            defaultValue={settings.contact_phone ?? ""}
            label="Téléphone"
            name="contact_phone"
          />
          <Field
            defaultValue={settings.whatsapp_phone ?? ""}
            label="WhatsApp"
            name="whatsapp_phone"
          />
          <Field
            defaultValue={settings.opening_hours ?? ""}
            label="Horaires"
            name="opening_hours"
          />
        </div>

        <label className="mt-5 block text-sm font-semibold">
          Adresse
          <textarea
            className="mt-2 min-h-24 w-full rounded-md border border-black/15 px-3 py-3 outline-none transition focus:border-[#b45309] focus:ring-2 focus:ring-[#facc15]/30"
            defaultValue={settings.address ?? ""}
            name="address"
          />
        </label>

        <label className="mt-5 block text-sm font-semibold">
          Zone de service
          <textarea
            className="mt-2 min-h-24 w-full rounded-md border border-black/15 px-3 py-3 outline-none transition focus:border-[#b45309] focus:ring-2 focus:ring-[#facc15]/30"
            defaultValue={settings.service_area ?? ""}
            name="service_area"
          />
        </label>

        <button
          className="mt-8 h-11 rounded-md bg-[#111827] px-5 text-sm font-bold text-white transition hover:bg-[#374151]"
          type="submit"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        className="mt-2 h-11 w-full rounded-md border border-black/15 px-3 outline-none transition focus:border-[#b45309] focus:ring-2 focus:ring-[#facc15]/30"
        defaultValue={defaultValue}
        name={name}
        required={required}
        type={type}
      />
    </label>
  );
}
