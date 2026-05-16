import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AdminProfile = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: "customer" | "admin";
};

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion?next=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id,email,full_name,phone,role")
    .eq("id", user.id)
    .single<AdminProfile>();

  if (!profile || profile.role !== "admin") {
    redirect("/connexion?error=admin");
  }

  return { supabase, user, profile };
}
