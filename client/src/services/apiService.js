import axios from 'axios';

// Configuration de base d'axios
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes pour l'analyse
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Intercepteur pour les requêtes
apiClient.interceptors.request.use(
  (config) => {
    console.log(`🚀 Requête API: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Erreur de requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Réponse API: ${response.status}`);
    return response;
  },
  (error) => {
    console.error('❌ Erreur de réponse:', error);
    
    let errorMessage = 'Une erreur est survenue';
    
    if (error.response) {
      // Erreur de réponse du serveur
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          errorMessage = data.message || 'Données invalides';
          break;
        case 413:
          errorMessage = 'Fichier trop volumineux';
          break;
        case 500:
          errorMessage = data.message || 'Erreur interne du serveur';
          break;
        default:
          errorMessage = data.message || `Erreur ${status}`;
      }
    } else if (error.request) {
      // Erreur de réseau
      errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion.';
    } else {
      // Autre erreur
      errorMessage = error.message || 'Erreur inconnue';
    }
    
    return Promise.reject(new Error(errorMessage));
  }
);

/**
 * Analyse un document (PDF, Word, etc.)
 * @param {File} file - Fichier document à analyser
 * @returns {Promise<Object>} - Résultats de l'analyse
 */
export const analyzeDocument = async (file) => {
  try {
    const formData = new FormData();
    formData.append('pdf', file);

    const response = await apiClient.post('/pdf/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Vérifie le statut de l'API
 * @returns {Promise<Object>} - Statut de l'API
 */
export const checkAPIStatus = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Vérifie le statut du service de traitement de documents
 * @returns {Promise<Object>} - Statut du service
 */
export const checkDocumentServiceStatus = async () => {
  try {
    const response = await apiClient.get('/pdf/status');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default apiClient; 