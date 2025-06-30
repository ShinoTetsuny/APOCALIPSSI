# PDF Analyzer

Une application web pour analyser des documents PDF et générer des résumés structurés avec des points clés et suggestions d'actions.

## 🚀 Fonctionnalités

- Upload de documents PDF
- Extraction automatique du texte
- Génération de résumés structurés via API LLM
- Affichage des points clés
- Suggestions d'actions
- Interface utilisateur moderne et responsive

## 🛠️ Technologies

### Frontend
- React.js
- Axios pour les requêtes HTTP
- Tailwind CSS pour le styling
- React Dropzone pour l'upload de fichiers

### Backend
- Node.js avec Express
- Multer pour la gestion des fichiers
- pdf-parse pour l'extraction de texte
- OpenAI API pour l'analyse LLM

## 📦 Installation

### Prérequis
- Node.js (v16+)
- npm ou yarn
- Clé API OpenAI

### Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd pdf-analyzer
```

2. **Installer les dépendances**
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

3. **Configuration**
```bash
# Dans le dossier server, créer un fichier .env
cp .env.example .env
# Ajouter votre clé API OpenAI
OPENAI_API_KEY=your_openai_api_key_here
```

4. **Lancer l'application**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

## 🐳 Docker (Optionnel)

```bash
docker-compose up --build
```

## 📝 Utilisation

1. Ouvrez votre navigateur sur `http://localhost:3000`
2. Cliquez sur "Choisir un fichier" ou glissez-déposez un PDF
3. Cliquez sur "Analyser le document"
4. Attendez l'analyse et consultez les résultats

## 🔧 Configuration

### Variables d'environnement

Dans `server/.env`:
```
PORT=5000
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=development
```

## 📁 Structure du projet

```
pdf-analyzer/
├── client/                 # Frontend React
│   ├── public/
│   ├── src/
│   │   ├── components/     # Composants React
│   │   ├── services/       # Services API
│   │   └── App.js
│   └── package.json
├── server/                 # Backend Node.js
│   ├── routes/            # Routes API
│   ├── middleware/        # Middleware
│   ├── services/          # Services (OpenAI, PDF parsing)
│   └── package.json
└── docker-compose.yml
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails. 