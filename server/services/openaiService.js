const OpenAI = require('openai');

// Initialisation du client OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-proj-1234567890',
});

/**
 * Analyse un texte avec OpenAI et génère un résumé structuré
 * @param {string} text - Texte à analyser
 * @returns {Promise<Object>} - Résultats de l'analyse
 */
const analyzeWithOpenAI = async (text) => {
  try {
    console.log('🤖 Analyse avec OpenAI...');
    
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('Clé API OpenAI manquante');
    }

    // Limiter la taille du texte pour éviter les dépassements de tokens
    const maxTextLength = 8000; // Limite conservatrice
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
    "point clé 2",
    "point clé 3"
  ],
  "suggestions": [
    "suggestion 1",
    "suggestion 2",
    "suggestion 3"
  ]
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Tu es un assistant spécialisé dans l'analyse de documents. Tu fournis des analyses structurées et des recommandations pratiques. Réponds toujours en français et au format JSON demandé."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const response = completion.choices[0].message.content;
    
    // Parser la réponse JSON
    let analysis;
    try {
      // Essayer de parser directement
      analysis = JSON.parse(response);
    } catch (parseError) {
      // Si le parsing échoue, essayer d'extraire le JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Impossible de parser la réponse d\'OpenAI');
      }
    }

    // Validation de la structure
    if (!analysis.summary || !analysis.keyPoints || !analysis.suggestions) {
      throw new Error('Réponse OpenAI mal formatée');
    }

    console.log('✅ Analyse OpenAI terminée');
    
    return {
      summary: analysis.summary,
      keyPoints: Array.isArray(analysis.keyPoints) ? analysis.keyPoints : [analysis.keyPoints],
      suggestions: Array.isArray(analysis.suggestions) ? analysis.suggestions : [analysis.suggestions]
    };

  } catch (error) {
    console.error('❌ Erreur OpenAI:', error);
    
    if (error.code === 'insufficient_quota') {
      throw new Error('Quota OpenAI épuisé. Veuillez vérifier votre compte OpenAI.');
    } else if (error.code === 'invalid_api_key') {
      throw new Error('Clé API OpenAI invalide. Veuillez vérifier votre configuration.');
    } else {
      throw new Error(`Erreur lors de l'analyse avec OpenAI: ${error.message}`);
    }
  }
};

/**
 * Teste la connexion à l'API OpenAI
 * @returns {Promise<boolean>} - True si la connexion fonctionne
 */
const testOpenAIConnection = async () => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Test" }],
      max_tokens: 5,
    });
    return true;
  } catch (error) {
    console.error('❌ Test de connexion OpenAI échoué:', error.message);
    return false;
  }
};

module.exports = {
  analyzeWithOpenAI,
  testOpenAIConnection
}; 