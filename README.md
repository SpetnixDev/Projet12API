# Projet12

Application web de mise en relation entre associations et citoyens.

## Prérequis

- Docker
- Node.js 20.9 ou plus récent
- npm

Le backend tourne dans Docker. Le frontend Next se lance à part en local.

## Variables d'environnement

Créer le fichier d'environnement Docker :

```powershell
Copy-Item docker/dev/.env.example docker/dev/.env
```

Puis remplir `docker/dev/.env`

Créer le fichier d'environnement du frontend :

```powershell
Copy-Item frontend/.env.example frontend/.env.local
```

Valeur attendue :

```env
SPRING_API_URL=http://localhost:8080/api/v1
```

## Lancer le backend

Depuis la racine du projet :

```powershell
.\dev.ps1 up:build
```

Commandes utiles :

```powershell
.\dev.ps1 up
.\dev.ps1 logs
.\dev.ps1 down
.\dev.ps1 down:volumes
.\dev.ps1 up:reset
```

(L'ensemble des commandes est disponible dans `dev.ps1` ou via `.\dev.ps1 help`.)

En profil `dev`, Flyway applique les migrations et charge aussi les données de `src/main/resources/db/testdata`.

URLs utiles :

- API : `http://localhost:8080`
- PgAdmin : `http://localhost:5050`
- PostgreSQL : `localhost:5433`

## Lancer le frontend

Dans un autre terminal :

```powershell
cd frontend
npm install
npm run dev
```

Le frontend est disponible sur :

```text
http://localhost:3000
```

## Vérification rapide

Backend :

```powershell
.\mvnw.cmd test
```

Frontend :

```powershell
cd frontend
npm run lint
npm run build
```
