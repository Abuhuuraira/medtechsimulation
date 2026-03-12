(function initNavbar() {
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobile-nav");
  const submenuToggles = mobileNav ? mobileNav.querySelectorAll('.submenu-toggle') : [];

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

  submenuToggles.forEach((toggle) => {
    toggle.addEventListener('click', (e) => {
      const arrowClicked = e.target.closest('.submenu-arrow');
      if (!arrowClicked) {
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
