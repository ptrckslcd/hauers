/**
 * admin-shell.js
 * Handles: navbar/sidebar injection, Material Symbols font, theme toggle,
 *          active link, page title, sidebar collapse, and dashboard data population.
 */
document.addEventListener('DOMContentLoaded', async () => {

  /* ── 1. Inject partials ─────────────────────────────────── */
  async function loadPartial(placeholderId, url) {
    const el = document.getElementById(placeholderId);
    if (!el) return;
    try {
      const r = await fetch(url);
      if (r.ok) el.innerHTML = await r.text();
    } catch (_) {}
  }

  await Promise.all([
    loadPartial('navbar-placeholder',  '/partials/navbar.html'),
    loadPartial('sidebar-placeholder', '/partials/admin-sidebar.html'),
  ]);

  /* ── Inject Material Symbols Outlined font ─────────────── */
  if (!document.getElementById('mat-symbols-css')) {
    const link = document.createElement('link');
    link.id   = 'mat-symbols-css';
    link.rel  = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap';
    document.head.appendChild(link);
  }

  /* ── 2. Theme toggle ────────────────────────────────────── */
  if (typeof initThemeToggle === 'function') initThemeToggle();

  /* ── 3. Active sidebar link ─────────────────────────────── */
  const currentPath = window.location.pathname;
  document.querySelectorAll('.sidebar-link').forEach(link => {
    if (link.getAttribute('href') === currentPath) link.classList.add('active');
  });

  /* ── 4. Page title in navbar ────────────────────────────── */
  const activeLink  = document.querySelector('.sidebar-link.active');
  const pageTitleEl = document.getElementById('nav-page-title');
  if (pageTitleEl && activeLink) {
    const label = activeLink.querySelector('.sidebar-label');
    if (label) pageTitleEl.textContent = label.textContent.trim();
  }

  /* ── 5. Sidebar collapse / expand ──────────────────────── */
  const sidebar    = document.getElementById('app-sidebar');
  const toggleBtn  = document.getElementById('sidebar-toggle-btn');
  const shell      = document.querySelector('.app-shell');

  const COLLAPSED_KEY = 'hauers_admin_sidebar_collapsed';
  const isCollapsed   = () => localStorage.getItem(COLLAPSED_KEY) === '1';

  function applyCollapsedState(animate) {
    if (!sidebar || !shell) return;
    if (animate) {
      sidebar.classList.add('animating');
      setTimeout(() => sidebar.classList.remove('animating'), 300);
    }
    const collapsed = isCollapsed();
    sidebar.classList.toggle('collapsed', collapsed);
    shell.classList.toggle('sidebar-collapsed', collapsed);
    document.body.classList.toggle('sidebar-collapsed', collapsed);
    const handle = document.getElementById('sidebar-collapse-handle');
    if (handle) {
      const poly = handle.querySelector('polyline');
      if (poly) poly.setAttribute('points', collapsed ? '9 18 15 12 9 6' : '15 18 9 12 15 6');
    }
  }

  applyCollapsedState(false);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      localStorage.setItem(COLLAPSED_KEY, isCollapsed() ? '0' : '1');
      applyCollapsedState(true);
    });
  }

  const collapseHandle = document.getElementById('sidebar-collapse-handle');
  if (collapseHandle) {
    collapseHandle.addEventListener('click', () => {
      localStorage.setItem(COLLAPSED_KEY, isCollapsed() ? '0' : '1');
      applyCollapsedState(true);
    });
  }

  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 768) {
        localStorage.setItem(COLLAPSED_KEY, '1');
        applyCollapsedState(true);
      }
    });
  });

  const overlay = document.getElementById('sidebar-overlay');
  if (overlay) {
    overlay.addEventListener('click', () => {
      localStorage.setItem(COLLAPSED_KEY, '1');
      applyCollapsedState(true);
    });
  }

  /* ── 6. Navbar user info ────────────────────────────────── */
  try {
    const r = await fetch('/admin/api/user');
    if (r.ok) {
      const u = await r.json();
      const avatarEl    = document.getElementById('nav-avatar');
      const userNameEl  = document.getElementById('nav-user-name');
      const userEmailEl = document.getElementById('nav-user-email');
      if (avatarEl)    avatarEl.textContent    = u.firstName[0].toUpperCase();
      if (userNameEl)  userNameEl.textContent  = `${u.firstName} ${u.lastName}`;
      if (userEmailEl) userEmailEl.textContent = u.email;
    }
  } catch (_) {}

  /* ── 7. Dashboard data population ─────────────────────── */
  if (currentPath !== '/admin/dashboard') return;

  let data;
  try {
    const r = await fetch('/admin/api/dashboard');
    if (!r.ok) return;
    data = await r.json();
  } catch (_) { return; }

  const setVal = (id, v) => {
    const el = document.getElementById(id);
    if (el) el.textContent = v;
  };

  /* KPI tiles */
  setVal('stat-total-users',      data.totalUsers);
  setVal('stat-active-reviewees', data.activeReviewees);
  setVal('stat-avg-readiness',    data.avgReadiness + '%');
  setVal('stat-new-signups',      '+' + data.recentSignups);

  /* Domain performance bars */
  const domainsContainer = document.getElementById('domain-bars');
  if (domainsContainer && data.domainAverages) {
    domainsContainer.innerHTML = data.domainAverages.map(({ domain, avg }) => {
      const valCls  = avg >= 70 ? ' good' : avg < 60 ? ' warn' : '';
      const fillCls = avg < 60  ? ' warn' : '';
      return `
        <div class="msc-bar-item">
          <div class="msc-bar-label">
            <span>${domain}</span>
            <span class="mbar-val${valCls}">${avg}%</span>
          </div>
          <div class="msc-bar-track">
            <div class="msc-bar-fill${fillCls}" data-bw="${avg}" style="width:0%;transition:width 1.1s cubic-bezier(0.4,0,0.2,1)"></div>
          </div>
        </div>`;
    }).join('');
    setTimeout(() => {
      domainsContainer.querySelectorAll('.msc-bar-fill[data-bw]').forEach(bar => {
        bar.style.width = bar.dataset.bw + '%';
      });
    }, 300);
  }

  /* Users by exam level */
  const splitContainer = document.getElementById('level-split');
  if (splitContainer && data.usersByLevel) {
    splitContainer.innerHTML = data.usersByLevel.map(({ level, count }) => {
      const pct = Math.round((count / data.totalUsers) * 100);
      return `
        <div class="msc-bar-item">
          <div class="msc-bar-label">
            <span>${level}</span>
            <span class="mbar-val">${count} <span style="font-weight:400;opacity:0.55">(${pct}%)</span></span>
          </div>
          <div class="msc-bar-track">
            <div class="msc-bar-fill" data-bw="${pct}" style="width:0%;transition:width 1.1s cubic-bezier(0.4,0,0.2,1)"></div>
          </div>
        </div>`;
    }).join('');
    setTimeout(() => {
      splitContainer.querySelectorAll('.msc-bar-fill[data-bw]').forEach(bar => {
        bar.style.width = bar.dataset.bw + '%';
      });
    }, 400);
  }

  /* Pass rate */
  if (data.passRate != null) {
    setVal('pass-rate-val', data.passRate + '%');
    const fill = document.getElementById('pass-rate-fill');
    if (fill) setTimeout(() => { fill.style.width = data.passRate + '%'; }, 350);
  }

  /* Weak domains */
  const weakContainer = document.getElementById('admin-weak-domains');
  if (weakContainer && data.weakestCommonDomains) {
    weakContainer.innerHTML = data.weakestCommonDomains
      .map(d => `<span class="weak-tag">${d}</span>`)
      .join('');
  }

  /* Recent activity feed */
  const activityContainer = document.getElementById('activity-feed');
  if (activityContainer && data.recentActivity) {
    const icons = {
      signup:     'person_add',
      diagnostic: 'monitor_heart',
      quiz:       'quiz',
    };
    activityContainer.innerHTML = data.recentActivity.map(item => `
      <div class="activity-item">
        <span class="activity-icon activity-icon--${item.type}">
          <span class="material-symbols-outlined" style="font-size:15px;line-height:1;font-variation-settings:'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 20">${icons[item.type] || 'info'}</span>
        </span>
        <div class="activity-body">
          <p class="activity-text">${item.text}</p>
          <span class="activity-time">${item.time}</span>
        </div>
      </div>`).join('');
  }

});
