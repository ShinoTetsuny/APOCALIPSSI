const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { anonymiserNom, anonymiserEmail } = require('../services/anonymisationService');

const router = express.Router();

// Service d'anonymisation
function anonymizeData(data) {
  const anonymized = { ...data };
  if (anonymized.username) anonymized.username = anonymiserNom(anonymized.username, anonymized._id);
  if (anonymized.email) anonymized.email = anonymiserEmail(anonymized.email, anonymized._id);
  return anonymized;
}

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Nom d’utilisateur et mot de passe requis' });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: 'Utilisateur déjà existant' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, email });
    await user.save();
    // Anonymiser les données avant de répondre
    const anonymizedUser = anonymizeData(user.toObject());
    res.status(201).json({ message: 'Utilisateur créé avec succès', user: anonymizedUser });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l’inscription', message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Nom d’utilisateur et mot de passe requis' });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }
    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la connexion', message: error.message });
  }
});

// Endpoint pour anonymiser un utilisateur existant
router.post('/anonymize/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    user.username = anonymiserNom(user.username, user._id);
    if (user.email) user.email = anonymiserEmail(user.email, user._id);
    await user.save();
    res.json({ message: 'Utilisateur anonymisé', user: anonymizeData(user.toObject()) });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'anonymisation', message: error.message });
  }
});

// Export anonymisé des utilisateurs (synthèse/export RGPD)
router.get('/export-users', async (req, res) => {
  try {
    const users = await User.find({});
    const anonymizedUsers = users.map(u => anonymizeData(u.toObject()));
    res.json({ users: anonymizedUsers });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'export des utilisateurs', message: error.message });
  }
});

module.exports = router;
