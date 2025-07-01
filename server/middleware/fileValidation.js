const validatePDFFile = (req, res, next) => {
  try {
    // Vérifier si un fichier a été uploadé
    if (!req.file) {
      return res.status(400).json({
        error: 'Aucun fichier fourni',
        message: 'Veuillez sélectionner un fichier PDF'
      });
    }

    // Vérifier le type MIME
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({
        error: 'Type de fichier non autorisé',
        message: 'Seuls les fichiers PDF sont acceptés'
      });
    }

    // Vérifier la taille du fichier
    const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024; // 10MB par défaut
    if (req.file.size > maxSize) {
      return res.status(400).json({
        error: 'Fichier trop volumineux',
        message: `La taille maximale autorisée est de ${maxSize / (1024 * 1024)}MB`
      });
    }

    // Vérifier que le fichier existe physiquement
    if (!req.file.path) {
      return res.status(400).json({
        error: 'Erreur lors de l\'upload',
        message: 'Le fichier n\'a pas pu être sauvegardé'
      });
    }

    console.log(`✅ Fichier validé: ${req.file.originalname} (${req.file.size} bytes)`);
    next();

  } catch (error) {
    console.error('❌ Erreur de validation du fichier:', error);
    res.status(500).json({
      error: 'Erreur lors de la validation du fichier',
      message: error.message
    });
  }
};

module.exports = {
  validatePDFFile
}; 