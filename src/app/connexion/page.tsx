import { CarFront, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { signInAction } from "./actions";

type ConnexionPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  missing: "Email et mot de passe obligatoires.",
  credentials: "Identifiants incorrects.",
  admin: "Ce compte n'a pas accès à l'interface admin.",
};

export default async function ConnexionPage({
  searchParams,
}: ConnexionPageProps) {
  const params = await searchParams;
  const errorMessage = params.error ? errorMessages[params.error] : null;

  return (
    <main className="grid min-h-screen bg-[#f7f3ed] px-5 py-10 text-[#111827] lg:grid-cols-[0.95fr_1.05fr]">
      <section className="mx-auto flex w-full max-w-xl flex-col justify-center">
        <Link className="mb-12 inline-flex items-center gap-3" href="/">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-[#111827] text-white">
            <CarFront size={22} />
          </span>
          <span>
            <span className="block text-xl font-black">Islamcars</span>
            <span className="block text-sm text-[#6b7280]">Agadir</span>
          </span>
        </Link>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#b45309]">
            Accès gérant
          </p>
          <h1 className="mt-3 text-4xl font-black">Connexion admin</h1>
          <p className="mt-4 max-w-md leading-7 text-[#4b5563]">
            Connecte-toi avec le compte créé dans Supabase. L&apos;accès admin est
            autorisé uniquement si le profil a le rôle `admin`.
          </p>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-md items-center">
        <form
          action={signInAction}
          className="w-full rounded-lg border border-black/10 bg-white p-6 shadow-xl"
        >
          <input name="next" type="hidden" value={params.next ?? "/admin"} />
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-md bg-[#fef3c7] text-[#92400e]">
              <LockKeyhole size={20} />
            </span>
            <div>
              <h2 className="font-bold">Se connecter</h2>
              <p className="text-sm text-[#6b7280]">Interface privée</p>
            </div>
          </div>

          {errorMessage ? (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <label className="block text-sm font-semibold" htmlFor="email">
            Email
          </label>
          <input
            className="mt-2 h-11 w-full rounded-md border border-black/15 px-3 outline-none transition focus:border-[#b45309] focus:ring-2 focus:ring-[#facc15]/30"
            id="email"
            name="email"
            required
            type="email"
          />

          <label
            className="mt-5 block text-sm font-semibold"
            htmlFor="password"
          >
            Mot de passe
          </label>
          <input
            className="mt-2 h-11 w-full rounded-md border border-black/15 px-3 outline-none transition focus:border-[#b45309] focus:ring-2 focus:ring-[#facc15]/30"
            id="password"
            name="password"
            required
            type="password"
          />

          <button
            className="mt-6 h-12 w-full rounded-md bg-[#111827] font-bold text-white transition hover:bg-[#374151]"
            type="submit"
          >
            Entrer dans l&apos;admin
          </button>
        </form>
      </section>
    </main>
  );
}
