import { createClient } from "@/lib/supabase/server";

export type PublicCar = {
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
  status: "available" | "reserved";
  featured: boolean;
  car_images: {
    image_url: string;
    alt_text: string | null;
    sort_order: number;
  }[];
};

const publicCarSelect =
  "id,slug,brand,model,year,daily_price,fuel_type,transmission,seats,description,status,featured,car_images(image_url,alt_text,sort_order)";

export async function getPublicCars() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cars")
    .select(publicCarSelect)
    .in("status", ["available", "reserved"])
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false })
    .returns<PublicCar[]>();

  if (error) {
    console.error(error);
    return [];
  }

  return sortCarImages(data ?? []);
}

export async function getFeaturedCars(limit = 3) {
  const cars = await getPublicCars();
  const featured = cars.filter((car) => car.featured);

  return (featured.length ? featured : cars).slice(0, limit);
}

export async function getPublicCarBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cars")
    .select(publicCarSelect)
    .eq("slug", slug)
    .in("status", ["available", "reserved"])
    .single<PublicCar>();

  if (error) {
    return null;
  }

  return sortCarImages([data])[0];
}

function sortCarImages(cars: PublicCar[]) {
  return cars.map((car) => ({
    ...car,
    car_images: [...(car.car_images ?? [])].sort(
      (a, b) => a.sort_order - b.sort_order,
    ),
  }));
}
