const menuBtn = document.getElementById("menuBtn");
const menuMobile = document.getElementById("menuMobile");

menuBtn.addEventListener("click", () => {
  const aberto = menuMobile.classList.toggle("aberto");
  menuBtn.setAttribute("aria-expanded", String(aberto));
  menuBtn.innerHTML = aberto
    ? '<i class="fa-solid fa-xmark"></i>'
    : '<i class="fa-solid fa-bars"></i>';
});

menuMobile.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuMobile.classList.remove("aberto");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
  });
});

const trilho = document.getElementById("trilho");
const cards = trilho.children;
const setaPrev = document.getElementById("setaPrev");
const setaNext = document.getElementById("setaNext");
const dotsBox = document.getElementById("dots");

let indice = 0;

function cardsVisiveis() {
  if (window.innerWidth >= 980) return 3;
  if (window.innerWidth >= 620) return 2;
  return 1;
}

function maxIndice() {
  return Math.max(0, cards.length - cardsVisiveis());
}

function criarDots() {
  dotsBox.innerHTML = "";
  for (let i = 0; i <= maxIndice(); i++) {
    const dot = document.createElement("button");
    dot.className = "dot" + (i === indice ? " ativo" : "");
    dot.setAttribute("aria-label", "Ir para o grupo " + (i + 1));
    dot.addEventListener("click", () => irPara(i));
    dotsBox.appendChild(dot);
  }
}

function atualizar() {
  const passo = 100 / cardsVisiveis();
  trilho.style.transform = `translateX(-${indice * passo}%)`;
  [...dotsBox.children].forEach((d, i) =>
    d.classList.toggle("ativo", i === indice),
  );
}

function irPara(i) {
  indice = Math.min(Math.max(i, 0), maxIndice());
  atualizar();
  reiniciarAutoplay();
}

setaNext.addEventListener("click", () =>
  irPara(indice >= maxIndice() ? 0 : indice + 1),
);
setaPrev.addEventListener("click", () =>
  irPara(indice <= 0 ? maxIndice() : indice - 1),
);

let toqueX = 0;
trilho.addEventListener(
  "touchstart",
  (e) => {
    toqueX = e.touches[0].clientX;
  },
  { passive: true },
);
trilho.addEventListener(
  "touchend",
  (e) => {
    const delta = e.changedTouches[0].clientX - toqueX;
    if (Math.abs(delta) > 45) {
      delta < 0
        ? irPara(indice >= maxIndice() ? 0 : indice + 1)
        : irPara(indice <= 0 ? maxIndice() : indice - 1);
    }
  },
  { passive: true },
);

let autoplay;
const reducaoMovimento = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

function iniciarAutoplay() {
  if (reducaoMovimento) return;
  autoplay = setInterval(() => {
    indice = indice >= maxIndice() ? 0 : indice + 1;
    atualizar();
  }, 5000);
}

function reiniciarAutoplay() {
  clearInterval(autoplay);
  iniciarAutoplay();
}

document
  .querySelector(".carrossel")
  .addEventListener("mouseenter", () => clearInterval(autoplay));
document
  .querySelector(".carrossel")
  .addEventListener("mouseleave", reiniciarAutoplay);

window.addEventListener("resize", () => {
  indice = Math.min(indice, maxIndice());
  criarDots();
  atualizar();
});

criarDots();
atualizar();
iniciarAutoplay();

const btnTopo = document.getElementById("btnTopo");
window.addEventListener(
  "scroll",
  () => {
    btnTopo.classList.toggle("visivel", window.scrollY > 500);
  },
  { passive: true },
);

btnTopo.addEventListener("click", () =>
  window.scrollTo({
    top: 0,
    behavior: reducaoMovimento ? "auto" : "smooth",
  }),
);

const observer = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visivel");
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15 },
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
document.getElementById("ano").textContent = new Date().getFullYear();
