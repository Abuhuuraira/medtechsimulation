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

  function normalizePathname(pathname) {
    if (!pathname) return '/';

    let normalized = pathname;
    if (!normalized.startsWith('/')) normalized = `/${normalized}`;

    normalized = normalized.replace(/\/index(?:\.html)?$/i, '/');
    normalized = normalized.replace(/\.html$/i, '');

    if (normalized.length > 1) {
      normalized = normalized.replace(/\/+$/, '');
    }

    return normalized || '/';
  }

  function markActiveNavItem() {
    const currentPath = normalizePathname(window.location.pathname);

    mobileNav.querySelectorAll('a.active-link').forEach((link) => {
      link.classList.remove('active-link');
      link.removeAttribute('aria-current');
    });

    mobileNav.querySelectorAll('.submenu-toggle.active-parent').forEach((toggle) => {
      toggle.classList.remove('active-parent');
      toggle.removeAttribute('aria-current');
    });

    mobileNav.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;

      const resolved = new URL(href, window.location.origin);
      if (resolved.origin !== window.location.origin) return;

      const targetPath = normalizePathname(resolved.pathname);
      if (targetPath === currentPath) {
        link.classList.add('active-link');
        link.setAttribute('aria-current', 'page');
      }
    });

    mobileNav.querySelectorAll('.submenu-toggle[data-href]').forEach((toggle) => {
      const parentPath = normalizePathname(toggle.dataset.href || '');
      if (!parentPath) return;

      const hasExactMatch = parentPath === currentPath;
      const hasPathMatch = parentPath !== '/' && currentPath.startsWith(`${parentPath}/`);
      const submenu = toggle.closest('.has-submenu')?.querySelector('.submenu');
      const hasActiveChild = submenu ? Boolean(submenu.querySelector('a.active-link')) : false;

      if (hasExactMatch || hasPathMatch || hasActiveChild) {
        toggle.classList.add('active-parent');
        if (hasExactMatch) {
          toggle.setAttribute('aria-current', 'page');
        }
      }
    });
  }

  function markActiveFooterLinks(retriesLeft = 10) {
    const footer = document.querySelector('.site-footer');
    if (!footer) {
      if (retriesLeft > 0) {
        setTimeout(() => markActiveFooterLinks(retriesLeft - 1), 120);
      }
      return;
    }

    const currentPath = normalizePathname(window.location.pathname);

    footer.querySelectorAll('a.active-link').forEach((link) => {
      link.classList.remove('active-link');
      link.removeAttribute('aria-current');
    });

    footer.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;

      const resolved = new URL(href, window.location.origin);
      if (resolved.origin !== window.location.origin) return;

      const targetPath = normalizePathname(resolved.pathname);
      if (targetPath === currentPath) {
        link.classList.add('active-link');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  markActiveNavItem();
  markActiveFooterLinks();

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
