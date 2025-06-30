const fs = require('fs');
const pdfParse = require('pdf-parse');
const { analyzeWithOpenAI } = require('./openaiService');

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
 * Analyse complète d'un PDF
 * @param {string} filePath - Chemin vers le fichier PDF
 * @returns {Promise<Object>} - Résultats de l'analyse
 */
const analyzePDF = async (filePath) => {
  try {
    console.log('🔍 Début de l\'analyse du PDF...');
    
    // Étape 1: Extraction du texte
    const extractedText = await extractTextFromPDF(filePath);
    
    // Étape 2: Analyse avec OpenAI
    const analysis = await analyzeWithOpenAI(extractedText);
    
    console.log('✅ Analyse terminée avec succès');
    
    return {
      summary: analysis.summary,
      keyPoints: analysis.keyPoints,
      suggestions: analysis.suggestions,
      metadata: {
        textLength: extractedText.length,
        analysisDate: new Date().toISOString(),
        model: 'gpt-4'
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