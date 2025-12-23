document.addEventListener("DOMContentLoaded", () => {
  // --- Custom Cursor Logic ---
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorCircle = document.querySelector(".cursor-circle");

  document.addEventListener("mousemove", (e) => {
    document.documentElement.style.setProperty("--x", e.clientX + "px");
    document.documentElement.style.setProperty("--y", e.clientY + "px");
  });

  const hoverElements = document.querySelectorAll(
    "a, button, .project-card, .stack-item, .btn-primary, .service-item"
  );

  hoverElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursorCircle.classList.add("cursor-hover");
      cursorDot.classList.add("cursor-hover");
    });
    el.addEventListener("mouseleave", () => {
      cursorCircle.classList.remove("cursor-hover");
      cursorDot.classList.remove("cursor-hover");
    });
  });

  // --- Typing Effect ---
  const typeText = document.querySelector(".type-text");
  const words = [
    "dynamic user interfaces.",
    "scalable backend systems.",
    "the future of the web.",
  ];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];
    const currentChars = currentWord.substring(0, charIndex);
    typeText.textContent = currentChars;

    if (!isDeleting) {
      charIndex++;
      if (charIndex > currentWord.length) {
        isDeleting = true;
        setTimeout(type, 2000);
      } else {
        setTimeout(type, 100);
      }
    } else {
      charIndex--;
      if (charIndex < 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 500);
      } else {
        setTimeout(type, 50);
      }
    }
  }
  type();

  // --- NEW: Interactive Developer Background ---
  const canvas = document.getElementById("interactive-background-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];
  const particleCount = 100; // Increased particle count for a denser field
  const connectionDistance = 150; // Max distance for particles to connect
  let mouse = { x: null, y: null, radius: 150 }; // Mouse interaction radius

  // Particle constructor with adjusted properties for "code-like" appearance
  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size; // Smaller size for subtle "data points"
      this.color = color; // Neon cyan
      this.initialOpacity = Math.random() * 0.5 + 0.1; // Varying initial opacity
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = `rgba(0, 255, 255, ${this.initialOpacity})`; // Use initial opacity
      ctx.fill();
    }

    update() {
      // Reverse direction if hitting boundaries
      if (this.x + this.size > canvas.width || this.x - this.size < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y + this.size > canvas.height || this.y - this.size < 0) {
        this.directionY = -this.directionY;
      }

      // Mouse interaction: push particles away
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < mouse.radius + this.size) {
        if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
          this.x += 10;
        }
        if (mouse.x > this.x && this.x > this.size * 10) {
          this.x -= 10;
        }
        if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
          this.y += 10;
        }
        if (mouse.y > this.y && this.y > this.size * 10) {
          this.y -= 10;
        }
      }

      this.x += this.directionX;
      this.y += this.directionY;
      this.draw();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      let size = Math.random() * 2 + 1; // Smaller particles
      let x = Math.random() * (canvas.width - size * 2) + size;
      let y = Math.random() * (canvas.height - size * 2) + size;
      let directionX = Math.random() * 0.8 - 0.4; // Slower movement
      let directionY = Math.random() * 0.8 - 0.4; // Slower movement
      let color = "rgba(0, 255, 255, 0.5)";
      particles.push(
        new Particle(x, y, directionX, directionY, size, color)
      );
    }
  }

  // Connect particles with lines
  function connectParticles() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a; b < particles.length; b++) {
        let distance =
          (particles[a].x - particles[b].x) *
            (particles[a].x - particles[b].x) +
          (particles[a].y - particles[b].y) *
            (particles[a].y - particles[b].y);

        if (distance < connectionDistance * connectionDistance) {
          let opacity =
            1 - distance / (connectionDistance * connectionDistance);
          ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.3})`; // Lighter, transparent lines
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateBackground() {
    requestAnimationFrame(animateBackground);
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear only the particles

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
    }
    connectParticles();
  }

  // Event Listeners for mouse interaction and resize
  window.addEventListener("mousemove", function (e) {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener("mouseout", function () {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles(); // Re-initialize particles on resize
  });

  initParticles();
  animateBackground();
});
