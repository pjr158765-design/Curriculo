document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector("#menu-toggle");
  const nav = document.querySelector("#nav-links");
  const navItems = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("section[id]");
  const reveals = document.querySelectorAll(".reveal");
  const skillBars = document.querySelectorAll(".skill-track span");
  const typing = document.querySelector("#typing-text");
  const year = document.querySelector("#year");

  year.textContent = new Date().getFullYear();

  menu.addEventListener("click", () => {
    const opened = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(opened));
  });

  navItems.forEach(link => link.addEventListener("click", () => nav.classList.remove("open")));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        if (entry.target.closest("#habilidades")) {
          skillBars.forEach(bar => bar.style.width = `${bar.dataset.level}%`);
        }
      }
    });
  }, { threshold: .14 });

  reveals.forEach(el => observer.observe(el));

  const phrases = [
    "desenvolvedor em formação",
    "criador de interfaces",
    "apaixonado por tecnologia",
    "estudante de programação"
  ];
  let phrase = 0, char = 0, deleting = false;

  function typeLoop() {
    const current = phrases[phrase];
    typing.textContent = deleting ? current.slice(0, char--) : current.slice(0, char++);

    if (!deleting && char > current.length) {
      deleting = true;
      setTimeout(typeLoop, 1100);
      return;
    }
    if (deleting && char < 0) {
      deleting = false;
      phrase = (phrase + 1) % phrases.length;
      char = 0;
    }
    setTimeout(typeLoop, deleting ? 42 : 72);
  }
  typeLoop();

  function setActiveLink() {
    const position = window.scrollY + 150;
    sections.forEach(section => {
      if (position >= section.offsetTop && position < section.offsetTop + section.offsetHeight) {
        navItems.forEach(a => a.classList.remove("active"));
        document.querySelector(`.nav-links a[href="#${section.id}"]`)?.classList.add("active");
      }
    });
  }
  window.addEventListener("scroll", setActiveLink);
  setActiveLink();

  const canvas = document.querySelector("#particles");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    const amount = Math.min(85, Math.floor(width / 18));
    particles = Array.from({ length: amount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - .5) * .25,
      vy: (Math.random() - .5) * .25,
      r: Math.random() * 1.7 + .5
    }));
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(125,165,255,.45)";
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 115) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(124,92,255,${.11 * (1 - d/115)})`;
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resize);
  resize();
  animate();
});