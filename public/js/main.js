// Fetch and inject partials
document.addEventListener('DOMContentLoaded', async () => {
  const headerPlaceholder = document.getElementById('header-placeholder');
  const footerPlaceholder = document.getElementById('footer-placeholder');

  // Determine state
  const path = window.location.pathname;
  const isLegalPage = path.includes('/privacy') || path.includes('/terms');
  const isAppPage = path.includes('/reviewee/') || path.includes('/admin/');
  
  let isFromApp = false;

  try {
    if (isAppPage) {
      isFromApp = true;
      sessionStorage.setItem('fromApp', 'true');
    } else if (isLegalPage) {
      const ref = document.referrer || '';
      if (ref.includes('/reviewee/') || ref.includes('/admin/')) {
        isFromApp = true;
        sessionStorage.setItem('fromApp', 'true');
      } else if (ref.includes('/privacy') || ref.includes('/terms')) {
        isFromApp = sessionStorage.getItem('fromApp') === 'true';
      } else {
        isFromApp = false;
        sessionStorage.removeItem('fromApp');
      }
    } else {
      isFromApp = false;
      sessionStorage.removeItem('fromApp');
    }
  } catch (e) {
    console.error('Session storage error:', e);
  }

  try {
    if (headerPlaceholder) {
      const partialUrl = isFromApp ? '/partials/navbar.html' : '/partials/header.html';

      const resp = await fetch(partialUrl);
      if (resp.ok) {
        headerPlaceholder.innerHTML = await resp.text();

        if (typeof initThemeToggle === 'function') {
          initThemeToggle();
        }

        if (isFromApp) {
          let currentRole = document.body.dataset.role || sessionStorage.getItem('appRole');
          if (!currentRole && window.location.pathname.includes('/admin/')) currentRole = 'admin';
          else if (!currentRole) currentRole = 'reviewee';
          
          if (document.body.dataset.role) {
            sessionStorage.setItem('appRole', document.body.dataset.role);
          }
          
          if (currentRole === 'admin') {
            const logoLink = document.querySelector('.nav-logo-link');
            if (logoLink) logoLink.href = '/admin/dashboard';

            const nppRole = document.getElementById('npp-role');
            if (nppRole) nppRole.textContent = 'Admin';

            const editLink = document.getElementById('npp-edit-link');
            if (editLink) editLink.style.display = 'none';

            const settingsLink = document.getElementById('npp-settings-link');
            if (settingsLink) {
              settingsLink.href = '/admin/settings';
              settingsLink.innerHTML = '<span class="npp-icon material-symbols-outlined">settings</span> System Settings';
            }

            const userName = document.getElementById('nav-user-name');
            if (userName) userName.textContent = 'Admin Portal';
            
            const nppName = document.getElementById('npp-name');
            if (nppName) nppName.textContent = 'System Admin';

            const userEmail = document.getElementById('nav-user-email');
            if (userEmail) userEmail.textContent = 'admin@hauers.com';
            
            const nppEmail = document.getElementById('npp-email');
            if (nppEmail) nppEmail.textContent = 'admin@hauers.com';

            const navAvatar = document.getElementById('nav-avatar');
            if (navAvatar) navAvatar.textContent = 'A';
            const nppAvatar = document.getElementById('npp-avatar');
            if (nppAvatar) nppAvatar.textContent = 'A';
          }

          if (!document.querySelector('link[href="/css/dashboard.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '/css/dashboard.css';
            document.head.appendChild(link);
          }

          if (!document.getElementById('mat-symbols-css')) {
            const _msLink = document.createElement('link');
            _msLink.id = 'mat-symbols-css';
            _msLink.rel = 'stylesheet';
            _msLink.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block';
            document.head.appendChild(_msLink);
          }

          // Important: Pad out body so app-shell avoids fixed navbar
          document.body.style.paddingTop = '60px';

          if (isLegalPage) {
            const navTitle = document.querySelector('.nav-page-title');
            if (navTitle) {
              if (path.includes('/privacy')) navTitle.textContent = 'Privacy Policy';
              else if (path.includes('/terms')) navTitle.textContent = 'Terms of Service';
            }

            const mainContent = document.querySelector('main.legal-page');
            if (mainContent) {
              // Wrap main in .app-shell
              const appShell = document.createElement('div');
              appShell.className = 'app-shell sidebar-collapsed';

              const overlay = document.createElement('div');
              overlay.className = 'sidebar-overlay';
              overlay.id = 'sidebar-overlay';

              const sidebarPlaceholder = document.createElement('div');
              sidebarPlaceholder.id = 'sidebar-placeholder';

              mainContent.parentNode.insertBefore(appShell, mainContent);
              appShell.appendChild(overlay);
              appShell.appendChild(sidebarPlaceholder);

              mainContent.classList.add('page-content');
              appShell.appendChild(mainContent);

              let role = sessionStorage.getItem('appRole');
              if (!role && document.referrer) {
                role = document.referrer.includes('/admin/') ? 'admin' : 'reviewee';
                sessionStorage.setItem('appRole', role);
              }
              const sidebarUrl = role === 'admin' ? '/partials/admin-sidebar.html' : '/partials/sidebar.html';

              fetch(sidebarUrl).then(async (sideResp) => {
                if (sideResp.ok) sidebarPlaceholder.innerHTML = await sideResp.text();

                const sidebar = document.getElementById('app-sidebar');
                const collapseBtn = document.getElementById('sidebar-collapse-handle');
                if (collapseBtn && sidebar) {
                  collapseBtn.addEventListener('click', () => {
                    const isCollapsed = sidebar.classList.toggle('collapsed');
                    appShell.classList.toggle('sidebar-collapsed', isCollapsed);
                    document.body.classList.toggle('sidebar-collapsed', isCollapsed);
                  });
                }
              });

              overlay.addEventListener('click', () => {
                const sidebar = document.getElementById('app-sidebar');
                if (sidebar) sidebar.classList.add('collapsed');
                appShell.classList.add('sidebar-collapsed');
                document.body.classList.add('sidebar-collapsed');
              });
            }
          }

          // User Profile Dropdown logic
          const userBtn = document.getElementById('nav-user');
          const popup = document.getElementById('nav-profile-popup');
          if (userBtn && popup) {
            userBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              const expanded = userBtn.getAttribute('aria-expanded') === 'true';
              userBtn.setAttribute('aria-expanded', !expanded);
              popup.hidden = expanded;
            });
            document.addEventListener('click', (e) => {
              if (!userBtn.contains(e.target)) {
                userBtn.setAttribute('aria-expanded', 'false');
                popup.hidden = true;
              }
            });
          }

          // Notification Bell logic
          const notifBtn = document.getElementById('nav-notif-btn');
          const notifPanel = document.getElementById('nav-notif-panel');
          if (notifBtn && notifPanel) {
            notifBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              notifPanel.hidden = !notifPanel.hidden;
              if (popup) {
                popup.hidden = true;
                if(userBtn) userBtn.setAttribute('aria-expanded', 'false');
              }
            });
            document.addEventListener('click', (e) => {
              if (!notifBtn.contains(e.target) && !notifPanel.contains(e.target)) {
                notifPanel.hidden = true;
              }
            });
            const notifClear = document.getElementById('nav-notif-clear');
            if (notifClear) {
              notifClear.addEventListener('click', () => {
                 const list = document.getElementById('nav-notif-list');
                 if (list) list.innerHTML = '<div class="nav-notif-empty">No notifications</div>';
                 const badge = document.getElementById('nav-notif-badge');
                 if (badge) badge.hidden = true;
              });
            }
          }

        } else {
          // Scroll elevation effect for landing header
          const headerOuter = headerPlaceholder.querySelector('.header-outer');
          if (headerOuter) {
            const onScroll = () => headerOuter.classList.toggle('scrolled', window.scrollY > 40);
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
          }
        }
      }
    }

    if (footerPlaceholder) {
      if (isFromApp) {
        footerPlaceholder.style.display = 'none';
      } else {
        const resp = await fetch('/partials/footer.html');
        if (resp.ok) {
          footerPlaceholder.innerHTML = await resp.text();
          const siteFooter = footerPlaceholder.querySelector('.site-footer');
          if (siteFooter) {
            siteFooter.addEventListener('mousemove', e => {
              const rect = siteFooter.getBoundingClientRect();
              siteFooter.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
              siteFooter.style.setProperty('--mouse-y', (e.clientY - rect.top) + 'px');
            });
          }
        }
      }
    }
  } catch (err) {
    console.error('Failed to load partials', err);
  }

  //  Scroll reveal 
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

  //  Stat counter animation 
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1100;
    const start = performance.now();
    const tick = (now) => {
      const elapsed = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      el.textContent = Math.round(eased * target);
      if (elapsed < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.stat-count[data-count]').forEach(animateCounter);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statObserver.observe(heroStats);
  }

  //  Score ring animation 
  document.querySelectorAll('.ring-prog[data-pct]').forEach(ring => {
    const pct = parseInt(ring.dataset.pct, 10);
    const r = parseFloat(ring.getAttribute('r') || 54);
    const circ = 2 * Math.PI * r;
    ring.style.strokeDasharray = circ;
    ring.style.strokeDashoffset = circ;
    const ro = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setTimeout(() => {
            ring.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)';
            ring.style.strokeDashoffset = circ * (1 - pct / 100);
          }, 200);
          ro.unobserve(ring);
        }
      });
    }, { threshold: 0.5 });
    ro.observe(ring);
  });

  //  Score bar animation 
  document.querySelectorAll('.msc-bar-fill[data-bw]').forEach(bar => {
    const targetW = bar.dataset.bw + '%';
    bar.style.width = '0%';
    const bo = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setTimeout(() => { bar.style.width = targetW; }, 350);
          bo.unobserve(bar);
        }
      });
    }, { threshold: 0.5 });
    bo.observe(bar);
  });

  //  Exam Ticker Clone 
  const tickerTrack = document.querySelector('.ticker-track');
  if (tickerTrack) {
    const tickerSet = tickerTrack.querySelector('.ticker-set');
    if (tickerSet) {
      const clone = tickerSet.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      tickerTrack.appendChild(clone);
    }
  }

  //  Interactive Glass Card Glow 
  const cards = document.querySelectorAll('.glass-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', x + 'px');
      card.style.setProperty('--mouse-y', y + 'px');
    });
  });

  //  Domain Filter Tabs
  document.querySelectorAll('.dft-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.dft-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.domain-tag').forEach(tag => {
        const level = tag.dataset.level;
        const show = filter === 'all' || level === 'both' || level === filter;
        tag.style.display = show ? '' : 'none';
      });
    });
  });
});
