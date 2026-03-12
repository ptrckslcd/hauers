module.exports = {
  readinessScore:  74,
  readinessChange: 5,
  streak:          5,

  scoreHistory: [
    { week: 'Wk 1', score: 50 },
    { week: 'Wk 2', score: 54 },
    { week: 'Wk 3', score: 58 },
    { week: 'Wk 4', score: 63 },
    { week: 'Wk 5', score: 69 },
    { week: 'Wk 6', score: 74 },
  ],

  domainProgress: [
    { domain: 'Verbal Ability',    current: 75, baseline: 65, target: 80, color: '#7c3aed' },
    { domain: 'Numerical Ability', current: 55, baseline: 42, target: 80, color: '#ff9933' },
    { domain: 'Clerical Ability',  current: 58, baseline: 48, target: 80, color: '#3b82f6' },
  ],

  stats: {
    totalQuizzes:   18,
    totalSessions:  21,
    avgSessionMins: 38,
    totalQuestions: 270,
  },

  quizHistory: [
    { date: '2026-03-12', domain: 'All Domains',       score: 12, total: 15 },
    { date: '2026-03-11', domain: 'Numerical Ability', score:  6, total: 10 },
    { date: '2026-03-10', domain: 'Verbal Ability',    score:  8, total: 10 },
    { date: '2026-03-09', domain: 'Clerical Ability',  score:  7, total: 10 },
    { date: '2026-03-07', domain: 'All Domains',       score: 10, total: 15 },
  ],

  achievements: [
    { label: 'First Diagnostic', icon: '🎯', earned: true  },
    { label: '5-Day Streak',     icon: '🔥', earned: true  },
    { label: '10 Quizzes Done',  icon: '✅', earned: true  },
    { label: 'Score +10 pts',    icon: '📈', earned: true  },
    { label: 'Verbal 75+',       icon: '📚', earned: true  },
    { label: 'Reach 80%',        icon: '🏆', earned: false },
    { label: 'Full Mock Exam',   icon: '📝', earned: false },
    { label: '20-Day Streak',    icon: '⚡', earned: false },
  ],
};
