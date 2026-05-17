# 12 - Formulaire de reservation et email au gerant

Ce document explique l'objectif : quand un client demande une reservation sur le site, le gerant recoit automatiquement un email avec les informations du formulaire.

## Objectif simple

Sur la page d'une voiture, le bouton `Demander une reservation` sera remplace par un formulaire.

Le client remplira :

- nom ;
- email ;
- telephone ;
- date de debut ;
- date de fin ;
- message optionnel.

Quand le client valide :

1. la reservation est enregistree dans la base ;
2. le gerant recoit un email ;
3. le client voit un message de confirmation sur le site.

## Exemple d'email recu par le gerant

```text
Nouvelle demande de reservation - Islamcars

Voiture : Renault Clio 5
Dates : 2026-06-10 au 2026-06-14

Client :
Nom : Ahmed
Email : ahmed@example.com
Telephone : +212 600 000 000

Message :
Bonjour, est-ce que la voiture est disponible avec livraison a l'aeroport ?
```

## Adresse Gmail du gerant

Il sera possible d'utiliser une adresse Gmail comme destinataire.

Exemple :

```text
RESERVATION_NOTIFICATION_EMAIL=islamcars.agadir@gmail.com
```

Cette adresse recevra les demandes de reservation.

Important : cette variable doit etre ajoutee dans Vercel, pas affichee sur le site.

## Service d'envoi d'email

Pour envoyer l'email automatiquement, le site a besoin d'un service d'email.

Le plus simple pour ce projet est d'utiliser Resend.

Resend sert a envoyer l'email depuis le serveur du site vers le Gmail du gerant.

Le Gmail du gerant est seulement le destinataire. On ne se connecte pas au compte Gmail du gerant et on ne stocke pas son mot de passe.

## Variables a ajouter

Il faudra ajouter ces variables dans Vercel :

```text
RESEND_API_KEY=
RESERVATION_NOTIFICATION_EMAIL=
EMAIL_FROM=
```

Exemple :

```text
RESEND_API_KEY=re_xxxxxxxxx
RESERVATION_NOTIFICATION_EMAIL=islamcars.agadir@gmail.com
EMAIL_FROM=Islamcars <onboarding@resend.dev>
```

Au debut, `onboarding@resend.dev` peut servir pour tester.

Pour une version plus professionnelle, il faudra verifier le domaine dans Resend et utiliser une adresse du domaine.

Exemple final :

```text
EMAIL_FROM=Islamcars <reservations@islamcars.com>
```

## Etapes de configuration

### 1. Creer le compte Resend

1. Aller sur https://resend.com
2. Creer un compte.
3. Creer une API key.
4. Copier la cle.

### 2. Ajouter les variables dans Vercel

Dans Vercel :

1. ouvrir le projet ;
2. aller dans `Settings` ;
3. aller dans `Environment Variables` ;
4. ajouter `RESEND_API_KEY` ;
5. ajouter `RESERVATION_NOTIFICATION_EMAIL` ;
6. ajouter `EMAIL_FROM` ;
7. cocher `Production` ;
8. redeployer le site.

### 3. Tester

Faire une reservation test depuis le site public.

Verifier :

- la reservation apparait dans l'admin ;
- le Gmail du gerant recoit l'email ;
- l'email contient bien la voiture, les dates et les coordonnees du client.

## Points importants

### Si l'email ne part pas

La reservation doit quand meme etre enregistree dans l'admin.

L'email est une notification pratique, mais l'admin reste la source principale.

### Si l'email arrive en spam

C'est souvent normal au debut avec un nouvel expediteur.

Pour ameliorer cela, il faut verifier le domaine dans Resend et configurer les DNS demandes par Resend.

### Si le gerant veut changer de Gmail

Il suffit de modifier cette variable dans Vercel :

```text
RESERVATION_NOTIFICATION_EMAIL=
```

Puis redeployer.

## Decision pour Islamcars

Solution retenue :

- formulaire de reservation sur la page voiture ;
- enregistrement dans Supabase ;
- email automatique vers le Gmail du gerant avec Resend ;
- variables configurees dans Vercel ;
- pas de mot de passe Gmail dans le code.
