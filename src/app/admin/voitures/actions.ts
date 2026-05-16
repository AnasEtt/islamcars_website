"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin";

const carSchema = z.object({
  brand: z.string().trim().min(1),
  model: z.string().trim().min(1),
  year: z.coerce.number().int().min(1990).max(2100),
  daily_price: z.coerce.number().int().positive(),
  fuel_type: z.string().trim().min(1),
  transmission: z.string().trim().min(1),
  seats: z.coerce.number().int().positive(),
  description: z.string().trim().optional(),
  status: z.enum(["available", "reserved", "unavailable", "maintenance"]),
  featured: z.coerce.boolean().default(false),
});

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function safeFileName(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "jpg";
  const baseName = fileName.replace(/\.[^/.]+$/, "");

  return `${slugify(baseName) || "photo"}.${extension}`;
}

function parseCarForm(formData: FormData, errorPath: string) {
  const parsed = carSchema.safeParse({
    brand: formData.get("brand"),
    model: formData.get("model"),
    year: formData.get("year"),
    daily_price: formData.get("daily_price"),
    fuel_type: formData.get("fuel_type"),
    transmission: formData.get("transmission"),
    seats: formData.get("seats"),
    description: formData.get("description"),
    status: formData.get("status"),
    featured: formData.get("featured") === "on",
  });

  if (!parsed.success) {
    redirect(`${errorPath}?error=validation`);
  }

  return parsed.data;
}

async function uploadCarImages({
  carId,
  brand,
  model,
  formData,
  errorPath,
}: {
  carId: string;
  brand: string;
  model: string;
  formData: FormData;
  errorPath: string;
}) {
  const { supabase } = await requireAdmin();

  const files = formData
    .getAll("images")
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (files.length === 0) {
    return;
  }

  const { count } = await supabase
    .from("car_images")
    .select("id", { count: "exact", head: true })
    .eq("car_id", carId);

  const imageRows = [];
  const startOrder = count ?? 0;

  for (const [index, file] of files.entries()) {
    const path = `${carId}/${Date.now()}-${index}-${safeFileName(file.name)}`;

    const { error: uploadError } = await supabase.storage
      .from("car-images")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      redirect(`${errorPath}?error=upload`);
    }

    const { data } = supabase.storage.from("car-images").getPublicUrl(path);

    imageRows.push({
      car_id: carId,
      image_url: data.publicUrl,
      alt_text: `${brand} ${model}`,
      sort_order: startOrder + index,
    });
  }

  const { error: imageError } = await supabase
    .from("car_images")
    .insert(imageRows);

  if (imageError) {
    redirect(`${errorPath}?error=images`);
  }
}

export async function createCarAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const errorPath = "/admin/voitures/nouveau";
  const car = parseCarForm(formData, errorPath);
  const slugBase = slugify(`${car.brand}-${car.model}-${car.year}`);
  const slug = `${slugBase}-${Date.now().toString(36)}`;

  const { data: createdCar, error } = await supabase
    .from("cars")
    .insert({
      ...car,
      slug,
      description: car.description || null,
    })
    .select("id,brand,model")
    .single();

  if (error || !createdCar) {
    redirect(`${errorPath}?error=database`);
  }

  await uploadCarImages({
    carId: createdCar.id,
    brand: createdCar.brand,
    model: createdCar.model,
    formData,
    errorPath,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/voitures");
  redirect("/admin/voitures?created=1");
}

export async function updateCarAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const carId = String(formData.get("id") ?? "");
  const currentSlug = String(formData.get("slug") ?? "");
  const errorPath = `/admin/voitures/${carId}`;

  if (!carId || !currentSlug) {
    redirect("/admin/voitures?error=missing");
  }

  const car = parseCarForm(formData, errorPath);
  const nextSlugBase = slugify(`${car.brand}-${car.model}-${car.year}`);
  const slugSuffix = currentSlug.split("-").at(-1);
  const nextSlug = `${nextSlugBase}-${slugSuffix || Date.now().toString(36)}`;

  const { error } = await supabase
    .from("cars")
    .update({
      ...car,
      slug: nextSlug,
      description: car.description || null,
    })
    .eq("id", carId);

  if (error) {
    redirect(`${errorPath}?error=database`);
  }

  await uploadCarImages({
    carId,
    brand: car.brand,
    model: car.model,
    formData,
    errorPath,
  });

  revalidatePath("/");
  revalidatePath("/voitures");
  revalidatePath(`/voitures/${currentSlug}`);
  revalidatePath(`/voitures/${nextSlug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/voitures");
  revalidatePath(errorPath);
  redirect(`${errorPath}?updated=1`);
}

export async function deleteCarImageAction(formData: FormData) {
  const { supabase } = await requireAdmin();
  const imageId = String(formData.get("image_id") ?? "");
  const carId = String(formData.get("car_id") ?? "");
  const imageUrl = String(formData.get("image_url") ?? "");

  if (!imageId || !carId || !imageUrl) {
    redirect(`/admin/voitures/${carId}?error=image`);
  }

  const marker = "/storage/v1/object/public/car-images/";
  const path = imageUrl.includes(marker) ? imageUrl.split(marker)[1] : null;

  if (path) {
    await supabase.storage.from("car-images").remove([path]);
  }

  const { error } = await supabase.from("car_images").delete().eq("id", imageId);

  if (error) {
    redirect(`/admin/voitures/${carId}?error=image`);
  }

  revalidatePath("/admin/voitures");
  revalidatePath(`/admin/voitures/${carId}`);
  redirect(`/admin/voitures/${carId}?updated=1`);
}
