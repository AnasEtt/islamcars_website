# 02 - Creation technique

## Stack recommandee

- Next.js pour le site et l'application.
- TypeScript pour eviter les erreurs simples.
- Tailwind CSS pour le design.
- Framer Motion pour les animations.
- Supabase pour base de donnees, auth et stockage.
- Vercel pour l'hebergement.

## Installation effectuee

Le projet Next.js est initialise a la racine du depot `F:\GIT\islamcars_website`.

Packages installes :

- `next`
- `react`
- `react-dom`
- `@supabase/supabase-js`
- `@supabase/ssr`
- `framer-motion`
- `lucide-react`
- `react-hook-form`
- `zod`
- `clsx`

Fichiers ajoutes :

- `.env.example`
- `src/lib/supabase/browser.ts`
- `src/lib/supabase/server.ts`

## Structure prevue

Pages publiques :

- `/`
- `/voitures`
- `/voitures/[slug]`
- `/reservation`
- `/contact`

Pages client :

- `/compte`
- `/compte/reservations`

Pages admin :

- `/admin`
- `/admin/voitures`
- `/admin/voitures/nouveau`
- `/admin/voitures/[id]`
- `/admin/reservations`
- `/admin/reservations/[id]`

## Principes techniques

- Les donnees sensibles restent cote serveur.
- Les pages admin sont protegees par role.
- Les formulaires sont valides cote client et cote serveur.
- Les images sont stockees dans Supabase Storage.
- Les composants sont reutilisables.
- Le site doit etre performant sur mobile.
