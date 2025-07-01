
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// Import the main app
let app;
let server;

beforeAll(async () => {
  // Set test environment variables
  process.env.JWT_SECRET = 'testsecret';
  process.env.NODE_ENV = 'test';
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/pdfanalyzer_test';

  // Connect to a test database
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Import the app after setting env vars
  app = require('../server');
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
});

describe('Authentification', () => {
  afterEach(async () => {
    // Clean up users after each test
    const User = require('../models/User');
    await User.deleteMany({});
  });

  it('devrait inscrire un nouvel utilisateur', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'testpass' });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBeDefined();
  });

  it('devrait empêcher l\'inscription d\'un utilisateur existant', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'testpass' });
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'testpass' });
    expect(res.statusCode).toBe(409);
    expect(res.body.error).toBeDefined();
  });

  it('devrait connecter un utilisateur', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'testpass' });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'testpass' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('devrait refuser la connexion avec un mauvais mot de passe', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'testpass' });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'wrongpass' });
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBeDefined();
  });
});

describe('Upload et analyse de PDF', () => {
  let authToken;

  beforeEach(async () => {
    // Register and login to get a token
    await request(app)
      .post('/api/auth/register')
      .send({ username: 'pdfuser', password: 'pdfpass' });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'pdfuser', password: 'pdfpass' });
    authToken = res.body.token;
  });

  it('devrait uploader un fichier PDF', async () => {
    // Créer un faux fichier PDF temporaire
    const testPdfPath = path.join(__dirname, 'test.pdf');
    fs.writeFileSync(testPdfPath, '%PDF-1.4\n%Fake PDF for test');
    const res = await request(app)
      .post('/api/pdf/upload')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('file', testPdfPath);
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body.message).toBeDefined();
    fs.unlinkSync(testPdfPath);
  });

  it('devrait retourner une erreur si aucun fichier n\'est envoyé', async () => {
    const res = await request(app)
      .post('/api/pdf/upload')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });
});
