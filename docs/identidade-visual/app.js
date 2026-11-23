(function () {
  var root = document.documentElement;
  var themeBtn = document.getElementById("theme-toggle-btn");
  var themeLabel = document.getElementById("theme-toggle-label");
  var pdfBtn = document.getElementById("pdf-export-btn");
  var toast = document.getElementById("copy-toast");
  var copyables = document.querySelectorAll("[data-hex]");
  var pulseBtn = document.getElementById("btn-pulse-led");
  var blinkBtn = document.getElementById("btn-blink-eyes");
  var interactiveAntennas = document.querySelectorAll(".interactive-antenna");
  var interactiveEyes = document.querySelectorAll(".interactive-eye");
  var toastTimer = null;

  function applyTheme(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      if (themeLabel) {
        themeLabel.textContent = "Light Mode";
      }
    } else {
      root.removeAttribute("data-theme");
      if (themeLabel) {
        themeLabel.textContent = "Dark Mode";
      }
    }
    try {
      localStorage.setItem("labapp-theme", theme);
    } catch (e) {}
  }

  var savedTheme = null;
  try {
    savedTheme = localStorage.getItem("labapp-theme");
  } catch (e) {}
  applyTheme(savedTheme === "dark" ? "dark" : "light");

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  if (pdfBtn) {
    pdfBtn.addEventListener("click", function () {
      window.print();
    });
  }

  function showToast(message) {
    if (!toast) {
      return;
    }
    toast.textContent = message;
    toast.classList.add("is-visible");
    if (toastTimer) {
      clearTimeout(toastTimer);
    }
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 1800);
  }

  copyables.forEach(function (item) {
    item.addEventListener("click", function () {
      var hex = item.getAttribute("data-hex");
      if (!hex) {
        return;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(hex).then(function () {
          showToast(hex + " copiado!");
        }).catch(function () {
          showToast("HEX: " + hex);
        });
      } else {
        showToast("HEX: " + hex);
      }
    });
  });

  if (pulseBtn && interactiveAntennas.length) {
    pulseBtn.addEventListener("click", function () {
      var active = false;
      interactiveAntennas.forEach(function (el) {
        el.classList.toggle("lab-led-pulse");
        active = el.classList.contains("lab-led-pulse");
      });
      pulseBtn.textContent = active ? "Parar Antenas" : "Pulsar Antenas";
    });
  }

  if (blinkBtn && interactiveEyes.length) {
    blinkBtn.addEventListener("click", function () {
      interactiveEyes.forEach(function (eye) {
        eye.classList.remove("lab-eye-blink");
        void eye.offsetWidth;
        eye.classList.add("lab-eye-blink");
      });
    });
  }
})();
