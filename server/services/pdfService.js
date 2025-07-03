const fs = require('fs');
const pdfParse = require('pdf-parse');
const { analyzeWithOpenAI } = require('./openaiService');
const { analyzeWithMistral } = require('../models/MistralRequest');

/**
 * Extrait le texte d'un fichier PDF
 * @param {string} filePath - Chemin vers le fichier PDF
 * @returns {Promise<string>} - Texte extrait du PDF
 */
const extractTextFromPDF = async (filePath) => {
  try {
    console.log('📖 Extraction du texte du PDF...');
    
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    
    if (!data.text || data.text.trim().length === 0) {
      throw new Error('Aucun texte trouvé dans le PDF');
    }
    
    console.log(`✅ Texte extrait: ${data.text.length} caractères`);
    return data.text.trim();
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'extraction du texte:', error);
    throw new Error(`Impossible d'extraire le texte du PDF: ${error.message}`);
  }
};
/**
 * Anonymise les données personnelles dans un texte brut
 * @param {string} text - Texte à anonymiser
 * @returns {string} - Texte anonymisé
 */
const anonymizeSensitiveData = (text) => {
  return text
    // Adresses e-mail
    .replace(/([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, '[EMAIL]')
    // Numéros de téléphone (français ou génériques)
    .replace(/(\+?\d{1,3}[ \-\.]?)?(\(?\d{2,4}\)?[ \-\.]?)?[\d \-\.]{6,}/g, '[PHONE]')
    // Numéros de compte/RIB/IBAN
    .replace(/\b([A-Z]{2}\d{2}[ ]?[0-9A-Z]{4,})(?:[ ]?[0-9A-Z]{4,}){1,5}\b/g, '[IBAN]')
    .replace(/\b\d{11,26}\b/g, '[ACCOUNT_NUMBER]')
    // Adresses postales (simplifiées)
    .replace(/\d{1,4}[^\n\r,]+(rue|avenue|boulevard|chemin|impasse|allée)[^\n\r]+/gi, '[ADDRESS]')
    // Noms propres (simple heuristique)
    .replace(/\b(Mr|Mme|Mlle|Monsieur|Madame)?\s?[A-Z][a-zéèêàîç\-]+ [A-Z][a-zéèêàîç\-]+\b/g)
    // Données médicales génériques (très simplifié)
    .replace(/\b(maladie|diagnostic|traitement|ordonnance|symptôme|hypertension sévère|allergie|hospitalisation)\b/gi, '[MEDICAL]');
};


/**
 * Analyse complète d'un PDF
 * @param {string} filePath - Chemin vers le fichier PDF
 * @returns {Promise<Object>} - Résultats de l'analyse
 */
const analyzePDF = async (filePath) => {
  try {
    console.log('🔍 Début de l\'analyse du PDF...');
    
    // Étape 1: Extraction du texte
    const extractedText = await extractTextFromPDF(filePath);
    
    //Etape 2: Anonymisation du texte
    const anonymizedText = await anonymizeSensitiveData(extractedText);
    
    // Étape 2: Analyse avec OpenAI
    const analysis = await analyzeWithMistral(anonymizedText);//await analyzeWithOpenAI(anonymizedText)
    
    console.log('✅ Analyse terminée avec succès');
    
    return {
      summary: analysis.summary,
      keyPoints: analysis.keyPoints,
      suggestions: analysis.suggestions,
      metadata: {
        textLength: extractedText.length,
        analysisDate: new Date().toISOString(),
        model: 'mistral'
      }
    };
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'analyse du PDF:', error);
    throw error;
  }
};

module.exports = {
  extractTextFromPDF,
  analyzePDF
}; 