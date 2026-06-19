// Parallax suave na hero
window.addEventListener("scroll", () => {
  let heroText = document.querySelector(".hero-text");
  if (!heroText) return;

  let scrolled = window.scrollY * 0.2;
  heroText.style.transform = `translateY(${scrolled}px)`;
  heroText.style.opacity = 1 - window.scrollY / 600;
});

// Verificação de elementos visíveis
window.addEventListener("scroll", () => {
  let elementos = document.querySelectorAll(".card, .produto-card");
  elementos.forEach((el) => {
    let top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 100) {
      el.classList.add("visivel");
    }
  });
});
