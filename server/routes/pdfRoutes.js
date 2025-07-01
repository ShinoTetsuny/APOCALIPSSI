const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { analyzePDF } = require('../services/pdfService');
const { validatePDFFile } = require('../middleware/fileValidation');

const router = express.Router();

// Configuration de Multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB par défaut
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers PDF sont autorisés'), false);
    }
  }
});


// Route pour uploader un PDF (utilisée par les tests)
router.post('/upload', upload.single('file'), validatePDFFile, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier PDF fourni' });
    }
    // Ici, on ne fait qu’accepter le fichier et répondre OK (pour les tests)
    // Nettoyer le fichier temporaire
    fs.unlinkSync(req.file.path);
    res.status(200).json({ message: 'Fichier PDF uploadé avec succès', filename: req.file.originalname });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Erreur lors de l’upload', message: error.message });
  }
});

// Route pour analyser un PDF
router.post('/analyze', upload.single('pdf'), validatePDFFile, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier PDF fourni' });
    }

    console.log(`📄 Analyse du fichier: ${req.file.originalname}`);

    // Analyser le PDF
    const analysis = await analyzePDF(req.file.path);

    // Nettoyer le fichier temporaire
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      data: analysis,
      filename: req.file.originalname,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'analyse:', error);
    
    // Nettoyer le fichier en cas d'erreur
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: 'Erreur lors de l\'analyse du PDF',
      message: error.message
    });
  }
});

// Route pour vérifier le statut de l'API
router.get('/status', (req, res) => {
  res.json({
    status: 'OK',
    service: 'PDF Analyzer',
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 