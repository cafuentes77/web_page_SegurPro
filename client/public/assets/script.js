// ============================================
// SEGURPRO SpA - Landing Page Scripts
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  // ------------------------------------------
  // 1. Testimonial Slider
  // ------------------------------------------
  const slides = document.querySelectorAll(".testimonial-slide");
  const dots = document.querySelectorAll(".testimonial-dot");
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => {
      dot.classList.remove("bg-primary");
      dot.classList.add("bg-gray-300");
    });
    slides[index].classList.add("active");
    dots[index].classList.remove("bg-gray-300");
    dots[index].classList.add("bg-primary");
    currentSlide = index;
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => showSlide(index));
  });

  // Auto slide cada 5 segundos
  setInterval(() => {
    let nextSlide = (currentSlide + 1) % slides.length;
    showSlide(nextSlide);
  }, 5000);

  // ------------------------------------------
  // 2. Menú Móvil (toggle con botón hamburguesa)
  // ------------------------------------------
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.createElement("div");
  mobileMenu.className = "mobile-menu";
  mobileMenu.innerHTML = `
        <div class="flex justify-between items-center p-4 border-b">
            <a href="index.html" class="flex items-center">
                <img src="./assets/img/segurprologo.png" alt="SEGURPRO Logo" class="h-12">
            </a>
            <button class="close-menu w-10 h-10 flex items-center justify-center text-gray-700">
                <i class="ri-close-line ri-2x"></i>
            </button>
        </div>
        <nav>
            <ul>
                <li><a href="#inicio">Inicio</a></li>
                <li><a href="#nosotros">Nosotros</a></li>
                <li><a href="#servicios">Servicios</a></li>
                <li><a href="#planes">Planes CCDD</a></li>
                <li><a href="#diagnostico">Diagnóstico Gratis</a></li>
                <li><a href="#contacto">Contacto</a></li>
            </ul>
        </nav>
    `;
  document.body.appendChild(mobileMenu);

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.add("open");
    });
  }

  mobileMenu.querySelector(".close-menu").addEventListener("click", () => {
    mobileMenu.classList.remove("open");
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
    });
  });

  // ------------------------------------------
  // 3. Smooth Scroll con offset para header fijo
  // ------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ------------------------------------------
  // 4. Manejo del Formulario de Contacto (fetch)
  // ------------------------------------------
  const contactForm = document.getElementById("contact-form");
  const submitBtn = document.getElementById("submit-btn");
  const formStatus = document.getElementById("form-status");

  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      submitBtn.classList.add("loading");
      submitBtn.textContent = "Enviando...";
      formStatus.classList.add("hidden");

      try {
        const response = await fetch("/api/contacto", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
          submitBtn.classList.remove("loading");
          submitBtn.classList.add("success");
          submitBtn.textContent = "✓ ¡Mensaje Enviado!";
          formStatus.textContent =
            "Gracias por contactarnos. Te responderemos en menos de 24 horas.";
          formStatus.classList.remove("hidden");
          formStatus.classList.add("text-green-600");
          contactForm.reset();

          setTimeout(() => {
            submitBtn.classList.remove("success");
            submitBtn.textContent = "Solicitar Diagnóstico Gratuito";
            formStatus.classList.add("hidden");
          }, 5000);
        } else {
          throw new Error(result.message || "Error al enviar");
        }
      } catch (error) {
        submitBtn.classList.remove("loading");
        submitBtn.classList.add("error");
        submitBtn.textContent = "✗ Error al enviar";
        formStatus.textContent =
          "Hubo un problema. Intenta por WhatsApp: +569 6568 5556";
        formStatus.classList.remove("hidden");
        formStatus.classList.add("text-red-600");

        setTimeout(() => {
          submitBtn.classList.remove("error");
          submitBtn.textContent = "Solicitar Diagnóstico Gratuito";
          formStatus.classList.add("hidden");
        }, 5000);
      }
    });
  }

  // ------------------------------------------
  // 5. Animaciones de aparición al hacer scroll
  // ------------------------------------------
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(
      "#servicios > .container > .grid > div, #planes > .container > .grid > div, #diagnostico > .container > .grid > div",
    )
    .forEach((el) => {
      el.classList.add("fade-in-section");
      observer.observe(el);
    });

  // ------------------------------------------
  // 6. Header con sombra al hacer scroll
  // ------------------------------------------
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("shadow-lg");
      header.classList.remove("shadow-md");
    } else {
      header.classList.remove("shadow-lg");
      header.classList.add("shadow-md");
    }
  });
});
