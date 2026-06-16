document.addEventListener('DOMContentLoaded', () => {
  
  // -------------------------------------------------------------
  // 1. Initial Illustration Animation Trigger
  // -------------------------------------------------------------
  const illustrationCard = document.getElementById('illustration-card');
  setTimeout(() => {
    if (illustrationCard) {
      illustrationCard.classList.add('animate');
    }
  }, 100);

  // -------------------------------------------------------------
  // 2. Countdown Timer Logic
  // -------------------------------------------------------------
  // Set wedding date: September 19, 2026 at 4:30 PM (16:30)
  const weddingDate = new Date('September 19, 2026 16:30:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const difference = weddingDate - now;

    if (difference < 0) {
      clearInterval(countdownInterval);
      document.querySelector('.countdown-title').textContent = "We Are Married!";
      document.querySelector('.countdown-container').style.display = 'none';
      return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    // Update UI helper
    const updateElement = (id, value) => {
      const el = document.querySelector(`#${id} .countdown-number`);
      if (el) {
        el.textContent = String(value).padStart(2, '0');
        el.parentElement.classList.add('show');
      }
    };

    updateElement('cd-days', days);
    updateElement('cd-hours', hours);
    updateElement('cd-minutes', minutes);
    updateElement('cd-seconds', seconds);
  }

  updateCountdown(); // Run immediately
  const countdownInterval = setInterval(updateCountdown, 1000);

  // -------------------------------------------------------------
  // 3. Floating Hearts Background Generator
  // -------------------------------------------------------------
  const heartsContainer = document.getElementById('hearts-container');
  const heartSymbols = ['❤', '💖', '💕', '❣', '🌸'];

  function createHeart() {
    if (!heartsContainer) return;
    const heart = document.createElement('span');
    heart.className = 'heart';
    
    // Choose random symbol
    heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
    
    // Random horizontal position and styling
    const startX = Math.random() * 100;
    heart.style.left = `${startX}vw`;
    
    const size = Math.random() * 1.5 + 0.8;
    heart.style.fontSize = `${size}rem`;
    
    const duration = Math.random() * 4 + 5; // 5s to 9s
    heart.style.animationDuration = `${duration}s`;
    
    // Slight gold tone tint randomly
    if (Math.random() > 0.8) {
      heart.style.color = 'var(--color-gold-light)';
    }

    heartsContainer.appendChild(heart);

    // Remove heart after animation ends
    setTimeout(() => {
      heart.remove();
    }, duration * 1000);
  }

  // Create hearts periodically
  setInterval(createHeart, 2500);
  // Create a couple initially
  for (let i = 0; i < 5; i++) {
    setTimeout(createHeart, i * 600);
  }

  // -------------------------------------------------------------
  // 4. Scroll Reveal Observer
  // -------------------------------------------------------------
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  reveals.forEach(reveal => {
    const rect = reveal.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      reveal.classList.add('active');
    } else {
      revealObserver.observe(reveal);
    }
  });

  // Also trigger animation for countdown items sequentially
  const cdItems = document.querySelectorAll('.countdown-item');
  cdItems.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('show');
    }, index * 150);
  });

  // -------------------------------------------------------------
  // 5. Google Form Loading handler
  // -------------------------------------------------------------
  const googleFormIframe = document.getElementById('google-form-iframe');
  const googleFormLoading = document.querySelector('.google-form-loading');
  if (googleFormIframe && googleFormLoading) {
    googleFormIframe.addEventListener('load', () => {
      googleFormLoading.style.opacity = '0';
      setTimeout(() => {
        googleFormLoading.style.display = 'none';
      }, 500);
    });
  }

  // -------------------------------------------------------------
  // 6. Guestbook / Wishes Panel
  // -------------------------------------------------------------
  const wishForm = document.getElementById('wish-form');
  const wishesList = document.getElementById('wishes-list');

  const initialWishes = [
    {
      name: "Olivia & Henry",
      message: "Wishing you both a lifetime of love, laughter, and endless adventure. You guys make the perfect match! So excited to celebrate with you!",
      date: "06/12/2026"
    },
    {
      name: "Uncle James",
      message: "Sending you both my warmest wishes as you embark on this beautiful journey together. May your home be filled with joy and happiness.",
      date: "06/14/2026"
    }
  ];

  function getWishes() {
    const saved = localStorage.getItem('wedding_wishes');
    if (saved) {
      return JSON.parse(saved);
    }
    localStorage.setItem('wedding_wishes', JSON.stringify(initialWishes));
    return initialWishes;
  }

  function renderWishes() {
    if (!wishesList) return;
    const wishes = getWishes();
    wishesList.innerHTML = '';
    
    wishes.slice().reverse().forEach(wish => {
      const card = document.createElement('div');
      card.className = 'wish-card';
      
      card.innerHTML = `
        <div class="wish-name">${escapeHtml(wish.name)}</div>
        <div class="wish-message">"${escapeHtml(wish.message)}"</div>
        <div class="wish-date">Sent on ${wish.date}</div>
      `;
      wishesList.appendChild(card);
    });
  }

  function escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
  }

  if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('wish-name');
      const messageInput = document.getElementById('wish-message');
      
      const newWish = {
        name: nameInput.value,
        message: messageInput.value,
        date: new Date().toLocaleDateString()
      };

      const currentWishes = getWishes();
      currentWishes.push(newWish);
      localStorage.setItem('wedding_wishes', JSON.stringify(currentWishes));

      nameInput.value = '';
      messageInput.value = '';

      renderWishes();

      wishesList.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  renderWishes();

  // -------------------------------------------------------------
  // 7. Procedural Ambient Synthesizer (Web Audio API)
  // -------------------------------------------------------------
  const musicBtn = document.getElementById('music-btn');
  let audioCtx = null;
  let isMusicPlaying = false;
  let melodyInterval = null;

  function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  function playNote(freq, startTime, duration, type = 'triangle') {
    if (!audioCtx) return;
    
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.04, startTime + 0.3); // max 4% volume
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  // Romantic progression: F Maj -> C Maj -> D min -> Bb Maj
  const chords = [
    [174.61, 220.00, 261.63, 349.23], // F Maj
    [130.81, 196.00, 261.63, 329.63], // C Maj
    [146.83, 220.00, 293.66, 349.23], // D Min
    [116.54, 174.61, 233.08, 293.66]  // Bb Maj
  ];

  let chordIndex = 0;

  function playChordStep() {
    if (!audioCtx || audioCtx.state === 'suspended') return;
    const now = audioCtx.currentTime;
    const currentChord = chords[chordIndex];

    playNote(currentChord[0], now, 3.8, 'sine');

    setTimeout(() => { 
      if (isMusicPlaying) playNote(currentChord[1], audioCtx.currentTime, 3.2, 'triangle'); 
    }, 400);

    setTimeout(() => { 
      if (isMusicPlaying) playNote(currentChord[2], audioCtx.currentTime, 2.6, 'triangle'); 
    }, 800);

    setTimeout(() => { 
      if (isMusicPlaying) playNote(currentChord[3], audioCtx.currentTime, 2.0, 'sine'); 
    }, 1200);

    if (Math.random() > 0.3) {
      const highNotes = [523.25, 587.33, 659.25, 698.46, 783.99]; 
      const note = highNotes[Math.floor(Math.random() * highNotes.length)];
      setTimeout(() => { 
        if (isMusicPlaying) playNote(note, audioCtx.currentTime, 1.8, 'sine'); 
      }, 2000);
    }

    chordIndex = (chordIndex + 1) % chords.length;
  }

  function startMusic() {
    if (!audioCtx) initAudio();
    
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isMusicPlaying = true;
    musicBtn.classList.add('playing');
    
    const muteLine = document.querySelector('.mute-line');
    if (muteLine) muteLine.style.display = 'none';

    playChordStep();
    melodyInterval = setInterval(playChordStep, 3500);
  }

  function stopMusic() {
    isMusicPlaying = false;
    musicBtn.classList.remove('playing');
    
    const muteLine = document.querySelector('.mute-line');
    if (muteLine) muteLine.style.display = 'block';
    
    if (melodyInterval) {
      clearInterval(melodyInterval);
    }
  }

  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      if (isMusicPlaying) {
        stopMusic();
      } else {
        startMusic();
      }
    });
  }

});
