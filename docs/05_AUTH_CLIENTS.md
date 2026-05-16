# 05 - Authentification clients

## Objectif

Permettre aux clients de créer un compte pour garder l'historique de leurs réservations.

La création de compte n'est pas obligatoire pour réserver.

## Fonctionnalités client

- inscription ;
- connexion ;
- déconnexion ;
- mot de passe oublié ;
- modification simple du profil ;
- historique des réservations.

## Données client

Champs utiles :

- nom complet ;
- email ;
- téléphone.

L'email est obligatoire.

Le téléphone est obligatoire.

## Réservation sans compte

Le client peut réserver rapidement sans compte.

Dans ce cas :

- `user_id` reste vide ;
- `customer_email` est obligatoire ;
- `customer_phone` est obligatoire ;
- le client ne voit pas cette réservation dans un espace personnel tant qu'elle n'est pas liée à un compte.

## Réservation avec compte

Si le client est connecté :

- la réservation est liée à son `user_id` ;
- les champs email et téléphone peuvent être préremplis ;
- la réservation apparaît dans son historique.

## Admin

Le compte admin ne doit pas être créé depuis une page publique.

Procédure :

1. créer l'utilisateur dans Supabase ;
2. créer ou modifier son profil ;
3. mettre `role = admin` ;
4. vérifier que seul ce rôle accède à `/admin`.
