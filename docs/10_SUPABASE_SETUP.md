# 10 - Configuration Supabase

Ce document explique quoi faire dans Supabase avant de connecter le front aux vraies donnees.

## Objectif

Configurer :

- les tables ;
- les roles client/admin ;
- les regles RLS ;
- le bucket images ;
- les donnees de test optionnelles.

## 1. Verifier les variables locales

Dans `.env.local`, il faut avoir :

```text
NEXT_PUBLIC_SUPABASE_URL=https://rxgvczadwzpctaiwusus.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

La cle publishable est correcte pour le front Next.js.

On n'a pas besoin de l'ancienne cle `anon` pour le setup actuel.

## 2. Executer le schema SQL

Dans Supabase :

1. ouvrir le projet ;
2. aller dans `SQL Editor` ;
3. creer une nouvelle query ;
4. copier le contenu de `supabase/sql/001_initial_schema.sql` ;
5. cliquer sur `Run`.

Ce script cree :

- `profiles`
- `cars`
- `car_images`
- `reservations`
- les index ;
- les triggers `updated_at` ;
- le trigger de creation automatique de profil client ;
- la fonction `is_admin()` ;
- les policies RLS ;
- le bucket Storage `car-images`.

## 3. Ajouter les voitures de test

Optionnel, mais utile pour tester vite.

Dans `SQL Editor`, executer :

```text
supabase/sql/002_seed_test_cars.sql
```

Cela ajoute 10 voitures fictives :

- Renault Clio 4 ;
- Renault Clio 5 ;
- Peugeot 208 ;
- prix : 400 MAD par jour.

## 4. Creer le compte admin

Dans Supabase :

1. aller dans `Authentication` ;
2. creer un utilisateur avec l'email du gerant ;
3. aller dans `Table Editor` ;
4. ouvrir `profiles` ;
5. trouver la ligne du compte ;
6. mettre `role = admin`.

Si le profil n'existe pas encore, connecte-toi une premiere fois avec ce compte depuis le site quand la page login sera creee, ou insere le profil manuellement.

Exemple SQL pour passer un compte en admin :

```sql
update public.profiles
set role = 'admin'
where email = 'admin@example.com';
```

Remplacer `admin@example.com` par le vrai email.

## 5. Ce que RLS autorise

Visiteur non connecte :

- lire les voitures disponibles ou reservees ;
- creer une demande de reservation.

Client connecte :

- lire les voitures ;
- creer une reservation ;
- voir ses propres reservations.

Admin :

- gerer toutes les voitures ;
- gerer les images ;
- voir toutes les reservations ;
- confirmer, refuser, annuler ou terminer les reservations ;
- marquer le paiement especes comme recu.

## 6. Prochaine etape apres Supabase

Quand le SQL est execute et le compte admin cree, on peut coder :

- connexion client/admin ;
- lecture des voitures depuis Supabase ;
- formulaire de reservation connecte a Supabase ;
- interface `/admin` ;
- ajout/modification de voitures depuis l'admin ;
- upload images vers Supabase Storage.

## 7. Important

Ne desactive pas RLS.

Les tables sont creees avec RLS active. C'est ce qui permet de laisser le front communiquer avec Supabase sans donner trop de droits aux visiteurs.

## 8. Parametres du site

Si le projet a deja ete cree avec `001_initial_schema.sql`, execute aussi :

```text
supabase/sql/003_site_settings.sql
```

Cela ajoute la table `site_settings`, utilisee par l'onglet admin :

```text
/admin/parametres
```

Le gerant pourra modifier :

- nom de l'agence ;
- ville ;
- email ;
- telephone ;
- WhatsApp ;
- adresse ;
- zone de service ;
- horaires.
