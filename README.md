# Boite aux Lettres

## Installation

Clonner le repo git via la commande

```
git clone https://github.com/ColinPallier/boiteLettre.git
cd boiteLettre
```

Utiliser la commande suite après avoir modifié le fichier .env.example

```:
cp .env.example .env
```

Utiliser la commande suivante afin de créer le conteneur docker contenant la base PG et le front de l'application

```
docker-compose up -d
```

Pour des raisons de compatibilité je n'ai pas pu dockerizer l'API il faut donc le lancer via la commande suivante

```
cd ./serveur &&  npm start
```

### Présentation de l'application

/Users/colinpallier/Documents/Cours/S9/IOT/TP-BOITE/boiteLettre/rapport/captureProjet.png
