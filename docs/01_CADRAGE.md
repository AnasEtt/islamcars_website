# 01 - Cadrage

## Objectif

Creer un site moderne de location de voitures pour Islamcars, une agence basee a Agadir.

Le site doit permettre :

- de presenter les voitures ;
- de recevoir des demandes de reservation ;
- de gerer les reservations cote gerant ;
- de permettre aux clients connectes de consulter leur historique ;
- de garder un parcours rapide sans creation de compte ;
- de fonctionner sans paiement en ligne.

## Decisions validees

- Nom de l'agence : Islamcars.
- Ville : Agadir.
- Langue : francais.
- Paiement uniquement en especes.
- Le client peut reserver sans compte.
- Email obligatoire pour toutes les reservations.
- Telephone obligatoire pour toutes les reservations.
- Supabase Auth sert surtout aux clients.
- Le compte admin est cree manuellement dans Supabase.
- La confirmation de reservation est manuelle au depart.
- Les notifications email ou WhatsApp seront ajoutees plus tard si besoin.
- Les donnees manquantes peuvent etre fictives au depart et remplacees ensuite.

## Donnees de depart

- Flotte de test : 10 voitures.
- Modeles de test : Renault Clio 4, Renault Clio 5, Peugeot 208.
- Prix de test : 400 MAD par jour.
- Photos : images de test depuis internet au depart.
- Stockage final des photos : Supabase Storage.

## Parcours client sans compte

1. Le client visite le site.
2. Il consulte les voitures.
3. Il choisit une voiture.
4. Il remplit le formulaire avec nom, email, telephone et dates.
5. La demande arrive dans l'interface admin.
6. Le gerant contacte le client manuellement.
7. Le gerant confirme ou refuse la reservation.

## Parcours client avec compte

1. Le client cree un compte ou se connecte.
2. Il fait une demande de reservation.
3. La reservation est liee a son compte.
4. Il peut consulter l'historique de ses reservations.

## Parcours gerant

1. Le compte admin est cree manuellement dans Supabase.
2. Le gerant se connecte.
3. Il accede a `/admin`.
4. Il ajoute ou modifie les voitures.
5. Il consulte les demandes.
6. Il confirme, refuse, annule ou termine les reservations.
7. Il marque le paiement especes comme recu.

## A confirmer plus tard

- Telephone et WhatsApp.
- Email de contact.
- Adresse exacte ou zone de service.
- Conditions de location.
- Photos reelles des voitures.
- Identite visuelle finale.
