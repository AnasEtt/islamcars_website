# Projet site de location de voitures

## 1. Objectif du site

Créer un site web pour une petite agence de location de voitures avec moins de 10 véhicules.

Le site doit permettre :

- aux visiteurs de consulter les voitures disponibles ;
- aux visiteurs de faire une demande de réservation ;
- au gérant de se connecter à une interface privée ;
- au gérant d'ajouter, modifier ou désactiver des voitures ;
- au gérant de voir les demandes de réservation ;
- au gérant de confirmer ou refuser une réservation ;
- de gérer le paiement uniquement en espèces.

Important : comme le paiement se fait en espèces, il ne faut pas intégrer Stripe, PayPal ou un autre système de paiement en ligne au départ. Le site sert surtout à présenter les voitures, recevoir les demandes et organiser la gestion.

## 2. Solution technique recommandée

Pour un petit projet avec peu de trafic, la solution la plus simple et économique est :

- **Frontend + application** : Next.js
- **Hébergement** : Vercel
- **Base de données** : Supabase PostgreSQL
- **Authentification** : Supabase Auth
- **Stockage des images** : Supabase Storage
- **Interface gérant** : pages privées dans la même application Next.js
- **Nom de domaine** : le domaine déjà acheté sera connecté à Vercel

Cette solution évite d'avoir un serveur classique à gérer. Vercel héberge le site, Supabase gère la base de données, les comptes utilisateurs, les permissions et les images.

## 3. Pourquoi Next.js

Next.js est adapté parce qu'il permet de créer à la fois :

- les pages publiques du site ;
- les pages privées du gérant ;
- les formulaires ;
- les appels vers Supabase ;
- une bonne performance pour le référencement Google ;
- une application moderne avec animations.

Le site pourra être dynamique sans être trop compliqué à maintenir.

## 4. Pourquoi Supabase

Supabase est une bonne option pour ce projet parce qu'il inclut plusieurs services utiles dans une seule plateforme :

- base de données PostgreSQL ;
- authentification ;
- stockage de fichiers et images ;
- règles de sécurité ;
- API automatique pour lire et écrire les données.

Le plan gratuit de Supabase est généralement suffisant pour un petit site de location avec moins de 10 voitures, peu de comptes et peu de trafic. D'après la page officielle actuelle de Supabase, le plan gratuit inclut notamment une base de données limitée, du stockage fichier et l'authentification.

Source : https://supabase.com/pricing

## 5. Pourquoi Vercel

Vercel est très pratique pour héberger une application Next.js.

Ses avantages :

- déploiement simple depuis GitHub ;
- HTTPS automatique ;
- connexion facile avec un nom de domaine ;
- plan gratuit adapté aux petits projets personnels ou petits sites ;
- pas de serveur à configurer.

Le plan gratuit Hobby peut suffire au début. Il faudra simplement respecter les limites d'utilisation de Vercel.

Sources :

- https://vercel.com/pricing
- https://vercel.com/docs/plans/hobby

## 6. Structure du site public

Le site public devrait contenir les pages suivantes.

### Accueil

Objectif : donner confiance rapidement et montrer les voitures disponibles.

Contenu possible :

- grande section visuelle avec une voiture ;
- message clair : location de voitures avec paiement en espèces ;
- bouton pour voir les voitures ;
- bouton pour contacter ou réserver ;
- quelques avantages : prix clair, réservation simple, paiement à la remise du véhicule.

### Liste des voitures

Objectif : permettre au client de comparer rapidement.

Chaque voiture peut afficher :

- photo principale ;
- marque ;
- modèle ;
- année ;
- prix par jour ;
- carburant ;
- boîte manuelle ou automatique ;
- nombre de places ;
- statut : disponible, réservée, indisponible ;
- bouton pour voir les détails.

### Page détail voiture

Objectif : convaincre le client et lancer la demande de réservation.

Contenu :

- galerie photos ;
- informations complètes ;
- prix ;
- conditions importantes ;
- calendrier ou champs de dates ;
- formulaire de demande de réservation.

### Formulaire de réservation

Champs proposés :

- nom complet ;
- téléphone ;
- email facultatif ;
- voiture souhaitée ;
- date de début ;
- date de fin ;
- message facultatif ;
- confirmation que le paiement se fera en espèces.

Le formulaire ne valide pas automatiquement la réservation. Il crée une demande que le gérant doit confirmer.

### Contact

Contenu :

- téléphone ;
- WhatsApp si souhaité ;
- adresse ou zone de service ;
- horaires ;
- formulaire simple ;
- carte Google Maps si nécessaire.

## 7. Interface gérant

L'interface gérant sera accessible après connexion.

URL possible :

```text
/admin
```

Fonctions principales :

- tableau de bord ;
- gestion des voitures ;
- gestion des réservations ;
- gestion des images ;
- modification des informations de contact ;
- déconnexion.

### Tableau de bord

Afficher rapidement :

- nombre de voitures ;
- nombre de demandes en attente ;
- réservations confirmées ;
- voitures disponibles ;
- prochaines réservations.

### Gestion des voitures

Le gérant pourra :

- ajouter une voiture ;
- modifier une voiture ;
- supprimer ou désactiver une voiture ;
- ajouter plusieurs photos ;
- changer le statut ;
- changer le prix ;
- mettre une voiture en avant sur l'accueil.

### Gestion des réservations

Chaque demande de réservation aura un statut :

- en attente ;
- confirmée ;
- refusée ;
- annulée ;
- terminée.

Le gérant pourra :

- voir les détails du client ;
- confirmer la demande ;
- refuser la demande ;
- ajouter une note interne ;
- marquer le paiement espèces comme reçu ;
- marquer la voiture comme rendue.

## 8. Authentification

Supabase Auth peut gérer la connexion du gérant.

Au départ, il vaut mieux éviter de laisser n'importe qui créer un compte gérant depuis le site. La solution recommandée :

- créer le compte du gérant manuellement dans Supabase ;
- bloquer l'accès admin à tous les autres utilisateurs ;
- utiliser un rôle `admin` dans la base de données.

Plus tard, si nécessaire, on pourra ajouter :

- plusieurs gérants ;
- rôles différents ;
- historique des actions.

## 9. Base de données proposée

Tables principales :

### `cars`

Stocke les voitures.

Champs possibles :

- `id`
- `brand`
- `model`
- `year`
- `daily_price`
- `fuel_type`
- `transmission`
- `seats`
- `description`
- `status`
- `featured`
- `created_at`
- `updated_at`

### `car_images`

Stocke les images liées aux voitures.

Champs possibles :

- `id`
- `car_id`
- `image_url`
- `sort_order`
- `created_at`

### `reservations`

Stocke les demandes de réservation.

Champs possibles :

- `id`
- `car_id`
- `customer_name`
- `customer_phone`
- `customer_email`
- `start_date`
- `end_date`
- `message`
- `status`
- `cash_payment_received`
- `manager_note`
- `created_at`
- `updated_at`

### `profiles`

Stocke les profils des utilisateurs connectés.

Champs possibles :

- `id`
- `email`
- `role`
- `created_at`

## 10. Paiement en espèces

Comme le paiement se fait uniquement en espèces :

- le client ne paie pas en ligne ;
- le formulaire indique clairement que le paiement se fait en espèces ;
- la réservation reste en attente jusqu'à validation par le gérant ;
- le gérant peut cocher "paiement reçu" dans l'interface admin ;
- une réservation peut être confirmée même si le paiement n'est pas encore reçu, selon la règle choisie.

Texte possible côté client :

```text
Le paiement se fait uniquement en espèces au moment de la remise du véhicule.
Votre demande sera confirmée par téléphone ou WhatsApp.
```

## 11. Design et animations

Le site doit être moderne, dynamique et sérieux.

Direction visuelle recommandée :

- design clair, propre et professionnel ;
- photos de voitures grandes et nettes ;
- animations légères au scroll ;
- transitions fluides entre les sections ;
- boutons avec micro-interactions ;
- cartes de voitures animées au survol ;
- galerie photo agréable ;
- interface admin plus simple, dense et efficace.

Bibliothèques utiles :

- **Tailwind CSS** pour le style ;
- **Framer Motion** pour les animations ;
- **Lucide React** pour les icônes ;
- **React Hook Form** pour les formulaires ;
- **Zod** pour valider les données.

Il faut éviter les animations trop lourdes. Le site doit rester rapide, surtout sur téléphone.

## 12. Hébergement et nom de domaine

Étapes prévues :

1. Créer le projet Next.js.
2. Mettre le code sur GitHub.
3. Connecter GitHub à Vercel.
4. Déployer automatiquement le site.
5. Connecter le nom de domaine acheté à Vercel.
6. Configurer les variables Supabase dans Vercel.
7. Vérifier le HTTPS.

Vercel fournit généralement le HTTPS automatiquement. Il faudra modifier les DNS chez le fournisseur du nom de domaine.

## 13. Variables d'environnement

Le projet aura besoin de variables secrètes.

Exemple :

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
```

Important :

- les variables `NEXT_PUBLIC_` peuvent être visibles côté navigateur ;
- la clé `SUPABASE_SECRET_KEY` doit rester secrète ;
- il ne faut jamais mettre les clés secrètes directement dans le code public.

## 14. Sécurité

Points importants :

- activer les règles RLS dans Supabase ;
- seuls les admins peuvent créer, modifier ou supprimer les voitures ;
- les visiteurs peuvent seulement lire les voitures disponibles ;
- les visiteurs peuvent créer une demande de réservation ;
- les visiteurs ne peuvent pas voir les demandes des autres ;
- les clés secrètes doivent rester côté serveur ;
- l'interface admin doit être protégée.

## 15. Référencement Google

Le site devra inclure :

- titres de pages propres ;
- descriptions ;
- URLs simples ;
- images optimisées ;
- page contact claire ;
- données structurées si nécessaire ;
- sitemap ;
- fichier `robots.txt`.

Exemples d'URLs :

```text
/
/voitures
/voitures/renault-clio
/contact
/admin
```

## 16. Version 1 recommandée

Pour avancer efficacement, la première version doit rester simple.

Contenu de la V1 :

- accueil ;
- liste des voitures ;
- détail voiture ;
- formulaire de demande ;
- connexion gérant ;
- tableau de bord admin ;
- ajout/modification voiture ;
- gestion réservations ;
- upload images ;
- déploiement Vercel ;
- connexion domaine.

À éviter en V1 :

- paiement en ligne ;
- application mobile ;
- système de facture complexe ;
- chat temps réel ;
- calendrier trop avancé ;
- plusieurs rôles compliqués.

## 17. Améliorations possibles plus tard

Après la V1, on pourra ajouter :

- notifications email ;
- notifications WhatsApp ;
- calendrier de disponibilité plus avancé ;
- génération de contrat PDF ;
- export Excel des réservations ;
- statistiques mensuelles ;
- avis clients ;
- multi-langue ;
- blog ou pages SEO ;
- système de caution ;
- scan ou upload de permis de conduire.

## 18. Plan de réalisation

### Étape 1 : cadrage

- confirmer les pages nécessaires ;
- confirmer les informations à afficher pour chaque voiture ;
- confirmer les règles de réservation ;
- préparer les textes principaux ;
- choisir l'identité visuelle.

### Étape 2 : création technique

- créer le projet Next.js ;
- installer Tailwind CSS ;
- installer Supabase ;
- créer la structure des pages ;
- préparer les composants principaux.

### Étape 3 : base de données

- créer les tables Supabase ;
- ajouter les règles de sécurité ;
- créer le compte gérant ;
- tester les accès.

### Étape 4 : site public

- créer l'accueil ;
- créer la liste des voitures ;
- créer la page détail ;
- créer le formulaire de réservation ;
- ajouter les animations.

### Étape 5 : admin

- créer la connexion ;
- créer le tableau de bord ;
- créer la gestion des voitures ;
- créer la gestion des réservations ;
- sécuriser les pages.

### Étape 6 : déploiement

- créer le dépôt GitHub ;
- connecter Vercel ;
- configurer les variables d'environnement ;
- connecter le domaine ;
- tester sur téléphone et ordinateur.

## 19. Ce qu'il faut préparer

Avant de construire le site, il faudra préparer :

- nom exact de l'agence ;
- logo si disponible ;
- couleurs souhaitées ;
- liste des voitures ;
- prix par jour ;
- photos des voitures ;
- conditions de location ;
- téléphone ;
- WhatsApp ;
- email ;
- adresse ou zone de service ;
- horaires ;
- nom de domaine acheté ;
- accès au compte du fournisseur du domaine.

## 20. Décision recommandée

Pour ce projet, je recommande :

```text
Next.js + Vercel + Supabase
```

C'est une combinaison simple, moderne et économique pour démarrer. Elle permet de créer un vrai site dynamique avec une interface gérant sans payer d'hébergement au début, tant que le trafic et les données restent faibles.

Le projet pourra évoluer plus tard si l'activité grandit.
