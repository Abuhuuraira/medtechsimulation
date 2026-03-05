
  //first table
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("autoScrollTable");
  const table = container.querySelector("table");
  const dotsContainer = document.getElementById("scrollDots");
  const mobileQuery = window.matchMedia("(max-width: 768px)");

  let steps = [];
  let currentStep = 0;
  let interval = null;
  let isPaused = false;

  function setupSteps() {
    steps = [];
    let offset = 0;

    const headers = table.querySelectorAll("th");
    for (let i = 1; i < headers.length; i++) {
      offset += headers[i].offsetWidth;
      steps.push(offset);
    }

    createDots();
  }

  function createDots() {
    dotsContainer.innerHTML = "";
    steps.forEach((_, i) => {
      const dot = document.createElement("span");
      if (i === 0) dot.classList.add("active");
      dotsContainer.appendChild(dot);
    });
  }

  function updateDots() {
    [...dotsContainer.children].forEach((dot, i) => {
      dot.classList.toggle("active", i === currentStep % steps.length);
    });
  }

  function startAutoScroll() {
    clearInterval(interval);

    interval = setInterval(() => {
      if (isPaused) return;

      container.scrollTo({
        left: steps[currentStep] || 0,
        behavior: "smooth"
      });

      currentStep++;
      if (currentStep >= steps.length) currentStep = 0;

      updateDots();
    }, 1200); // ⚡ FAST SPEED
  }

  function pauseScroll() {
    isPaused = true;
  }

  function resumeScroll() {
    if (!interval) startAutoScroll();
    isPaused = false;
  }

  // Pause on interaction
  ["touchstart", "mousedown", "wheel"].forEach(evt =>
    container.addEventListener(evt, pauseScroll, { passive: true })
  );

  // Resume when user releases / leaves
  ["touchend", "mouseup", "mouseleave"].forEach(evt =>
    container.addEventListener(evt, resumeScroll)
  );

  function handleScreen(e) {
    if (e.matches) {
      setTimeout(() => {
        setupSteps();
        startAutoScroll();
      }, 400);
    } else {
      clearInterval(interval);
      interval = null;
      container.scrollLeft = 0;
      dotsContainer.innerHTML = "";
    }
  }

  handleScreen(mobileQuery);
  mobileQuery.addEventListener("change", handleScreen);
});

//2nd table

let autoInterval = null;
let currentStep = 0;
let isPaused = false;

function showTab(index) {
  // Switch active tab
  document.querySelectorAll(".tab").forEach((tab, i) => {
    tab.classList.toggle("active", i === index);
  });

  // Switch active menu item
  document.querySelectorAll(".menu-item").forEach((menu, i) => {
    menu.classList.toggle("active", i === index);
  });

  // Reset scroll position to first column (PRO)
  const container = document.querySelector(".compare-table");
  container.scrollLeft = 0;

  // Reset auto-scroll for mobile
  if (window.innerWidth <= 600) setupAutoScroll();
}

function setupAutoScroll() {
  stopAutoScroll();
  isPaused = false;

  const dotsContainer = document.getElementById("scrollDots");
  dotsContainer.innerHTML = "";

  const activeTab = document.querySelector(".tab.active table");
  const container = document.querySelector(".compare-table");
  if (!activeTab) return;

  const headers = activeTab.querySelectorAll("th");
  let steps = [];
  let offset = 0;

  // Start from 1 to skip first sticky column (feature column)
  for (let i = 1; i < headers.length; i++) {
    offset += headers[i].offsetWidth;
    steps.push(offset);

    const dot = document.createElement("span");
    if (i === 1) dot.classList.add("active"); // first scroll dot active
    dotsContainer.appendChild(dot);
  }

  currentStep = 0; // Always start from PRO column

  function updateDots() {
    [...dotsContainer.children].forEach((dot, i) => {
      dot.classList.toggle("active", i === currentStep);
    });
  }

  function startScroll() {
    if (autoInterval) return;

    autoInterval = setInterval(() => {
      if (isPaused) return;

      // Scroll to current column
      container.scrollTo({
        left: steps[currentStep] || 0,
        behavior: "smooth"
      });

      updateDots();

      // Move to next column
      currentStep++;
      if (currentStep >= steps.length) {
        currentStep = 0;       // Reset to PRO column
        container.scrollTo({ left: 0, behavior: "smooth" }); // Jump to PRO
      }
    }, 1700);
  }

  function stopScroll() {
    clearInterval(autoInterval);
    autoInterval = null;
  }

  // Pause auto-scroll on user interaction
  ["touchstart", "mousedown", "wheel"].forEach(evt => {
    container.addEventListener(evt, () => isPaused = true, { passive: true });
  });
  ["touchend", "mouseup", "mouseleave"].forEach(evt => {
    container.addEventListener(evt, () => isPaused = false);
  });

  // Start/stop auto-scroll based on visibility
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && window.innerWidth <= 600) {
        startScroll();
      } else {
        stopScroll();
      }
    });
  }, { threshold: 0.5 });

  observer.observe(container);
}

function stopAutoScroll() {
  clearInterval(autoInterval);
  autoInterval = null;
}

// Init on load (mobile only)
window.addEventListener("load", () => {
  if (window.innerWidth <= 600) setupAutoScroll();
});

// Re-init on resize
window.addEventListener("resize", () => {
  if (window.innerWidth <= 600) setupAutoScroll();
  else {
    stopAutoScroll();
    document.getElementById("scrollDots").innerHTML = "";
  }
});

//3rd one

document.addEventListener("DOMContentLoaded", () => {
  if (window.innerWidth > 768) return;

  const wrapper = document.querySelector(".manikin-table-wrapper");
  const table = wrapper.querySelector(".manikin-table");
  const dotsContainer = document.getElementById("scrollDots");

  let steps = [];
  let currentStep = 0;
  let interval = null;
  let paused = false;

  function calculateSteps() {
    steps = [];
    let offset = 0;

    const headers = table.querySelectorAll("th");
    for (let i = 1; i < headers.length; i++) {
      offset += headers[i].offsetWidth;
      steps.push(offset);
    }

    dotsContainer.innerHTML = "";
    steps.forEach((_, i) => {
      const dot = document.createElement("span");
      if (i === 0) dot.classList.add("active");
      dotsContainer.appendChild(dot);
    });
  }

  function updateDots() {
    [...dotsContainer.children].forEach((dot, i) => {
      dot.classList.toggle("active", i === currentStep);
    });
  }

  function startAutoScroll() {
    clearInterval(interval);

    interval = setInterval(() => {
      if (paused) return;

      table.scrollTo({
        left: steps[currentStep] || 0,
        behavior: "smooth"
      });

      updateDots();
      currentStep++;

      if (currentStep >= steps.length) currentStep = 0;
    }, 1200); // ⚡ FAST
  }

  // Pause on interaction
  ["touchstart", "mousedown", "wheel"].forEach(evt => {
    table.addEventListener(evt, () => paused = true, { passive: true });
  });

  // Resume on release
  ["touchend", "mouseup", "mouseleave"].forEach(evt => {
    table.addEventListener(evt, () => paused = false);
  });

  calculateSteps();
  startAutoScroll();
});