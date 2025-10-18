const slides = document.querySelectorAll(".slide, .intro-slide");
let current = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    if (i === index) slide.classList.add("active");
  });

  const activeSlide = slides[index];
  gsap.fromTo(
    activeSlide.querySelector(".slide-box"),
    { y: 50, opacity: 0, scale: 0.9 },
    { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power4.out" }
  );

  const bullets = activeSlide.querySelectorAll("ul li");
  bullets.forEach((li, i) => {
    gsap.to(li, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      delay: 0.6 + i * 0.4,
      ease: "power3.out"
    });
  });
}

showSlide(0);

document.addEventListener("click", () => {
  current = (current + 1) % slides.length;
  showSlide(current);
});

const prevBtn = document.getElementById("prevSlideBtn");
prevBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  current--;
  if (current < 0) current = slides.length - 1;
  showSlide(current);
});

const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

const particles = [];
const particleCount = 80;
for (let i = 0; i < particleCount; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    dx: (Math.random() - 0.5) * 0.5,
    dy: (Math.random() - 0.5) * 0.5,
    r: Math.random() * 2 + 1
  });
}

const columns = Math.floor(canvas.width / 20);
const drops = [];
for (let i = 0; i < columns; i++) drops[i] = Math.random() * canvas.height / 20;

function animate() {
  ctx.fillStyle = "rgba(11,12,16,0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < particleCount; i++) {
    const p = particles[i];
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "#00ffff";
    ctx.fill();

    for (let j = i + 1; j < particleCount; j++) {
      const p2 = particles[j];
      const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
      if (dist < 120) {
        ctx.strokeStyle = "rgba(0,255,255," + (1 - dist / 120) + ")";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }
    }
  }

  ctx.font = "16px monospace";
  for (let i = 0; i < columns; i++) {
    if (Math.random() < 0.2) continue;
    const text = "01ABCDEF".charAt(Math.floor(Math.random() * 8));
    ctx.fillStyle = "#00ffff";
    ctx.fillText(text, i * 20, drops[i] * 20);
    drops[i] += 0.5;
    if (drops[i] * 20 > canvas.height && Math.random() > 0.97) drops[i] = 0;
  }

  requestAnimationFrame(animate);
}
animate();

function generateQRCode(text, canvasId) {
  const qr = new QRious({
    element: document.getElementById(canvasId),
    value: text,
    size: 180,
    background: "transparent",
    foreground: "#00ffff"
  });
}

const feedbackURL = "https://forms.gle/qLhQpXyHJ7wxtQ2r6";
document.getElementById("feedbackLink").href = feedbackURL;
document.getElementById("feedbackLink").textContent = feedbackURL;
generateQRCode(feedbackURL, "feedbackQR");
