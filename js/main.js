/**
 * Main.js - Application Logic & Futuristic Interactions
 * Features:
 * - Orbit AI Jarvis Terminal Simulation
 * - Command Palette (Ctrl+K)
 * - Project Filtering & Holographic Details Modal
 * - Hacker Text Scramble Effect
 * - Contact Form Dispatch & Instant Clipboard Copy
 * - Live IST Clock & Telemetry HUD
 */

document.addEventListener('DOMContentLoaded', () => {
  initTextScramble();
  initOrbitAITerminal();
  initCommandPalette();
  initProjectsFilterAndModal();
  initContactSystem();
  initTelemetryClock();
  initScrollSpy();
  initSoundToggleUI();
});

/* ==========================================================================
   1. Dynamic Text Scramble Effect
   ========================================================================== */
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________010101';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 20);
      const end = start + Math.floor(Math.random() * 20);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="scramble-char">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

function initTextScramble() {
  const scrambleElements = document.querySelectorAll('[data-scramble]');
  scrambleElements.forEach((el) => {
    const fx = new TextScramble(el);
    const originalText = el.getAttribute('data-scramble') || el.innerText;
    
    // Initial run
    setTimeout(() => {
      fx.setText(originalText);
    }, 400);

    el.addEventListener('mouseenter', () => {
      fx.setText(originalText);
    });
  });
}

/* ==========================================================================
   2. Orbit AI Jarvis Terminal Simulator
   ========================================================================== */
function initOrbitAITerminal() {
  const terminalInput = document.getElementById('orbit-input');
  const terminalOutput = document.getElementById('orbit-chat-history');
  const sendBtn = document.getElementById('orbit-send-btn');
  const voiceBtn = document.getElementById('orbit-voice-btn');
  const promptChips = document.querySelectorAll('.orbit-chip');
  const waveform = document.getElementById('orbit-waveform');

  if (!terminalOutput) return;

  const aiKnowledgeBase = {
    who: `<strong>Yash Gogawale</strong> is an Applied AI & Data Science scholar at <strong>IIT Jodhpur (IITJ'30)</strong>, a Researcher at the <strong>NASA OSDR AI/ML Analysis Working Group</strong>, and an official <strong>Google Product Expert</strong> for Android & Gemini.<br><br>He specializes in building autonomous AI agents, fine-tuning LLM pipelines, spaceflight biological data intelligence, and full-stack real-time web applications with Python, Three.js, Node.js, and Google Cloud Vertex AI.`,
    
    nasa: `At <strong>NASA - National Aeronautics and Space Administration</strong> (Remote), Yash works with the <strong>NASA OSDR AI/ML Analysis Working Group</strong>.<br><br>His research centers on building, benchmarking, and deploying cutting-edge machine learning models on spaceflight omics and biological datasets, evaluating cosmic radiation effects and physiological adaptations to advance deep space exploration life sciences.`,
    
    enterprise: `The <strong>Enterprise AI Agent</strong> is an autonomous production system designed and deployed using the <strong>Gemini API</strong> and <strong>Vertex AI on Google Cloud</strong>.<br><br>It features a dynamic reasoning engine, multi-head knowledge retrieval (RAG), sub-120ms latency pipelines, and automated multi-step decision execution for enterprise workflows.`,
    
    singlespot: `<strong>SingleSpot (QuickPaste)</strong> is a zero-friction local-network clipboard synchronizer that relays text copied on a mobile phone to a PC clipboard in real time.<br><br>Built with <strong>WebSockets, Node.js, HTML5, and QR-code pairing</strong>, it removes the need for cloud accounts, third-party chat forwarding, or cables.`,
    
    orbit: `<strong>Orbit AI</strong> is Yash's flagship personal Jarvis-style AI companion. It features an interactive HUD cockpit interface, persistent memory, Claude API conversational intelligence, voice dictation, task and health metrics, and liquid-glass UI visuals.`,
    
    contact: `You can connect with Yash directly via:<br>• <strong>Email:</strong> <a href="mailto:yashgogawale1609@gmail.com" class="text-cyan">yashgogawale1609@gmail.com</a><br>• <strong>Phone:</strong> <a href="tel:+917972198991" class="text-cyan">+91 7972198991</a><br>• <strong>LinkedIn:</strong> <a href="https://www.linkedin.com/in/yash-gogawale-iitj-tech/" target="_blank" rel="noopener" class="text-cyan">linkedin.com/in/yash-gogawale-iitj-tech/</a><br>• <strong>Location:</strong> Pune / IIT Jodhpur, India`,
    
    stack: `<strong>Core Arsenal:</strong><br>• <em>Languages:</em> Python, JavaScript (ES6+), HTML5, CSS3, C++<br>• <em>AI & LLM:</em> Gemini API, Claude Code, Vertex AI, RAG, Ollama, n8n, Prompt Engineering<br>• <em>Web & 3D:</em> Three.js, Node.js, WebSockets, Electron, PWA<br>• <em>Cloud & Tools:</em> Google Cloud Platform, AWS, Git, Android Studio, Pandas, NumPy`
  };

  function appendUserMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg user-msg';
    msg.innerHTML = `
      <div class="msg-bubble">
        <span class="msg-author">USER //</span> ${escapeHtml(text)}
      </div>
    `;
    terminalOutput.appendChild(msg);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function appendAIMessage(htmlContent) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg ai-msg';
    msg.innerHTML = `
      <div class="msg-avatar"><span class="orbit-pulse"></span>ORBIT</div>
      <div class="msg-bubble ai-bubble typing">
        <span class="typing-indicator"><span></span><span></span><span></span></span>
      </div>
    `;
    terminalOutput.appendChild(msg);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;

    // Simulate AI thinking and streaming
    setTimeout(() => {
      const bubble = msg.querySelector('.ai-bubble');
      bubble.classList.remove('typing');
      bubble.innerHTML = htmlContent;
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
      if (window.audioFX) window.audioFX.playKeyClick();
    }, 450);
  }

  function handleQuery(rawQuery) {
    const q = rawQuery.trim().toLowerCase();
    if (!q) return;

    appendUserMessage(rawQuery);
    if (window.audioFX) window.audioFX.playKeyClick();

    // Match query to knowledge base
    let response = '';
    if (q.includes('who') || q.includes('about') || q.includes('yash') || q.includes('introduce')) {
      response = aiKnowledgeBase.who;
    } else if (q.includes('nasa') || q.includes('space') || q.includes('omics') || q.includes('research')) {
      response = aiKnowledgeBase.nasa;
    } else if (q.includes('enterprise') || q.includes('gemini') || q.includes('vertex')) {
      response = aiKnowledgeBase.enterprise;
    } else if (q.includes('singlespot') || q.includes('quickpaste') || q.includes('clipboard')) {
      response = aiKnowledgeBase.singlespot;
    } else if (q.includes('orbit') || q.includes('companion') || q.includes('jarvis')) {
      response = aiKnowledgeBase.orbit;
    } else if (q.includes('contact') || q.includes('hire') || q.includes('email') || q.includes('phone') || q.includes('reach')) {
      response = aiKnowledgeBase.contact;
    } else if (q.includes('stack') || q.includes('skills') || q.includes('tech') || q.includes('languages')) {
      response = aiKnowledgeBase.stack;
    } else if (q.includes('clear')) {
      terminalOutput.innerHTML = '';
      return;
    } else {
      response = `Command acknowledged: "<em>${escapeHtml(rawQuery)}</em>".<br><br>Yash is actively developing autonomous AI agents and contributing to NASA OSDR research. Check out his <a href="#projects" class="text-cyan">Featured Projects</a> or reach out on <a href="https://www.linkedin.com/in/yash-gogawale-iitj-tech/" target="_blank" class="text-cyan">LinkedIn</a>!`;
    }

    appendAIMessage(response);
  }

  if (sendBtn && terminalInput) {
    sendBtn.addEventListener('click', () => {
      const text = terminalInput.value;
      if (text) {
        handleQuery(text);
        terminalInput.value = '';
      }
    });

    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const text = terminalInput.value;
        if (text) {
          handleQuery(text);
          terminalInput.value = '';
        }
      }
    });
  }

  // Preset chips
  promptChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const query = chip.dataset.query;
      if (query) {
        handleQuery(query);
      }
    });
  });

  // Voice simulation button
  if (voiceBtn && waveform) {
    let isListening = false;
    voiceBtn.addEventListener('click', () => {
      isListening = !isListening;
      voiceBtn.classList.toggle('active', isListening);
      waveform.classList.toggle('active', isListening);
      if (window.audioFX) window.audioFX.playWarp();

      if (isListening) {
        terminalInput.setAttribute('placeholder', 'Listening for voice input...');
        setTimeout(() => {
          if (isListening) {
            handleQuery('Tell me about your NASA research and AI projects');
            isListening = false;
            voiceBtn.classList.remove('active');
            waveform.classList.remove('active');
            terminalInput.setAttribute('placeholder', 'Ask Orbit AI anything (e.g. "NASA research", "Tech stack")...');
          }
        }, 2200);
      } else {
        terminalInput.setAttribute('placeholder', 'Ask Orbit AI anything (e.g. "NASA research", "Tech stack")...');
      }
    });
  }
}

/* ==========================================================================
   3. Command Palette (Ctrl+K / Cmd+K)
   ========================================================================== */
function initCommandPalette() {
  const paletteModal = document.getElementById('command-palette-modal');
  const paletteInput = document.getElementById('palette-input');
  const paletteList = document.getElementById('palette-items');
  const openBtns = document.querySelectorAll('.open-palette-btn');
  const closeBtn = document.getElementById('palette-close-btn');

  if (!paletteModal || !paletteInput || !paletteList) return;

  const commands = [
    { title: 'Go to About Section', category: 'Navigation', icon: 'user', action: () => scrollToSection('#about') },
    { title: 'View Work Experience & NASA', category: 'Navigation', icon: 'briefcase', action: () => scrollToSection('#experience') },
    { title: 'Explore Featured Projects', category: 'Navigation', icon: 'cpu', action: () => scrollToSection('#projects') },
    { title: 'View Technical Skills Matrix', category: 'Navigation', icon: 'layers', action: () => scrollToSection('#skills') },
    { title: 'Launch Orbit AI Companion', category: 'Interactive', icon: 'bot', action: () => scrollToSection('#orbit-ai') },
    { title: 'Contact Yash Directly', category: 'Action', icon: 'mail', action: () => scrollToSection('#contact') },
    { title: 'Copy Email to Clipboard', category: 'Action', icon: 'copy', action: () => copyEmailToClipboard() },
    { title: 'Open LinkedIn Profile', category: 'External', icon: 'external-link', action: () => window.open('https://www.linkedin.com/in/yash-gogawale-iitj-tech/', '_blank') },
    { title: 'Switch 3D: Deep Space Orbit', category: '3D Scene', icon: 'globe', action: () => window.universe3D && window.universe3D.setMode('space') },
    { title: 'Switch 3D: Neural Matrix', category: '3D Scene', icon: 'activity', action: () => window.universe3D && window.universe3D.setMode('neural') },
    { title: 'Switch 3D: Quantum Torus', category: '3D Scene', icon: 'disc', action: () => window.universe3D && window.universe3D.setMode('torus') },
    { title: 'Switch 3D: Stardust Swarm', category: '3D Scene', icon: 'sparkles', action: () => window.universe3D && window.universe3D.setMode('particles') },
    { title: 'Toggle Cybernetic Sound FX', category: 'Settings', icon: 'volume-2', action: () => toggleSoundGlobal() }
  ];

  function renderList(query = '') {
    paletteList.innerHTML = '';
    const filtered = commands.filter((c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) {
      paletteList.innerHTML = `<div class="palette-empty">No matching commands found.</div>`;
      return;
    }

    filtered.forEach((cmd, idx) => {
      const item = document.createElement('div');
      item.className = `palette-item ${idx === 0 ? 'selected' : ''}`;
      item.innerHTML = `
        <div class="palette-item-left">
          <span class="palette-cat">${cmd.category}</span>
          <span class="palette-title">${cmd.title}</span>
        </div>
        <span class="palette-action-icon">↵</span>
      `;
      item.addEventListener('click', () => {
        closePalette();
        cmd.action();
      });
      paletteList.appendChild(item);
    });
  }

  function openPalette() {
    paletteModal.classList.add('active');
    paletteInput.value = '';
    renderList('');
    paletteInput.focus();
    if (window.audioFX) window.audioFX.playWarp();
  }

  function closePalette() {
    paletteModal.classList.remove('active');
  }

  openBtns.forEach((btn) => btn.addEventListener('click', openPalette));
  if (closeBtn) closeBtn.addEventListener('click', closePalette);

  paletteModal.addEventListener('click', (e) => {
    if (e.target === paletteModal) closePalette();
  });

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (paletteModal.classList.contains('active')) {
        closePalette();
      } else {
        openPalette();
      }
    } else if (e.key === 'Escape' && paletteModal.classList.contains('active')) {
      closePalette();
    }
  });

  paletteInput.addEventListener('input', (e) => {
    renderList(e.target.value);
  });
}

function scrollToSection(selector) {
  const el = document.querySelector(selector);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

/* ==========================================================================
   4. Project Filtering and Holographic Modal
   ========================================================================== */
function initProjectsFilterAndModal() {
  const filterChips = document.querySelectorAll('.project-filter-chip');
  const projectCards = document.querySelectorAll('.project-card');
  const modal = document.getElementById('project-detail-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const modalContent = document.getElementById('modal-dynamic-body');

  const projectDetails = {
    orbit: {
      title: 'Orbit AI - Personal AI Companion',
      badge: 'Flagship Autonomous Agent',
      image: 'assets/images/orbit_ai.jpg',
      period: '2026',
      tech: ['JavaScript', 'HTML5/CSS3', 'Claude Code', 'Ollama', 'Web Audio API', 'Canvas Shaders'],
      highlights: [
        'Jarvis-style futuristic cockpit HUD interface with dynamic speech waveform telemetry and real-time audio reactive graphics.',
        'Integration with Claude API and local Ollama inference models for dual-mode cloud and edge intelligence.',
        'Persistent cross-session memory architecture storing user tasks, physiological vitals, and sentiment trends.',
        'Canvas-based frame animations, solar-system background dynamics, and liquid-glass specular styling.'
      ],
      github: 'https://github.com/',
      demo: '#orbit-ai'
    },
    enterprise: {
      title: 'Enterprise AI Agent (Vertex AI & Gemini)',
      badge: 'Cloud & GenAI Systems',
      image: 'assets/images/enterprise_ai.jpg',
      period: 'Jul 2026 - Present',
      tech: ['Python', 'Gemini API', 'Vertex AI', 'Google Cloud Platform', 'RAG Pipelines'],
      highlights: [
        'Production-ready autonomous reasoning agent built for enterprise automation workflows using Google Cloud Vertex AI.',
        'Multi-head retrieval-augmented generation (RAG) with sub-120ms token processing latency.',
        'Model convergence tracking, automated structured reasoning loops, and multi-tenant security.',
        'High-dimensional dataset integration tested against synthetic benchmarks.'
      ],
      github: 'https://github.com/',
      demo: 'https://www.linkedin.com/in/yash-gogawale-iitj-tech/'
    },
    singlespot: {
      title: 'SingleSpot (QuickPaste) Clipboard Relay',
      badge: 'Real-Time Systems & WebSockets',
      image: 'assets/images/singlespot.jpg',
      period: '2026',
      tech: ['Node.js', 'WebSockets', 'JavaScript', 'HTML5', 'CSS3', 'QR Code Engine'],
      highlights: [
        'Instant zero-cloud local-network clipboard sync connecting mobile phone to PC desktop in real time.',
        'Dynamic room-code pairing via instant animated QR code scan.',
        'Sub-15ms WebSocket data propagation with zero persistent server storage for ultimate privacy.',
        'Modular, dependency-light architecture engineered with clean separation of concerns.'
      ],
      github: 'https://github.com/',
      demo: 'https://www.linkedin.com/in/yash-gogawale-iitj-tech/'
    },
    nasa: {
      title: 'NASA OSDR Spaceflight Omics AI Research',
      badge: 'Bio-AI & Deep Space Research',
      image: 'assets/images/nasa_space.jpg',
      period: 'Sep 2026 - Present',
      tech: ['Machine Learning', 'Python', 'Spaceflight Omics', 'Biological Datasets', 'Pandas', 'NumPy'],
      highlights: [
        'Collaborating with the NASA OSDR AI/ML Analysis Working Group to build, benchmark, and deploy predictive models.',
        'Analyzing spaceflight transcriptomics, proteomics, and radiation stress markers on human and model organisms.',
        'Translating complex space biology datasets into actionable research findings for deep space mission safety.',
        'Evaluating model performance across sparse and high-noise biological telemetry.'
      ],
      github: 'https://github.com/',
      demo: 'https://osdr.nasa.gov/'
    },
    circuit: {
      title: 'Circuit Generator - AI Electronic Schematics',
      badge: 'Hardware & GenAI Tooling',
      image: 'assets/images/circuit_gen.jpg',
      period: '2026',
      tech: ['JavaScript', 'Gemini API', 'OpenAI API', 'HTML5 Canvas', 'SVG Engine'],
      highlights: [
        'Single-page application turning natural language hardware prompts into verified circuit schematics.',
        'Generates step-by-step wiring instructions, component BOM lists, and breadboard diagrams.',
        'Multi-model fallback architecture with Gemini and OpenAI APIs for high schema accuracy.'
      ],
      github: 'https://github.com/',
      demo: 'https://www.linkedin.com/in/yash-gogawale-iitj-tech/'
    },
    browser: {
      title: 'CBB - Chromium-Based Power Browser',
      badge: 'Systems & Desktop Engineering',
      image: 'assets/images/enterprise_ai.jpg',
      period: '2026',
      tech: ['Electron', 'Node.js', 'JavaScript', 'Chromium Engine', 'C++'],
      highlights: [
        'Custom desktop browser equipped with built-in tracker and telemetry blocking engines.',
        'Vertical tabs, workspace grouping, split-screen multitasking views, and integrated markdown reader mode.',
        'Exploratory prototype combining Electron webview bridges and custom Chromium build configurations.'
      ],
      github: 'https://github.com/',
      demo: 'https://www.linkedin.com/in/yash-gogawale-iitj-tech/'
    }
  };

  // Filter chips click
  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      filterChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');

      const filter = chip.dataset.filter;
      if (window.audioFX) window.audioFX.playHover();

      projectCards.forEach((card) => {
        const category = card.dataset.category;
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // Modal open
  document.querySelectorAll('.open-modal-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const key = btn.dataset.projectKey;
      const data = projectDetails[key];
      if (!data || !modal || !modalContent) return;

      modalContent.innerHTML = `
        <div class="modal-hero-visual">
          <img src="${data.image}" alt="${escapeHtml(data.title)}" class="modal-preview-img" />
          <div class="modal-hero-overlay">
            <span class="modal-badge">${data.badge}</span>
            <span class="modal-year">${data.period}</span>
          </div>
        </div>
        <div class="modal-info-body">
          <h2 class="modal-title">${data.title}</h2>
          
          <div class="modal-tags">
            ${data.tech.map((t) => `<span class="tech-tag">${t}</span>`).join('')}
          </div>

          <div class="modal-section">
            <h4 class="modal-subheading">Technical Highlights & Architecture</h4>
            <ul class="modal-list">
              ${data.highlights.map((h) => `<li>${h}</li>`).join('')}
            </ul>
          </div>

          <div class="modal-actions">
            <a href="${data.github}" target="_blank" rel="noopener" class="btn btn-secondary magnetic-btn">
              <span>View GitHub</span>
            </a>
            <a href="${data.demo}" class="btn btn-primary magnetic-btn">
              <span>Launch / Inspect</span>
            </a>
          </div>
        </div>
      `;

      modal.classList.add('active');
      if (window.audioFX) window.audioFX.playWarp();
    });
  });

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }
}

/* ==========================================================================
   5. Contact Form and Clipboard Actions
   ========================================================================== */
function initContactSystem() {
  const form = document.getElementById('contact-form');
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  const copyPhoneBtns = document.querySelectorAll('.copy-phone-btn');
  const feedbackToast = document.getElementById('feedback-toast');

  function showToast(message) {
    if (!feedbackToast) return;
    feedbackToast.textContent = message;
    feedbackToast.classList.add('show');
    if (window.audioFX) window.audioFX.playPowerUp();

    setTimeout(() => {
      feedbackToast.classList.remove('show');
    }, 3200);
  }

  copyEmailBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText('yashgogawale1609@gmail.com').then(() => {
        showToast('✓ Email address copied to clipboard!');
      });
    });
  });

  copyPhoneBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText('+917972198991').then(() => {
        showToast('✓ Phone number copied to clipboard!');
      });
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = `<span>TRANSMITTING ENCRYPTED PACKET...</span>`;
      submitBtn.disabled = true;
      if (window.audioFX) window.audioFX.playWarp();

      const name = form.querySelector('#contact-name').value;
      const email = form.querySelector('#contact-email').value;
      const message = form.querySelector('#contact-message').value;

      setTimeout(() => {
        submitBtn.innerHTML = `<span>✓ PACKET DELIVERED TO YASH</span>`;
        showToast(`Thank you ${name}! Direct message dispatched.`);
        
        // Open default mail client as reliable fallback
        const mailtoUrl = `mailto:yashgogawale1609@gmail.com?subject=Portfolio Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(message + '\n\nSender Email: ' + email)}`;
        window.location.href = mailtoUrl;

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          form.reset();
        }, 3000);
      }, 1200);
    });
  }
}

function copyEmailToClipboard() {
  navigator.clipboard.writeText('yashgogawale1609@gmail.com').then(() => {
    const feedbackToast = document.getElementById('feedback-toast');
    if (feedbackToast) {
      feedbackToast.textContent = '✓ Email copied to clipboard: yashgogawale1609@gmail.com';
      feedbackToast.classList.add('show');
      setTimeout(() => feedbackToast.classList.remove('show'), 3000);
    }
  });
}

/* ==========================================================================
   6. Live IST Telemetry Clock
   ========================================================================== */
function initTelemetryClock() {
  const clockEl = document.getElementById('ist-clock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    // Indian Standard Time format (UTC+5:30)
    const options = {
      timeZone: 'Asia/Kolkata',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    const timeStr = new Intl.DateTimeFormat('en-GB', options).format(now);
    clockEl.textContent = `${timeStr} IST`;
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   7. Scroll Spy & Progress Bar
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const progressBar = document.getElementById('scroll-progress-bar');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 200;

    // Progress bar width
    if (progressBar) {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const pct = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
      progressBar.style.width = `${pct}%`;
    }

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  });
}

/* ==========================================================================
   8. Sound Toggle UI Synchronizer
   ========================================================================== */
function initSoundToggleUI() {
  const soundBtns = document.querySelectorAll('.sound-toggle-btn');
  const soundEqualizer = document.querySelectorAll('.equalizer-bar');

  function updateVisuals(enabled) {
    soundBtns.forEach((btn) => {
      btn.classList.toggle('sound-on', enabled);
      const text = btn.querySelector('.sound-label');
      if (text) text.textContent = enabled ? 'SFX: ON' : 'SFX: OFF';
    });
  }

  soundBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (window.audioFX) {
        const enabled = window.audioFX.toggleSound();
        updateVisuals(enabled);
      }
    });
  });

  if (window.audioFX) {
    updateVisuals(window.audioFX.enabled);
  }
}

function toggleSoundGlobal() {
  if (window.audioFX) {
    const enabled = window.audioFX.toggleSound();
    initSoundToggleUI();
  }
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
