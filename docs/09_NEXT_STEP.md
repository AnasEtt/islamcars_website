# 09 - Prochaine etape

## Reponse courte

La prochaine etape logique est de mettre en place Supabase :

- base de donnees ;
- authentification ;
- roles client/admin ;
- stockage images ;
- regles de securite.

Ensuite, on construit l'interface admin pour que le gerant ajoute les voitures directement depuis le site.

## Est-ce que l'admin peut ajouter les donnees depuis le front ?

Oui.

Le gerant pourra se connecter sur une page comme :

```text
/admin
```

Puis il pourra :

- ajouter une voiture ;
- modifier une voiture ;
- ajouter des photos ;
- changer le prix ;
- changer le statut ;
- confirmer ou refuser les reservations.

Techniquement, l'interface admin est dans le front Next.js, mais elle communique avec Supabase. Il n'y aura pas besoin de passer manuellement par le tableau de bord Supabase pour ajouter les voitures apres la mise en place.

## Attention importante

Il ne faut pas laisser le front ecrire librement dans la base.

On doit d'abord configurer :

- les tables Supabase ;
- les roles ;
- les regles RLS ;
- le compte admin ;
- les protections des pages `/admin`.

Sinon, un utilisateur pourrait essayer de modifier des donnees qu'il ne doit pas toucher.

## Ordre recommande

### 1. Creer le projet Supabase

Dans Supabase :

- creer un nouveau projet ;
- recuperer l'URL du projet ;
- recuperer la cle `publishable` ;
- recuperer la cle `secret` plus tard si on a besoin d'operations serveur privilegiees.

### 2. Ajouter les variables d'environnement

Creer `.env.local` a la racine du projet :

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
```

### 3. Creer les tables

Tables prioritaires :

- `profiles`
- `cars`
- `car_images`
- `reservations`

### 4. Activer la securite

Activer RLS sur les tables et creer les policies.

Objectif :

- tout le monde peut lire les voitures disponibles ;
- les clients peuvent creer une reservation ;
- les clients connectes voient leur historique ;
- seuls les admins peuvent ajouter/modifier/supprimer les voitures ;
- seuls les admins voient toutes les reservations.

### 5. Creer le compte admin

Dans Supabase :

1. creer un utilisateur admin ;
2. creer son profil ;
3. mettre `role = admin` ;
4. tester la connexion.

### 6. Construire les pages auth

Pages :

- `/connexion`
- `/inscription`
- `/compte`
- `/compte/reservations`

### 7. Construire l'admin

Pages :

- `/admin`
- `/admin/voitures`
- `/admin/voitures/nouveau`
- `/admin/reservations`

## Conclusion

Avant de coder l'admin complet, il faut d'abord configurer Supabase proprement. Ensuite, l'admin pourra tout gerer depuis l'interface du site, sans passer par le dashboard Supabase sauf pour les operations techniques.
