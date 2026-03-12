// Fetch and inject partials
document.addEventListener('DOMContentLoaded', async () => {
  const headerPlaceholder = document.getElementById('header-placeholder');
  const footerPlaceholder = document.getElementById('footer-placeholder');

  try {
    if (headerPlaceholder) {
      const resp = await fetch('/partials/header.html');
      if (resp.ok) {
        headerPlaceholder.innerHTML = await resp.text();
        // initialize theme toggle after header is loaded
        if (typeof initThemeToggle === 'function') {
          initThemeToggle();
        }
        // Scroll elevation effect
        const headerOuter = headerPlaceholder.querySelector('.header-outer');
        if (headerOuter) {
          const onScroll = () => headerOuter.classList.toggle('scrolled', window.scrollY > 40);
          window.addEventListener('scroll', onScroll, { passive: true });
          onScroll();
        }
      }
    }

    if (footerPlaceholder) {
      const resp = await fetch('/partials/footer.html');
      if (resp.ok) {
        footerPlaceholder.innerHTML = await resp.text();
        // Footer cursor glow — mirrors glass card spotlight effect
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
