# 11 - Hebergement Vercel et mises a jour

Ce document explique comment le site est heberge sur Vercel et combien de temps prend une mise a jour apres une modification du code.

## Idee simple

Le code du projet est stocke sur GitHub.

Vercel est connecte au depot GitHub. Quand une modification est envoyee sur GitHub, Vercel detecte le nouveau commit, reconstruit le site, puis publie une nouvelle version.

Dans le flux normal :

1. On modifie le code localement.
2. On teste en local.
3. On commit les changements.
4. On push sur GitHub.
5. Vercel lance automatiquement un deploiement.
6. Si le build reussit, le site en ligne est mis a jour.

## Production et preview

Vercel separe deux types de deploiements importants.

### Production

La production est le vrai site public, par exemple :

```text
https://islamcars.com
```

En general, la branche GitHub `main` est la branche de production. Quand un commit est pousse sur `main`, Vercel lance un deploiement de production.

### Preview

Une preview est une version de test creee automatiquement pour une autre branche ou une pull request.

Elle a une URL Vercel separee. Elle permet de verifier une modification avant de toucher au vrai site public.

Exemple de flux plus prudent :

1. Creer une branche `fix-bug-reservation`.
2. Pousser la branche sur GitHub.
3. Tester l'URL preview donnee par Vercel.
4. Fusionner dans `main` seulement si tout est bon.
5. Vercel met la production a jour.

## Combien de temps pour mettre a jour le site ?

Pour une modification normale du code, il faut compter en general :

```text
2 a 5 minutes
```

Ce delai inclut :

- le push vers GitHub ;
- le demarrage du build Vercel ;
- l'installation ou la reutilisation du cache ;
- la compilation Next.js ;
- la publication de la nouvelle version.

Pour une petite correction, le site peut parfois etre mis a jour en moins de 2 minutes.

Pour une modification plus lourde, ou si Vercel doit refaire plus de travail, il faut plutot prevoir :

```text
5 a 10 minutes
```

## Cas qui peuvent prendre plus longtemps

### Erreur de build

Si le build echoue, le site public ne sera pas remplace par une version cassee. L'ancienne version reste en ligne.

Il faut alors :

1. Ouvrir Vercel.
2. Aller dans le projet.
3. Ouvrir l'onglet `Deployments`.
4. Cliquer sur le deploiement en erreur.
5. Lire les logs.
6. Corriger le code.
7. Commit et push a nouveau.

Temps typique pour corriger : cela depend du bug. Une erreur simple peut prendre 5 a 15 minutes. Une erreur liee a Supabase, aux variables d'environnement ou a la base de donnees peut prendre plus longtemps.

### Variables d'environnement

Les variables comme celles de Supabase sont configurees dans Vercel :

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY
```

Important : quand une variable d'environnement est modifiee dans Vercel, elle s'applique au prochain deploiement. Il faut donc redeployer apres le changement.

### Domaine et DNS

Le code se met a jour rapidement, mais le nom de domaine peut prendre plus longtemps au moment de la premiere configuration.

Pour un domaine deja configure, une mise a jour du code ne demande normalement pas de changement DNS.

Pour un nouveau domaine ou une modification DNS, il faut prevoir :

```text
quelques minutes a plusieurs heures
```

Dans certains cas rares, la propagation DNS peut prendre jusqu'a 24-48 heures selon le fournisseur du domaine.

## Procedure de correction urgente

Si un probleme est detecte apres livraison :

1. Reproduire le probleme en local si possible.
2. Corriger le code.
3. Lancer les verifications locales :

```powershell
npm.cmd run lint
npm.cmd run build
```

4. Commit la correction :

```powershell
git add -A
git commit -m "Fixed the production issue"
```

5. Envoyer sur GitHub :

```powershell
git push
```

6. Ouvrir Vercel et verifier le deploiement.
7. Tester le site public quand le statut est `Ready`.

Delai raisonnable a annoncer au client pour une petite correction :

```text
environ 5 a 15 minutes apres validation de la correction
```

Ce delai suppose que le probleme est deja compris et que le build Vercel passe.

## Si le site casse apres une mise a jour

Vercel garde les anciens deploiements. Si une nouvelle version pose probleme, il est possible de revenir a une version precedente depuis le dashboard Vercel.

Procedure :

1. Ouvrir Vercel.
2. Aller dans le projet.
3. Aller dans `Deployments`.
4. Trouver un ancien deploiement stable.
5. Utiliser l'action de rollback ou de promotion selon l'interface disponible.
6. Verifier le domaine public.

Le rollback est souvent plus rapide qu'une correction complete, car il remet en ligne une version deja construite.

## Checklist avant livraison

- Le depot GitHub est connecte a Vercel.
- La branche de production est bien `main`.
- Les variables d'environnement sont configurees dans Vercel.
- Le dernier deploiement Vercel est en statut `Ready`.
- Le domaine public fonctionne en HTTPS.
- Une reservation test fonctionne.
- L'admin peut se connecter.
- Les pages voitures fonctionnent.
- La procedure de correction urgente est connue.

## Sources utiles

- Documentation Vercel sur les deploiements Git : https://vercel.com/docs/git
- Documentation Vercel sur les deploiements : https://vercel.com/docs/deployments
- Documentation Vercel sur les variables d'environnement : https://vercel.com/docs/environment-variables
