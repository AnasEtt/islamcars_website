# 07 - Déploiement

## Objectif

Mettre le site en ligne avec le nom de domaine acheté.

## Services

- GitHub pour stocker le code.
- Vercel pour héberger le site.
- Supabase pour base de données, auth et images.
- Fournisseur du nom de domaine pour configurer les DNS.

## Étapes

1. Créer le projet localement.
2. Créer un dépôt GitHub.
3. Envoyer le code sur GitHub.
4. Créer le projet Supabase.
5. Créer les tables.
6. Configurer les règles de sécurité.
7. Créer le compte admin manuellement.
8. Créer le projet Vercel.
9. Connecter Vercel au dépôt GitHub.
10. Ajouter les variables d'environnement.
11. Déployer.
12. Connecter le nom de domaine.
13. Vérifier le site en HTTPS.

## Variables d'environnement

Exemple :

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
```

La cle `SUPABASE_SECRET_KEY` doit rester secrete.

## Tests avant mise en ligne

À vérifier :

- le site s'affiche sur téléphone ;
- les voitures s'affichent ;
- une réservation sans compte fonctionne ;
- une inscription client fonctionne ;
- l'historique client fonctionne ;
- l'admin peut se connecter ;
- l'admin peut ajouter une voiture ;
- l'admin peut confirmer une réservation ;
- les images s'affichent ;
- le domaine fonctionne en HTTPS.
