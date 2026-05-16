# 06 - Interface admin

## Objectif

Créer une interface simple pour que le gérant puisse gérer les voitures et les réservations.

## Accès

URL :

```text
/admin
```

Accès réservé aux utilisateurs avec rôle `admin`.

## Tableau de bord

Afficher :

- demandes en attente ;
- réservations confirmées ;
- voitures disponibles ;
- voitures indisponibles ;
- prochaines réservations.

## Gestion voitures

Actions :

- ajouter une voiture ;
- modifier une voiture ;
- désactiver une voiture ;
- changer le statut ;
- modifier le prix ;
- ajouter ou supprimer des images ;
- choisir les voitures mises en avant.

## Gestion réservations

Actions :

- voir toutes les demandes ;
- filtrer par statut ;
- consulter les informations client ;
- confirmer une réservation ;
- refuser une réservation ;
- annuler une réservation ;
- marquer comme terminée ;
- marquer le paiement espèces comme reçu ;
- ajouter une note interne.

## Notifications

V1 :

- pas d'envoi automatique ;
- le gérant contacte le client manuellement.

Plus tard :

- email automatique après confirmation ;
- message WhatsApp automatique ;
- rappel avant la date de début.

## Design admin

L'admin doit être plus pratique que décoratif :

- tableaux lisibles ;
- actions rapides ;
- statuts visibles ;
- formulaires simples ;
- interface efficace sur ordinateur et utilisable sur mobile.
