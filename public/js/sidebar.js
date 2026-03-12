document.addEventListener('DOMContentLoaded', () => {
  const sidebarMenu = document.getElementById('sidebar-menu');
  if (!sidebarMenu) return;

  const role = document.body.dataset.role;
  const currentPath = window.location.pathname;

  const revieweeLinks = [
    { label: 'Dashboard', href: '/reviewee/dashboard' },
    { label: 'Onboarding', href: '/reviewee/onboarding' },
    { label: 'Learner Profile', href: '/reviewee/learner-profile' },
    { label: 'Diagnostic', href: '/reviewee/diagnostic' },
    { label: 'Diagnostic Result', href: '/reviewee/diagnostic-result' },
    { label: 'Quiz', href: '/reviewee/quiz' },
    { label: 'Study Plan', href: '/reviewee/study-plan' },
    { label: 'Progress', href: '/reviewee/progress' },
    { label: 'Materials', href: '/reviewee/materials' },
    { label: 'Settings', href: '/reviewee/settings' }
  ];

  const adminLinks = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Users', href: '/admin/users' },
    { label: 'Question Bank', href: '/admin/question-bank' },
    { label: 'Analytics', href: '/admin/analytics' }
  ];

  const links = role === 'admin' ? adminLinks : revieweeLinks;

  sidebarMenu.innerHTML = links
    .map((link) => {
      const isActive = currentPath === link.href;
      return `
        <li class="sidebar-item">
          <a href="${link.href}" class="sidebar-link ${isActive ? 'active' : ''}">
            ${link.label}
          </a>
        </li>
      `;
    })
    .join('');
});