# Projet12

Application Next.js 16 avec App Router pour consulter des associations et gerer l'authentification via un backend Spring.

## Stack

- Next.js 16.1.6
- React 19.2
- TypeScript 5
- Tailwind CSS 4
- App Router

## Demarrage

Prerequis:

- Node.js 20.9 ou plus recent
- un backend Spring accessible via `SPRING_API_URL`

Installation et lancement:

```bash
npm install
npm run dev
```

Application disponible sur `http://localhost:3000`.

## Variables d'environnement

Créer un fichier `.env.local` a la racine du projet:

```env
SPRING_API_URL=http://localhost:8080/api/v1
```

## Structure

```text
src/
	app/
		api/auth/         route handlers de proxy auth
		association/[id]/ fiche association
		associations/     liste et recherche
		auth/login/       page de connexion canonique
		auth/register/    page d'inscription canonique
	components/         composants UI partages
	lib/
		association/      acces serveur fiche association
		associations/     acces serveur liste associations
		auth/             client auth navigateur
		http/             helpers query et reponses serveur
		spring/           client serveur vers l'API Spring
	types/              types metier
```

## Routes principales

- `/`
- `/associations`
- `/association/[id]`
- `/auth/login`
- `/auth/register?type=USER`

## Authentification

- le frontend passe par des route handlers Next sous `src/app/api/auth/*`
- ces handlers appellent le backend Spring et relaient les cookies d'authentification
- les pages serveur lisent les cookies via `cookies()`
- en cas de `401`, les pages protegees passent par `/api/auth/refresh?next=...`
- si le refresh echoue, l'utilisateur est redirige vers `/auth/login`

## Bonnes pratiques Next 16 retenues

- App Router uniquement
- `params`, `searchParams` et `cookies()` utilises selon le modele asynchrone
- pas d'ecriture de cookies dans les helpers serveur partages par les pages
- route handlers utilises pour les flux d'auth et le forwarding des `Set-Cookie`
- scripts compatibles Next 16 et Turbopack par defaut

## Validation

```bash
npm run build
```

Le build de production doit passer avant toute livraison.
