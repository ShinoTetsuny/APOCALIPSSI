# Étape 1 : Utilise une image officielle de Node.js légère
FROM node:20-alpine

# Étape 2 : Crée un dossier de travail dans l’image
WORKDIR /app

# Étape 3 : Copie les fichiers package.json et package-lock.json
COPY package*.json ./

# Étape 4 : Installe les dépendances
RUN npm install

# Étape 5 : Copie tout le code de ton projet dans l’image
COPY . .

# Étape 6 : Copie ton fichier .env si tu veux l’intégrer (optionnel, sinon utilise Docker secrets/env vars à l’exécution)
# COPY .env .env

# Étape 7 : Expose le port utilisé par ton serveur (défini dans .env → 5000)
EXPOSE 5000

# Étape 8 : Lancer le serveur
CMD ["npm", "start"]
