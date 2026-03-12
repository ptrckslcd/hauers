const express       = require('express');
const path          = require('path');
const requireAdmin  = require('../middleware/requireAdmin');
const questions     = require('../data/mock-questions');
const adminDashboard = require('../data/mock-admin-dashboard');

const router = express.Router();

router.get('/dashboard', requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin-dashboard.html'));
});

router.get('/users', requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin-users.html'));
});

router.get('/users/:id', requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin-user-detail.html'));
});

router.get('/question-bank', requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin-question-bank.html'));
});

router.get('/question-bank/:id', requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin-question-detail.html'));
});

router.get('/analytics', requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin-analytics.html'));
});

/* ── API: all questions (admin — includes answers) ─────────── */
router.get('/api/questions', requireAdmin, (req, res) => {
  res.json({ questions, total: questions.length });
});

/* ── API: search ─────────────────────────────────────────────── */
// GET /admin/api/search?q=term&scope=questions&domain=all&difficulty=all
router.get('/api/search', requireAdmin, (req, res) => {
  const { q = '', scope = 'questions', domain = 'all', difficulty = 'all' } = req.query;
  const query = q.toLowerCase().trim();

  if (scope === 'questions') {
    let results = questions;
    if (query) {
      results = results.filter(qn =>
        qn.question.toLowerCase().includes(query) ||
        qn.domain.toLowerCase().includes(query)   ||
        qn.choices.some(c => c.toLowerCase().includes(query))
      );
    }
    if (domain     !== 'all') results = results.filter(qn => qn.domain     === domain);
    if (difficulty !== 'all') results = results.filter(qn => qn.difficulty === difficulty);
    return res.json({ results, total: results.length, query });
  }

  res.status(400).json({ error: 'Unknown scope' });
});

/* ── API: admin dashboard stats ─────────────────────────── */
router.get('/api/dashboard', requireAdmin, (req, res) => {
  res.json(adminDashboard);
});

/* ── API: current admin user ─────────────────────────────── */
router.get('/api/user', requireAdmin, (req, res) => {
  const u = req.session.user;
  if (!u) return res.status(401).json({ error: 'Not authenticated' });
  res.json({ firstName: u.firstName, lastName: u.lastName, email: u.email });
});

module.exports = router;