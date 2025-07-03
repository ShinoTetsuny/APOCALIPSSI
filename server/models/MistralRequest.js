const axios = require('axios');
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

/**
 * Analyse un texte avec Mistral (via Ollama) et génère un résumé structuré
 * @param {string} text - Texte à analyser
 * @returns {Promise<Object>} - Résultats de l'analyse
 */
const analyzeWithMistral = async (text) => {
  try {
    console.log('🧠 Analyse avec Mistral (local)...');

    const maxTextLength = 8000;
    const truncatedText = text.length > maxTextLength
      ? text.substring(0, maxTextLength) + '...'
      : text;

    const prompt = `
Analyse le document suivant et fournis une réponse structurée en français au format JSON avec les sections suivantes:

1. **Résumé** (200-300 mots): Un résumé concis et bien structuré du document
2. **Points clés** (5-8 points): Les informations les plus importantes sous forme de liste
3. **Suggestions d'actions** (3-5 suggestions): Actions concrètes à entreprendre basées sur le contenu

Document à analyser:
${truncatedText}

Réponds UNIQUEMENT avec un objet JSON valide au format suivant:
{
  "summary": "résumé du document...",
  "keyPoints": [
    "point clé 1",
    "point clé 2"
  ],
  "suggestions": [
    "suggestion 1",
    "suggestion 2"
  ]
}
`;

    const response = await axios.post(`${OLLAMA_BASE_URL}/api/chat`, {
      model: 'mistral',
      messages: [
        { role: 'system', content: 'Tu es un assistant spécialisé dans l\'analyse de documents.' },
        { role: 'user', content: prompt }
      ],
      stream: false
    });

    const content = response.data.message.content;

    let analysis;
    try {
      analysis = JSON.parse(content);
    } catch (parseError) {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Impossible de parser la réponse de Mistral');
      }
    }

    if (!analysis.summary || !analysis.keyPoints || !analysis.suggestions) {
      throw new Error('Réponse Mistral mal formatée');
    }

    console.log('✅ Analyse Mistral terminée');
    return analysis;

  } catch (error) {
    console.error('❌ Erreur Mistral:', error.message);
    throw new Error(`Erreur Mistral : ${error.message}`);
  }
};

/**
 * Teste la connexion avec le serveur local Mistral (Ollama)
 */
const testMistralConnection = async () => {
  try {
    const res = await axios.post(`${OLLAMA_BASE_URL}/api/chat`, {
      model: 'mistral',
      messages: [{ role: 'user', content: 'Bonjour' }],
      stream: false
    });
    return !!res.data;
  } catch (err) {
    console.error('❌ Test de connexion Mistral échoué:', err.message);
    return false;
  }
};

module.exports = {
  analyzeWithMistral,
  testMistralConnection
};
