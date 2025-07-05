
document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');
    let currentSlide = 0;
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('bg-primary'));
        dots.forEach(dot => dot.classList.add('bg-gray-300'));
        slides[index].classList.add('active');
        dots[index].classList.remove('bg-gray-300');
        dots[index].classList.add('bg-primary');
        currentSlide = index;
    }
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });
    // Auto slide
    setInterval(() => {
        let nextSlide = (currentSlide + 1) % slides.length;
        showSlide(nextSlide);
    }, 5000);
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function () {
    const menuButton = document.querySelector('.md\\:hidden');
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'fixed inset-0 bg-white z-50 transform translate-x-full transition-transform duration-300 ease-in-out';
    mobileMenu.innerHTML = `
<div class="flex justify-between items-center p-4 border-b">
<a href="index.html" class="flex items-center">
<img src="https://static.readdy.ai/image/bc90caf4ee7a4b035faf93b8ee5bbe22/61abef7a5902c068288079ca7914abab.jfif" alt="SegurPro Logo" class="h-12">
</a>
<button class="close-menu w-10 h-10 flex items-center justify-center text-gray-700">
<i class="ri-close-line ri-2x"></i>
</button>
</div>
<nav class="p-4">
<ul class="space-y-4">
<li><a href="#inicio" class="block py-2 text-lg text-gray-700 hover:text-primary">Inicio</a></li>
<li><a href="#servicios" class="block py-2 text-lg text-gray-700 hover:text-primary">Servicios</a></li>
<li><a href="#productos" class="block py-2 text-lg text-gray-700 hover:text-primary">Productos</a></li>
<li><a href="#nosotros" class="block py-2 text-lg text-gray-700 hover:text-primary">Nosotros</a></li>
<li><a href="#contacto" class="block py-2 text-lg text-gray-700 hover:text-primary">Contacto</a></li>
</ul>
</nav>
`;
    document.body.appendChild(mobileMenu);
    menuButton.addEventListener('click', function () {
        mobileMenu.classList.remove('translate-x-full');
    });
    mobileMenu.querySelector('.close-menu').addEventListener('click', function () {
        mobileMenu.classList.add('translate-x-full');
    });
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function () {
            mobileMenu.classList.add('translate-x-full');
        });
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 45;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});


