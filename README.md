# CodeNShare
CodeNShare est un réseau social destiné aux développeurs où vous pouvez publier du code, exécuter des pipelines de traitement de code, et interagir avec une communauté de développeurs. Ce projet utilise une architecture microservices pour assurer une modularité et une scalabilité optimales.

## Fonctionnalités
### Publication de Code:
 Partagez votre code avec la communauté, obtenez des retours et améliorez vos compétences.
### Exécution de Pipelines: Déclenchez des pipelines d'exécution de code pour tester et traiter vos scripts.
### Interaction Sociale: Suivez d'autres développeurs, commentez et aimez les publications de code.

##Architecture
Le projet utilise une architecture microservices pour offrir une flexibilité et une scalabilité améliorées. Voici un aperçu des principaux services :

### Frontend: 
Application React pour l'interface utilisateur.
### Backend API: API GATEWAY pour la gestion des utilisateurs, des publications, et des pipelines.

#### Service de Pipeline: Exécute les pipelines de traitement de code et retourne les résultats.
### Service de Fichiers: Gère le stockage et la récupération des fichiers de code et des résultats intermédiaires.
### Base de Données: Stocke les données des utilisateurs, des publications, et des résultats des pipelines.

#Prérequis
Node.js: Version 14 ou supérieure
npm: Version 6 ou supérieure
Installation
Clonez le Répertoire


###Copier le code
    git clone https://github.com/votre-utilisateur/CodeNShare.git
    Accédez au Dossier du Projet




    npm install

### Démarrage en Local


    npm start
L'application démarrera sur http://localhost:3000 par défaut.
