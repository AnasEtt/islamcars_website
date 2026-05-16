"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";

const settingsSchema = z.object({
  agency_name: z.string().trim().min(1),
  city: z.string().trim().min(1),
  contact_email: z.string().trim().email().or(z.literal("")).nullable(),
  contact_phone: z.string().trim().nullable(),
  whatsapp_phone: z.string().trim().nullable(),
  address: z.string().trim().nullable(),
  service_area: z.string().trim().nullable(),
  opening_hours: z.string().trim().nullable(),
});

function emptyToNull(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text.length ? text : null;
}

export async function updateSettingsAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const parsed = settingsSchema.safeParse({
    agency_name: formData.get("agency_name"),
    city: formData.get("city"),
    contact_email: emptyToNull(formData.get("contact_email")) ?? "",
    contact_phone: emptyToNull(formData.get("contact_phone")),
    whatsapp_phone: emptyToNull(formData.get("whatsapp_phone")),
    address: emptyToNull(formData.get("address")),
    service_area: emptyToNull(formData.get("service_area")),
    opening_hours: emptyToNull(formData.get("opening_hours")),
  });

  if (!parsed.success) {
    redirect("/admin/parametres?error=validation");
  }

  const { error } = await supabase.from("site_settings").upsert({
    id: true,
    ...parsed.data,
    contact_email: parsed.data.contact_email || null,
  });

  if (error) {
    redirect("/admin/parametres?error=database");
  }

  revalidatePath("/");
  revalidatePath("/voitures");
  revalidatePath("/admin/parametres");
  redirect("/admin/parametres?updated=1");
}
