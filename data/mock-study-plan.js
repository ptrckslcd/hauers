module.exports = {
  examDate: '2026-04-27',
  totalWeeks: 7,

  /* Current week number (1-based) */
  currentWeek: 3,

  /* Weekly targets */
  weeklyGoal: {
    quizzes: 5,
    quizzesDone: 3,
    readings: 4,
    readingsDone: 2,
    practiceItems: 20,
    practiceItemsDone: 14,
  },

  /* Daily tasks for the current week (Mon–Sun) */
  dailyTasks: [
    { day: 'Mon', date: '2026-03-09', done: true,  tasks: ['Verbal: synonyms & antonyms drill', 'Numerical: fractions review'] },
    { day: 'Tue', date: '2026-03-10', done: true,  tasks: ['Clerical: alphabetical filing practice', '5-item quiz'] },
    { day: 'Wed', date: '2026-03-11', done: true,  tasks: ['Numerical: percentages worksheet', 'Verbal: reading comprehension'] },
    { day: 'Thu', date: '2026-03-12', done: false, tasks: ['Clerical: office procedures drill', '5-item quiz'] },
    { day: 'Fri', date: '2026-03-13', done: false, tasks: ['Numerical: ratio & proportion practice', 'Full mock set (10 items)'] },
    { day: 'Sat', date: '2026-03-14', done: false, tasks: ['Review weak items from the week', 'Rest &amp; light reading'] },
    { day: 'Sun', date: '2026-03-15', done: false, tasks: ['Rest day — optional light review'] },
  ],

  /* Phase plan across 7 weeks */
  phases: [
    {
      label: 'Phase 1',
      title: 'Foundations',
      weeks: '1–2',
      done: true,
      color: 'green',
      items: [
        'Cover all three CSE domains at a high level',
        'Complete diagnostic exam to identify gaps',
        'Build daily study habit (30–45 min)',
      ],
    },
    {
      label: 'Phase 2',
      title: 'Targeted Drilling',
      weeks: '3–4',
      done: false,
      current: true,
      color: 'orange',
      items: [
        'Deep-dive Numerical & Clerical weak areas',
        'Complete 5 graded quizzes per week',
        'Review incorrect answers and explanations',
      ],
    },
    {
      label: 'Phase 3',
      title: 'Mock Exams',
      weeks: '5–6',
      done: false,
      color: 'purple',
      items: [
        'Full-length timed mock exam each week',
        'Simulate CSE paper-and-pen conditions',
        'Track score trend toward 80% passing mark',
      ],
    },
    {
      label: 'Phase 4',
      title: 'Final Review',
      weeks: '7',
      done: false,
      color: 'pink',
      items: [
        'Light review of all three domains',
        'No new material — reinforce strengths',
        'Rest and mental preparation',
      ],
    },
  ],

  /* Recommended resources per domain */
  resources: [
    {
      domain: 'Verbal Ability',
      icon: '📚',
      items: [
        'Vocabulary Builder: Civil Service Edition',
        'Reading Comprehension Practice Sets A–D',
        'Grammar & Correct Usage Drills',
      ],
    },
    {
      domain: 'Numerical Ability',
      icon: '🔢',
      items: [
        'Fractions, Decimals & Percentages Workbook',
        'Ratio & Proportion Mastery Set',
        'Algebraic Equations Step-by-Step',
      ],
    },
    {
      domain: 'Clerical Ability',
      icon: '🗂️',
      items: [
        'Alphabetical Filing Practice Drills',
        'Office Procedures & Operations Guide',
        'Clerical Speed & Accuracy Exercises',
      ],
    },
  ],
};
