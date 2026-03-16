const express = require('express');
const path = require('path');
const users = require('../data/mock-users');

const router = express.Router();

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login.html'));
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.redirect('/login?error=1');
  }

  req.session.user = user;

  if (user.role === 'admin') {
    return res.redirect('/admin/dashboard');
  }

  return res.redirect('/reviewee/dashboard');
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// ── Auth flow POST routes ────────────────────────────────────────────
router.post('/signup', (req, res) => {
  // TODO: create user, send OTP email
  // Store email in session so verify-email can log the user in
  req.session.pendingEmail = req.body.email;
  res.redirect('/signup-success');
});

router.post('/verify-email', (req, res) => {
  // TODO: verify OTP from email
  // Log the user in using the email stored during signup
  const email = req.session.pendingEmail;
  let user = email && users.find(u => u.email === email);

  if (!user && email) {
    user = {
      id: Date.now(),
      role: 'reviewee',
      email: email,
      password: 'password123',
      firstName: 'New',
      lastName: 'User'
    };
    users.push(user);
  }

  if (user) {
    req.session.user = user;
    delete req.session.pendingEmail;
  }
  res.redirect('/email-verified');
});

router.post('/forgot-password', (req, res) => {
  // TODO: send password-reset OTP
  // Step-transition is handled client-side; this handles JS-disabled fallback
  res.redirect('/forgot-password');
});

router.post('/verify-otp', (req, res) => {
  // TODO: verify OTP, attach reset token to session
  res.redirect('/reset-password');
});

router.post('/reset-password', (req, res) => {
  // TODO: validate token, update password
  res.redirect('/login');
});

module.exports = router;