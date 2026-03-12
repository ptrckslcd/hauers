/**
 * app-shell.js
 * Handles: sidebar collapse/expand, navbar partial injection,
 *          sidebar partial injection, active link highlighting,
 *          page title sync, and mock-data population.
 */
document.addEventListener('DOMContentLoaded', async () => {

  /* ── 1. Inject partials ────────────────────────────────── */
  async function loadPartial(placeholderId, url) {
    const el = document.getElementById(placeholderId);
    if (!el) return;
    try {
      const r = await fetch(url);
      if (r.ok) el.innerHTML = await r.text();
    } catch (_) {}
  }

  await Promise.all([
    loadPartial('navbar-placeholder', '/partials/navbar.html'),
    loadPartial('sidebar-placeholder', '/partials/sidebar.html'),
  ]);

  /* ── Inject Material Symbols Outlined font (sidebar icons) ── */
  if (!document.getElementById('mat-symbols-css')) {
    const _msLink = document.createElement('link');
    _msLink.id   = 'mat-symbols-css';
    _msLink.rel  = 'stylesheet';
    _msLink.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap';
    document.head.appendChild(_msLink);
  }

  /* ── 2. Theme toggle init ─────────────────────────────── */
  if (typeof initThemeToggle === 'function') initThemeToggle();

  /* ── 3. Active sidebar link ───────────────────────────── */
  const currentPath = window.location.pathname;

  // Sub-pages that don't have a direct sidebar link — map to their parent section
  const sidebarAliases = {
    '/reviewee/diagnostic-result': '/reviewee/diagnostic',
  };
  const canonicalPath = sidebarAliases[currentPath] || currentPath;

  document.querySelectorAll('.sidebar-link').forEach(link => {
    if (link.getAttribute('href') === canonicalPath) {
      link.classList.add('active');
    }
  });

  /* ── 4. Page title in navbar ──────────────────────────── */
  // Override for pages whose nav title differs from their sidebar label
  const navTitleOverrides = {
    '/reviewee/diagnostic-result': 'Diagnostic Results',
  };

  const activeLink = document.querySelector('.sidebar-link.active');
  const pageTitleEl = document.getElementById('nav-page-title');
  if (pageTitleEl) {
    if (navTitleOverrides[currentPath]) {
      pageTitleEl.textContent = navTitleOverrides[currentPath];
    } else if (activeLink) {
      const label = activeLink.querySelector('.sidebar-label');
      if (label) pageTitleEl.textContent = label.textContent.trim();
    }
  }

  /* ── 5. Sidebar collapse / expand ────────────────────── */
  const sidebar = document.getElementById('app-sidebar');
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  const shell = document.querySelector('.app-shell');

  const COLLAPSED_KEY = 'hauers_sidebar_collapsed';
  const isCollapsed = () => localStorage.getItem(COLLAPSED_KEY) === '1';

  function applyCollapsedState(animate) {
    if (!sidebar || !shell) return;
    if (animate) {
      sidebar.classList.add('animating');
      setTimeout(() => sidebar.classList.remove('animating'), 300);
    }
    const collapsed = isCollapsed();
    sidebar.classList.toggle('collapsed', collapsed);
    shell.classList.toggle('sidebar-collapsed', collapsed);
    // body class drives hamburger ✕ animation (navbar is fixed, outside .app-shell)
    document.body.classList.toggle('sidebar-collapsed', collapsed);
    // Flip the collapse handle chevron to point right when collapsed
    const handle = document.getElementById('sidebar-collapse-handle');
    if (handle) {
      handle.querySelector('polyline').setAttribute('points', collapsed ? '9 18 15 12 9 6' : '15 18 9 12 15 6');
    }
  }

  // Restore persisted state immediately (no transition flash)
  applyCollapsedState(false);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      localStorage.setItem(COLLAPSED_KEY, isCollapsed() ? '0' : '1');
      applyCollapsedState(true);
    });
  }

  // Sidebar collapse handle (the arrow button on the right border)
  const collapseHandle = document.getElementById('sidebar-collapse-handle');
  if (collapseHandle) {
    collapseHandle.addEventListener('click', () => {
      localStorage.setItem(COLLAPSED_KEY, isCollapsed() ? '0' : '1');
      applyCollapsedState(true);
    });
  }

  // Mobile: close sidebar when clicking a link
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 768) {
        localStorage.setItem(COLLAPSED_KEY, '1');
        applyCollapsedState(true);
      }
    });
  });

  /* overlay click to close on mobile */
  const overlay = document.getElementById('sidebar-overlay');
  if (overlay) {
    overlay.addEventListener('click', () => {
      localStorage.setItem(COLLAPSED_KEY, '1');
      applyCollapsedState(true);
    });
  }

  /* ── 6. Populate navbar user info (runs on every page) ── */
  try {
    const ur = await fetch('/reviewee/api/user');
    if (ur.ok) {
      const u = await ur.json();
      const avatarEl    = document.getElementById('nav-avatar');
      const userNameEl  = document.getElementById('nav-user-name');
      const userEmailEl = document.getElementById('nav-user-email');
      if (avatarEl)    avatarEl.textContent    = u.firstName[0].toUpperCase();
      if (userNameEl)  userNameEl.textContent  = `${u.firstName} ${u.lastName}`;
      if (userEmailEl) userEmailEl.textContent = u.email;
    }
  } catch (_) {}

  /* Nav-user click → navigate to learner profile (profile page handles its own modal) */
  const navUserEl = document.getElementById('nav-user');
  if (navUserEl && currentPath !== '/reviewee/learner-profile') {
    navUserEl.addEventListener('click', () => {
      window.location.href = '/reviewee/learner-profile';
    });
  }

  /* ── 7. Fetch dashboard mock data and populate ─────────── */
  const isDashboard = currentPath === '/reviewee/dashboard';
  if (!isDashboard) return;

  let data;
  try {
    const r = await fetch('/reviewee/api/dashboard');
    if (!r.ok) return;
    data = await r.json();
  } catch (_) { return; }

  // User greeting
  const greetingEl = document.getElementById('dash-greeting');
  if (greetingEl && data.user) {
    const hour = new Date().getHours();
    const tod = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    greetingEl.textContent = `Good ${tod}, ${data.user.firstName} 👋`;
  }

  // Exam level badge
  const badgeEl = document.getElementById('dash-level-badge');
  if (badgeEl && data.user) badgeEl.textContent = data.user.examLevel;

  // Weeks + exact days remaining
  const examDate = new Date('2026-04-27');
  const weeksEl = document.getElementById('weeks-remaining');
  if (weeksEl) {
    const weeks = Math.max(0, Math.round((examDate - new Date()) / (1000 * 60 * 60 * 24 * 7)));
    weeksEl.textContent = weeks;
  }
  const examDaysEl = document.getElementById('exam-days');
  if (examDaysEl) {
    const days = Math.max(0, Math.ceil((examDate - new Date()) / (1000 * 60 * 60 * 24)));
    examDaysEl.textContent = days;
  }
  const examLevelEl = document.getElementById('exam-level-label');
  if (examLevelEl && data.user) examLevelEl.textContent = data.user.examLevel;

  // Readiness score ring
  const ringPct  = document.querySelector('.ring-prog[data-pct]');
  const ringNum  = document.getElementById('ring-pct-val');
  const ringNote = document.getElementById('ring-note');
  if (data.readinessScore != null) {
    const pct  = data.readinessScore;
    const r    = 54;
    const circ = 2 * Math.PI * r;
    if (ringPct) {
      ringPct.setAttribute('data-pct', pct);
      ringPct.style.strokeDasharray  = circ;
      ringPct.style.strokeDashoffset = circ;
      setTimeout(() => {
        ringPct.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)';
        ringPct.style.strokeDashoffset = circ * (1 - pct / 100);
      }, 200);
    }
    if (ringNum) ringNum.textContent = pct;
  }

  // Streak number
  const streakEl = document.getElementById('study-streak');
  if (streakEl && data.streak != null) streakEl.textContent = data.streak;

  // Streak week dots (Mon–Sun, last `streak` days marked active)
  const streakContainer = document.getElementById('streak-week');
  if (streakContainer && data.streak != null) {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const todayIdx = (new Date().getDay() + 6) % 7; // 0=Mon … 6=Sun
    streakContainer.innerHTML = '';
    for (let i = 0; i < 7; i++) {
      const daysFromToday = todayIdx - i;
      const isActive = daysFromToday >= 0 && daysFromToday < data.streak;
      const isToday  = i === todayIdx;
      streakContainer.innerHTML +=
        `<div class="streak-day">` +
        `<div class="streak-dot${isActive ? ' active' : ''}${isToday ? ' today' : ''}"></div>` +
        `<span class="streak-day-label">${dayNames[i]}</span>` +
        `</div>`;
    }
  }

  // Task counts + progress bar
  const doneEl    = document.getElementById('tasks-done');
  const pendingEl = document.getElementById('tasks-pending');
  if (doneEl    && data.completedTasks != null) doneEl.textContent    = data.completedTasks;
  if (pendingEl && data.pendingTasks   != null) pendingEl.textContent = data.pendingTasks;
  if (data.completedTasks != null && data.pendingTasks != null) {
    const total = data.completedTasks + data.pendingTasks;
    const pct   = total > 0 ? Math.round((data.completedTasks / total) * 100) : 0;
    const taskFillEl = document.getElementById('task-progress-fill');
    if (taskFillEl) setTimeout(() => { taskFillEl.style.width = pct + '%'; }, 200);
  }

  // Competency Radar chart
  if (data.diagnostic && data.diagnostic.domainScores) {
    const canvasEl = document.getElementById('competencyRadar');
    if (canvasEl && typeof Chart !== 'undefined') {
      const labels = data.diagnostic.domainScores.map(d => d.domain);
      const scores = data.diagnostic.domainScores.map(d => d.score);

      const isDark     = document.documentElement.getAttribute('data-theme') === 'dark';
      const gridLine   = isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.07)';
      const labelColor = isDark ? '#A1A1AA' : '#4b5563';
      const tickColor  = isDark ? '#555'    : '#aaa';
      const tooltipBg  = isDark ? 'rgba(14,14,14,0.97)' : 'rgba(255,255,255,0.97)';
      const tooltipTxt = isDark ? '#ffffff' : '#111827';
      const tooltipSub = isDark ? '#A1A1AA' : '#4b5563';
      const tooltipBdr = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
      const ptBorder   = isDark ? '#0A0A0A' : '#ffffff';

      new Chart(canvasEl, {
        type: 'radar',
        data: {
          labels,
          datasets: [
            {
              label: 'Your Score',
              data: scores,
              backgroundColor: 'rgba(255,153,51,0.13)',
              borderColor: '#FF9933',
              borderWidth: 2.5,
              pointBackgroundColor: '#FF9933',
              pointBorderColor: ptBorder,
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7.5,
              pointHoverBackgroundColor: '#FF9933',
              fill: true,
            },
            {
              label: 'Passing Target',
              data: labels.map(() => 80),
              backgroundColor: 'rgba(255,51,102,0.04)',
              borderColor: 'rgba(255,51,102,0.5)',
              borderWidth: 1.5,
              borderDash: [6, 4],
              pointRadius: 0,
              pointHoverRadius: 0,
              fill: true,
            },
          ],
        },
        options: {
          animation: { duration: 1200, easing: 'easeInOutQuart' },
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            r: {
              min: 0,
              max: 100,
              ticks: {
                stepSize: 20,
                color: tickColor,
                backdropColor: 'transparent',
                font: { size: 9, family: 'inherit' },
              },
              grid:       { color: gridLine, circular: false },
              angleLines: { color: gridLine },
              pointLabels: {
                color: labelColor,
                font: { size: 11, weight: '500', family: 'inherit' },
                padding: 10,
              },
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: tooltipBg,
              titleColor:      tooltipTxt,
              bodyColor:       tooltipSub,
              borderColor:     tooltipBdr,
              borderWidth: 1,
              padding: 10,
              cornerRadius: 8,
              callbacks: {
                label: (ctx) => `  ${ctx.dataset.label}: ${ctx.raw}%`,
              },
            },
          },
        },
      });

      // Domain score chips below chart
      const chipsEl = document.getElementById('radar-score-chips');
      if (chipsEl) {
        chipsEl.innerHTML = data.diagnostic.domainScores.map(({ domain, score }) => {
          const cls = score >= 75 ? 'chip--good' : score >= 60 ? 'chip--mid' : 'chip--low';
          return `<span class="radar-chip ${cls}"><strong>${score}%</strong>&nbsp;${domain}</span>`;
        }).join('');
      }
    }
  }

  // Weak domains
  const weakContainer = document.getElementById('weak-tags-container');
  if (weakContainer && data.weakDomains) {
    weakContainer.innerHTML = data.weakDomains
      .map(d => `<span class="weak-tag">${d}</span>`)
      .join('');
  }

  // Recommended focus
  const focusEl = document.getElementById('recommended-focus');
  if (focusEl && data.recommendedFocus) focusEl.textContent = data.recommendedFocus;

  // Diagnostic score + gap-to-passing bar
  if (data.diagnostic && data.diagnostic.latestScore != null) {
    const score  = data.diagnostic.latestScore;
    const diagEl = document.getElementById('diag-score');
    if (diagEl) diagEl.textContent = score;
    const gapFill = document.getElementById('score-gap-fill');
    if (gapFill) setTimeout(() => { gapFill.style.width = score + '%'; }, 350);
    const gapBadge = document.getElementById('score-gap-badge');
    if (gapBadge) {
      const gap = 80 - score;
      if (gap > 0) {
        gapBadge.textContent = gap + ' pts to passing';
      } else {
        gapBadge.textContent = 'Passing score achieved! 🎉';
        gapBadge.style.background   = 'rgba(74,222,128,0.1)';
        gapBadge.style.color        = '#4ade80';
        gapBadge.style.borderColor  = 'rgba(74,222,128,0.3)';
      }
    }
  }


});
