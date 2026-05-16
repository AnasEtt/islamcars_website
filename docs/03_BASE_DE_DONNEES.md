# 03 - Base de donnees

## Tables principales

### `profiles`

Profils utilisateurs lies a Supabase Auth.

Champs :

- `id`
- `email`
- `full_name`
- `phone`
- `role`
- `created_at`
- `updated_at`

Roles possibles :

- `customer`
- `admin`

Le compte admin sera cree manuellement.

### `cars`

Voitures disponibles a la location.

Champs :

- `id`
- `slug`
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

Statuts possibles :

- `available`
- `reserved`
- `unavailable`
- `maintenance`

### `car_images`

Images des voitures.

Champs :

- `id`
- `car_id`
- `image_url`
- `alt_text`
- `sort_order`
- `created_at`

### `reservations`

Demandes et reservations.

Champs :

- `id`
- `car_id`
- `user_id`
- `customer_name`
- `customer_email`
- `customer_phone`
- `start_date`
- `end_date`
- `message`
- `status`
- `cash_payment_received`
- `manager_note`
- `created_at`
- `updated_at`

`user_id` est facultatif pour permettre la reservation rapide sans compte.

`customer_email` et `customer_phone` sont obligatoires.

Statuts possibles :

- `pending`
- `confirmed`
- `refused`
- `cancelled`
- `completed`

## Securite Supabase

Regles recommandees :

- tout le monde peut lire les voitures disponibles ;
- seuls les admins peuvent creer ou modifier les voitures ;
- un visiteur peut creer une reservation ;
- un client connecte peut voir ses propres reservations ;
- un admin peut voir toutes les reservations ;
- seuls les admins peuvent changer le statut d'une reservation.

## Stockage images

Bucket Supabase Storage recommande :

```text
car-images
```

Acces :

- lecture publique pour afficher les photos ;
- ecriture reservee aux admins.
