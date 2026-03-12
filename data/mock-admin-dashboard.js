module.exports = {
  totalUsers: 126,
  activeReviewees: 87,
  avgReadiness: 68,
  recentSignups: 14,
  passRate: 34,
  weakestCommonDomains: ['Numerical Ability', 'Analytical Ability'],
  domainAverages: [
    { domain: 'Verbal Ability',      avg: 72 },
    { domain: 'Numerical Ability',   avg: 54 },
    { domain: 'Analytical Ability',  avg: 61 },
    { domain: 'Clerical Ability',    avg: 75 },
    { domain: 'General Information', avg: 66 },
  ],
  usersByLevel: [
    { level: 'Professional',     count: 58 },
    { level: 'Sub-professional', count: 41 },
    { level: 'Both',             count: 27 },
  ],
  recentActivity: [
    { type: 'signup',     text: 'New user registered: Juan D.',             time: '2 min ago'  },
    { type: 'diagnostic', text: 'Maria S. completed diagnostic — score 74',  time: '18 min ago' },
    { type: 'signup',     text: 'New user registered: Carlo M.',            time: '45 min ago' },
    { type: 'quiz',       text: 'Ana R. finished 20-item quiz — 85%',       time: '1 hr ago'   },
    { type: 'signup',     text: 'New user registered: Lena T.',             time: '2 hr ago'   },
  ],
};