import { createClient } from "@/lib/supabase/server";

export type SiteSettings = {
  agency_name: string;
  city: string;
  contact_email: string | null;
  contact_phone: string | null;
  whatsapp_phone: string | null;
  address: string | null;
  service_area: string | null;
  opening_hours: string | null;
};

export const defaultSiteSettings: SiteSettings = {
  agency_name: "Islamcars",
  city: "Agadir",
  contact_email: "contact@islamcars.example",
  contact_phone: "+212 600 000 000",
  whatsapp_phone: "+212 600 000 000",
  address: "Agadir, Maroc",
  service_area: "Agadir et alentours",
  opening_hours: "Tous les jours, 09:00 - 20:00",
};

export async function getSiteSettings() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("site_settings")
    .select(
      "agency_name,city,contact_email,contact_phone,whatsapp_phone,address,service_area,opening_hours",
    )
    .eq("id", true)
    .maybeSingle<SiteSettings>();

  if (error || !data) {
    return defaultSiteSettings;
  }

  return data;
}
