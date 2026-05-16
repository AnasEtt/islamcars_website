# 08 - Lancer le serveur local

Ce document explique comment lancer le site sur ton ordinateur.

## 1. Ouvrir le terminal dans le projet

Le projet est ici :

```text
F:\GIT\islamcars_website
```

Dans PowerShell :

```powershell
cd F:\GIT\islamcars_website
```

## 2. Installer les dependances

Cette commande est necessaire la premiere fois, ou quand `package.json` change.

```powershell
npm.cmd install
```

Important : sur ton Windows, `npm` peut etre bloque par la politique PowerShell. Utilise `npm.cmd`, pas `npm`.

## 3. Lancer le serveur de developpement

```powershell
npm.cmd run dev
```

Ensuite, ouvre cette adresse dans le navigateur :

```text
http://localhost:3000
```

Si tu veux forcer l'adresse locale :

```powershell
npm.cmd run dev -- --hostname 127.0.0.1 --port 3000
```

Puis ouvre :

```text
http://127.0.0.1:3000
```

## 4. Arreter le serveur

Dans le terminal ou le serveur tourne :

```text
Ctrl + C
```

Puis confirme si PowerShell le demande.

## 5. Verifier que le projet est propre

Avant de deployer ou apres une modification importante :

```powershell
npm.cmd run lint
```

Puis :

```powershell
npm.cmd run build
```

Si les deux commandes passent, le projet est dans un bon etat technique.

## 6. Probleme possible : port deja utilise

Si le port `3000` est deja pris, lance le site sur un autre port :

```powershell
npm.cmd run dev -- --port 3001
```

Puis ouvre :

```text
http://localhost:3001
```

## 7. Variables Supabase plus tard

Quand Supabase sera configure, il faudra creer un fichier `.env.local` a la racine du projet.

Exemple :

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=
```

Le fichier `.env.local` ne doit pas etre partage publiquement.
