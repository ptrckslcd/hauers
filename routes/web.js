const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/landing.html'));
});

router.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/signup.html'));
});

router.get('/signup-success', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/signup-success.html'));
});

router.get('/forgot-password', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/forgot-password.html'));
});

router.get('/otp', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/otp.html'));
});

router.get('/email-verified', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/email-verified.html'));
});

router.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/reset-password.html'));
});

router.get('/terms', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/terms.html'));
});

router.get('/privacy', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/privacy.html'));
});

module.exports = router;