(function initNavbar() {
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobile-nav");
  const submenuToggles = mobileNav ? mobileNav.querySelectorAll('.submenu-toggle') : [];
  const isLocalStaticHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  // If navbar isn't injected yet, retry shortly
  if (!hamburger || !mobileNav) {
    setTimeout(initNavbar, 30);
    return;
  }

  function closeSubmenus() {
    mobileNav.querySelectorAll('.has-submenu.open').forEach((item) => {
      item.classList.remove('open');
      const toggle = item.querySelector('.submenu-toggle');
      const submenu = item.querySelector('.submenu');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
      if (submenu) submenu.setAttribute('aria-hidden', 'true');
    });
  }

  function closeMenu() {
    mobileNav.classList.remove('active');
    mobileNav.setAttribute('aria-hidden', 'true');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    closeSubmenus();
  }

  function toLocalHtmlPath(pathname) {
    if (pathname === '/') return '/index.html';
    if (/\.[^/]+$/.test(pathname) || pathname.endsWith('/')) return pathname;
    return `${pathname}.html`;
  }

  function localizeUrlForStaticServer(urlString) {
    const url = new URL(urlString, window.location.origin);
    if (!isLocalStaticHost || url.origin !== window.location.origin) return url.toString();
    url.pathname = toLocalHtmlPath(url.pathname);
    return url.toString();
  }

  submenuToggles.forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
      const arrowClicked = e.target.closest('.submenu-arrow');
      if (!arrowClicked) {
        if (toggle.dataset.href) {
          window.location.href = localizeUrlForStaticServer(toggle.dataset.href);
        }
        return;
      }

      e.preventDefault();
      const parent = toggle.closest('.has-submenu');
      const submenu = parent ? parent.querySelector('.submenu') : null;
      const opening = parent ? !parent.classList.contains('open') : false;

      closeSubmenus();

      if (parent && submenu && opening) {
        parent.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
        submenu.setAttribute('aria-hidden', 'false');
      }
    });
  });

  hamburger.addEventListener("click", () => {
    const isActive = mobileNav.classList.toggle("active");
    hamburger.classList.toggle("active", isActive);
    hamburger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    mobileNav.setAttribute('aria-hidden', isActive ? 'false' : 'true');
    if (!isActive) closeSubmenus();
  });

  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 992) closeMenu();
    });
  });

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (!link) return;

    const rawHref = link.getAttribute('href');
    if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:') || rawHref.startsWith('javascript:')) {
      return;
    }

    const resolved = new URL(rawHref, window.location.origin);
    if (!isLocalStaticHost || resolved.origin !== window.location.origin) return;
    if (/\.[^/]+$/.test(resolved.pathname) || resolved.pathname.endsWith('/')) return;

    e.preventDefault();
    resolved.pathname = toLocalHtmlPath(resolved.pathname);
    window.location.href = resolved.toString();
  });

  document.addEventListener('click', (e) => {
    const withinNav = e.target.closest('.navbar');
    if (!withinNav && mobileNav.classList.contains('active')) {
      closeMenu();
    }
    if (!withinNav) {
      closeSubmenus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 992) {
      mobileNav.classList.remove('active');
      mobileNav.setAttribute('aria-hidden', 'false');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      closeSubmenus();
    } else {
      mobileNav.setAttribute('aria-hidden', mobileNav.classList.contains('active') ? 'false' : 'true');
    }
  });
})();
