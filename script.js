document.addEventListener("DOMContentLoaded", () => {
  /* ========================================================================
     1. Ambient Golden Embers Canvas
     ======================================================================== */
  const canvas = document.getElementById("ember-canvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  window.addEventListener("mousemove", (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  });

  class Ember {
    constructor(burstX = null, burstY = null) {
      this.reset(burstX, burstY);
    }

    reset(burstX = null, burstY = null) {
      this.x = burstX !== null ? burstX : Math.random() * canvas.width;
      this.y = burstY !== null ? burstY : canvas.height + Math.random() * 120;
      this.size = burstX !== null ? Math.random() * 3.5 + 1.5 : Math.random() * 2.4 + 0.8;
      this.speedY = burstX !== null ? (Math.random() - 0.65) * 3.2 : -(Math.random() * 0.55 + 0.2);
      this.speedX = burstX !== null ? (Math.random() - 0.5) * 3.6 : (Math.random() - 0.5) * 0.35;
      this.alpha = Math.random() * 0.65 + 0.25;
      this.decay = burstX !== null ? 0.014 : 0.0008;
      this.hue = Math.random() > 0.35 ? "228, 184, 125" : "217, 123, 139";
    }

    update() {
      const dx = (pointer.x - this.x) * 0.00018;
      this.x += this.speedX + dx;
      this.y += this.speedY;
      this.alpha -= this.decay;

      if (this.alpha <= 0 || this.y < -20) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.hue}, ${Math.max(this.alpha, 0)})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 65; i++) {
    const ember = new Ember();
    ember.y = Math.random() * canvas.height;
    particles.push(ember);
  }

  function spawnEmberBurst(x, y, count = 26) {
    for (let i = 0; i < count; i++) {
      particles.push(new Ember(x, y));
    }
    if (particles.length > 160) {
      particles = particles.slice(particles.length - 160);
    }
  }

  function animateEmbers() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateEmbers);
  }
  animateEmbers();

  /* ========================================================================
     2. Web Audio API Midnight Piano Melody
     ======================================================================== */
  const audioToggle = document.getElementById("audio-toggle");
  const audioLabel = document.getElementById("audio-label");
  const melodyAudio = document.getElementById("melody-audio");

  function updateMelodyButton(isPlaying) {
    audioToggle.setAttribute("aria-pressed", String(isPlaying));
    audioLabel.textContent = isPlaying ? "Pause Melody" : "Midnight Melody";
    audioToggle.setAttribute(
      "aria-label",
      isPlaying ? "Pause midnight melody" : "Play midnight melody"
    );
  }

  melodyAudio.addEventListener("play", () => updateMelodyButton(true));
  melodyAudio.addEventListener("pause", () => updateMelodyButton(false));
  melodyAudio.addEventListener("ended", () => updateMelodyButton(false));

  audioToggle.addEventListener("click", () => {
    if (melodyAudio.paused) {
      melodyAudio.play().catch((error) => {
        updateMelodyButton(false);
        console.error("Unable to play the local melody audio.", error);
      });
    } else {
      melodyAudio.pause();
    }
  });

  /* ========================================================================
     3. Candlelight / Dawn Mood Toggle
     ======================================================================== */
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");
  const themeLabel = document.getElementById("theme-label");

  themeToggle.addEventListener("click", () => {
    const isDawn = document.body.classList.toggle("dawn-mode");
    themeIcon.textContent = isDawn ? "🌙" : "🕯️";
    themeLabel.textContent = isDawn ? "Candlelight" : "Dawn";
  });

  /* ========================================================================
     4. Chapter I: Quiet Truths Flip Cards
     ======================================================================== */
  const quietTruths = [
    {
      roman: "I",
      title: "The Sanctuary of Your Presence",
      reflection:
        "Before you, I didn't know a person could feel like a quiet room after a long storm. Just knowing you exist in this world softens the sharpest edges of my days."
    },
    {
      roman: "II",
      title: "Your Unspoken Grace",
      reflection:
        "I notice the gentle things you never announce—the patience in your eyes, the kindness you carry quietly, and the way you care deeply without ever asking for applause."
    },
    {
      roman: "III",
      title: "Even Your Silences",
      reflection:
        "With you, silence is never empty or heavy. Sitting beside your thoughts feels more honest than a thousand conversations with anyone else."
    },
    {
      roman: "IV",
      title: "How You Changed My Gravity",
      reflection:
        "You did not demand space in my heart; you simply arrived, and suddenly every dream I had for tomorrow naturally made room for your name."
    },
    {
      roman: "V",
      title: "Your Strength & Softness",
      reflection:
        "I admire how you hold both resilience and tenderness in the same breath. Loving you has taught me what true courage looks like."
    },
    {
      roman: "VI",
      title: "My Constant Prayer for You",
      reflection:
        "My deepest wish is simple: that you always feel as cherished, protected, and profoundly loved as you have made me feel since the day I met you."
    }
  ];

  const cardsGrid = document.getElementById("cards-grid");

  quietTruths.forEach((item) => {
    const card = document.createElement("div");
    card.className = "truth-card";
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${item.title}. Click to reveal reflection.`);

    card.innerHTML = `
      <div class="truth-card-inner">
        <div class="truth-face truth-front">
          <span class="truth-roman">${item.roman}</span>
          <h3>${item.title}</h3>
          <span class="flip-prompt">Touch to turn over</span>
        </div>
        <div class="truth-face truth-back">
          <p>“${item.reflection}”</p>
          <span class="card-sign">— Nivedita</span>
        </div>
      </div>
    `;

    const toggleFlip = () => card.classList.toggle("flipped");
    card.addEventListener("click", toggleFlip);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleFlip();
      }
    });

    cardsGrid.appendChild(card);
  });

  /* ========================================================================
     5. Chapter II: Wax-Sealed Love Letter
     ======================================================================== */
  const letterEnvelope = document.getElementById("letter-envelope");
  const waxSealBtn = document.getElementById("wax-seal-btn");
  const resealBtn = document.getElementById("reseal-btn");
  const parchmentLetter = document.getElementById("parchment-letter");

  waxSealBtn.addEventListener("click", (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    spawnEmberBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 34);
    letterEnvelope.classList.add("unsealed");
    parchmentLetter.setAttribute("aria-hidden", "false");
  });

  resealBtn.addEventListener("click", () => {
    letterEnvelope.classList.remove("unsealed");
    parchmentLetter.setAttribute("aria-hidden", "true");
    letterEnvelope.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  /* ========================================================================
     6. Chapter III: Constellations of Us (Interactive Jar)
     ======================================================================== */
  const jarData = {
    promises: [
      "I promise to be your calm harbor when the world feels too heavy, and your loudest celebration when your dreams come alive.",
      "I promise to listen not just to your words, Ananya, but to the feelings you hesitate to speak out loud.",
      "I promise to choose you on the quiet, ordinary Tuesdays just as fiercely as on the brightest milestones of our lives.",
      "I promise to protect your peace, honor your heart, and never let you forget how extraordinary you are.",
      "I promise that no matter how chaotic life becomes, my love for you will always remain steady, patient, and true.",
      "I promise to meet your honesty with kindness, even when the truth takes courage to share.",
      "I promise to make room for your dreams and cheer for every brave step you take toward them.",
      "I promise to keep learning how you feel loved, instead of assuming I already know.",
      "I promise to offer my attention freely and put away distractions when your heart needs to be heard.",
      "I promise to respect your quiet moments and give you space without making you feel alone.",
      "I promise to bring laughter into our ordinary days and tenderness into the difficult ones.",
      "I promise to celebrate your wins without comparison and stand beside you through every setback.",
      "I promise to apologize sincerely when I am wrong and to let my actions reflect what I have learned.",
      "I promise to keep curiosity alive between us, asking about your thoughts, hopes, and changing dreams.",
      "I promise to be gentle with the parts of you that are still healing and patient with the time they need.",
      "I promise to make our home in the small things: shared stories, familiar comforts, and unhurried time together.",
      "I promise to speak of you with warmth and honor the trust you place in me.",
      "I promise to keep choosing kindness, especially when life asks more of us than we expected."
    ],
    whispers: [
      "Every time you smile, something inside me quietly whispers: ‘This is what home looks like.’",
      "If I had to live this entire life over again, I would still search every crowd until I found you, Ananya.",
      "You are the softest thought in my mind before I fall asleep and the warmest gratitude when I wake.",
      "Loving you is the easiest, most natural thing my soul has ever done.",
      "Even in a room full of a thousand voices, my heart knows the exact cadence of yours.",
      "Somehow, even an ordinary day feels worth remembering when I get to share it with you.",
      "Your laugh has a way of finding the light in me, even on days I have misplaced it.",
      "When I picture the moments I want to keep, you are there in more of them than I can count.",
      "I love the quiet comfort of being near you, with nothing to prove and nowhere else to be.",
      "The world feels a little less hurried whenever I hear your voice.",
      "I hope you know how often your kindness stays with me long after the moment has passed.",
      "You make tenderness feel brave and being understood feel possible.",
      "If happiness had a familiar sound, I think it would be your voice saying my name.",
      "I find new reasons to admire you in the little things you think no one notices.",
      "Even our quietest moments become memories I carry with a smile.",
      "My favorite kind of future is one with room for both of us to keep growing.",
      "There is a gentle kind of magic in the way you make people feel seen.",
      "On the busiest days, the thought of sharing a small peaceful moment with you feels like a gift.",
      "I hope you can feel, even from a distance, how warmly my heart is holding you."
    ]
  };

  let activeCategory = "promises";
  let lastIndex = 0;

  const jarTabs = document.querySelectorAll(".jar-tab");
  const glassJar = document.getElementById("glass-jar");
  const drawScrollBtn = document.getElementById("draw-scroll-btn");
  const scrollDisplay = document.getElementById("drawn-scroll-display");
  const scrollBadge = document.getElementById("scroll-badge");
  const scrollQuote = document.getElementById("scroll-quote");

  function drawNewScroll() {
    const list = jarData[activeCategory];
    let nextIndex = Math.floor(Math.random() * list.length);
    if (nextIndex === lastIndex && list.length > 1) {
      nextIndex = (nextIndex + 1) % list.length;
    }
    lastIndex = nextIndex;

    glassJar.classList.remove("shake");
    void glassJar.offsetWidth;
    glassJar.classList.add("shake");

    const jarRect = glassJar.getBoundingClientRect();
    spawnEmberBurst(jarRect.left + jarRect.width / 2, jarRect.top + jarRect.height / 2, 18);

    scrollDisplay.classList.add("updating");
    setTimeout(() => {
      scrollBadge.textContent =
        activeCategory === "promises" ? "Sacred Promise" : "Soul Whisper";
      scrollQuote.textContent = `“${list[nextIndex]}”`;
      scrollDisplay.classList.remove("updating");
    }, 220);
  }

  jarTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      jarTabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      activeCategory = tab.dataset.category;
      drawNewScroll();
    });
  });

  drawScrollBtn.addEventListener("click", drawNewScroll);
  glassJar.addEventListener("click", drawNewScroll);
  glassJar.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      drawNewScroll();
    }
  });

  /* ========================================================================
     7. Chapter IV: Hold My Heart (Pulse Resonance)
     ======================================================================== */
  const confessions = [
    {
      title: "The First Spark",
      text: "You entered my life softly, yet somehow rearranged every star I used to navigate by."
    },
    {
      title: "The Quiet Devotion",
      text: "I fell in love not only with your beauty, Ananya, but with the rare gentleness of your spirit."
    },
    {
      title: "The Unspoken Depth",
      text: "There is a part of my heart that only knows how to beat in rhythm with your happiness."
    },
    {
      title: "The Sanctuary",
      text: "When life feels uncertain, the thought of you is the anchor that brings me safely back to myself."
    },
    {
      title: "Forever & Always",
      text: "In every lifetime, in every version of this universe, my soul would still reach for yours, Ananya. — Nivedita"
    }
  ];

  const heartStage = document.getElementById("heart-stage");
  const heartCoreBtn = document.getElementById("heart-core-btn");
  const meterFill = document.getElementById("meter-fill");
  const layerIndicator = document.getElementById("layer-indicator");
  const confessionTitle = document.getElementById("confession-title");
  const confessionText = document.getElementById("confession-text");

  let currentLayer = 0;
  let holdInterval = null;
  let heartPressStarted = 0;

  function advanceHeartLayer() {
    currentLayer = (currentLayer + 1) % confessions.length;
    const progress = ((currentLayer + 1) / confessions.length) * 100;
    meterFill.style.width = `${progress}%`;
    layerIndicator.textContent =
      currentLayer === confessions.length - 1
        ? "Layer 5 of 5 • Full Heart Unveiled"
        : `Layer ${currentLayer + 1} of 5 • Keep holding or tapping`;

    confessionTitle.textContent = confessions[currentLayer].title;
    confessionText.textContent = confessions[currentLayer].text;

    const rect = heartCoreBtn.getBoundingClientRect();
    spawnEmberBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);
  }

  function startHoldingHeart() {
    heartPressStarted = performance.now();
    heartStage.classList.add("pulsing");
    heartCoreBtn.classList.add("holding");
    clearInterval(holdInterval);
    holdInterval = setInterval(advanceHeartLayer, 1400);
  }

  function stopHoldingHeart() {
    heartStage.classList.remove("pulsing");
    heartCoreBtn.classList.remove("holding");
    clearInterval(holdInterval);
  }

  heartCoreBtn.addEventListener("pointerdown", startHoldingHeart);
  heartCoreBtn.addEventListener("pointerup", (event) => {
    const pressDuration = performance.now() - heartPressStarted;
    const shouldAdvanceForTap = pressDuration < 350;
    stopHoldingHeart();
    if (shouldAdvanceForTap) {
      advanceHeartLayer();
    }
  });
  heartCoreBtn.addEventListener("pointerleave", () => {
    stopHoldingHeart();
  });
  heartCoreBtn.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      advanceHeartLayer();
    }
  });

  /* ========================================================================
     8. Subtle Scroll Reveal Observer
     ======================================================================== */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));
});