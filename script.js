/**
 * =======================================================
 * PORTFOLIO MAIN CONTROLLER & INTERACTION SYSTEMS - script.js
 * =======================================================
 * Theme: Behance-style Minimal Light Gallery
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. MOBILE DRAWER INTERACTION
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });
  }

  // 2. SCROLL HEIGHT ACTIVE SPY FOR PILL DOCK
  const sections = document.querySelectorAll('section[id]');
  const dockItems = document.querySelectorAll('.nav-dock .dock-item');

  const updateActiveDock = () => {
    let scrollPos = window.scrollY + 200;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        dockItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${section.id}` || item.getAttribute('href') === `index.html#${section.id}`) {
            item.classList.add('active');
          }
        });
      }
    });

    if (window.scrollY < 100) {
      dockItems.forEach(item => item.classList.remove('active'));
      const homeItem = document.querySelector('.nav-dock a[href="#home"], .nav-dock a[href="index.html"]');
      if (homeItem) homeItem.classList.add('active');
    }
  };

  window.addEventListener('scroll', updateActiveDock, { passive: true });
  updateActiveDock();

  // 3. TYPEWRITER EFFECT FOR SDE HERO
  const typewriter = document.getElementById('typewriter');
  if (typewriter) {
    const words = ["Java Backend Developer", "Systems Architect", "Spring Boot Engineer", "Computer Science Student"];
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let delay = 100;

    const type = () => {
      const current = words[wordIdx];
      if (isDeleting) {
        typewriter.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        delay = 40;
      } else {
        typewriter.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        delay = 80;
      }

      if (!isDeleting && charIdx === current.length) {
        delay = 2000;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        delay = 500;
      }
      typewriter.innerHTML = `&gt; ${typewriter.textContent}<span style="animation: pulse 1s infinite; color: var(--accent);">|</span>`;
      setTimeout(type, delay);
    };
    setTimeout(type, 800);
  }

  // 4. BENTO CARDS HOVER SHIELD
  const tiltCards = document.querySelectorAll('.info-block, .bento-card, .project-card, .achieve-card, .contact-card-item, .biometric-card');
  const isMobile = window.innerWidth < 768;

  if (!isMobile && tiltCards.length) {
    tiltCards.forEach(card => {
      const glow = document.createElement('div');
      glow.style.cssText = `
        position: absolute; inset: 0; pointer-events: none; opacity: 0;
        transition: opacity 0.4s ease; z-index: 1; border-radius: inherit;
      `;
      card.style.position = 'relative';
      card.appendChild(glow);

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        glow.style.opacity = '1';
        glow.style.background = `radial-gradient(circle 140px at ${x}px ${y}px, rgba(255, 62, 0, 0.04), transparent)`;
      });

      card.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
      });
    });
  }

  // 5. PROJECTS FILTER CONTROLLER
  const filterBtns = document.querySelectorAll('.projects-filter-bar .filter-btn');
  const projectCards = document.querySelectorAll('.projects-grid .project-card');

  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        projectCards.forEach(card => {
          const cat = card.dataset.tech;
          if (filter === 'all' || cat === filter) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 30);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.98)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  // 6. CONTACT API TEMPLATE DISPATCHER
  const jsonOutput = document.getElementById('mailJsonOutput');
  const mailBtn = document.getElementById('connectionMailBtn');
  const btnIntern = document.getElementById('btn-tmpl-intern');
  const btnJob = document.getElementById('btn-tmpl-job');
  const btnNet = document.getElementById('btn-tmpl-net');

  if (jsonOutput && mailBtn) {
    const templates = {
      intern: {
        sender: "Recruiter / Visitor",
        subject: "Internship Inquiry",
        body: "Hi Manjunath, I saw your portfolio and would like to discuss SDE / SWE internship opportunities with your team."
      },
      job: {
        sender: "Hiring Manager",
        subject: "SDE Role Inquiry",
        body: "Hello Manjunath, we are looking for a Java SDE with Spring Boot and database engineering experience. Let's arrange a call."
      },
      net: {
        sender: "Developer / Networker",
        subject: "Networking Connect",
        body: "Hey Manjunath, great systems portfolio. Let's connect on SDE trends and Java architectures!"
      }
    };

    const updateTemplate = (key, activeBtn) => {
      [btnIntern, btnJob, btnNet].forEach(b => { if (b) b.classList.remove('active'); });
      if (activeBtn) activeBtn.classList.add('active');

      const data = templates[key];
      jsonOutput.value = JSON.stringify(data, null, 2);
    };

    // Dynamically compile mailto href at click runtime
    mailBtn.addEventListener('click', () => {
      try {
        const payload = JSON.parse(jsonOutput.value);
        const subject = payload.subject || "SDE Inquiry";
        const body = payload.body || "";
        mailBtn.href = `mailto:manjunathgk146@gmail.com?subject=${encodeURIComponent(subject + ' - Manjunath G K')}&body=${encodeURIComponent(body)}`;
      } catch (err) {
        mailBtn.href = `mailto:manjunathgk146@gmail.com?subject=SDE%20Inquiry&body=${encodeURIComponent(jsonOutput.value)}`;
      }
    });

    if (btnIntern) btnIntern.addEventListener('click', () => updateTemplate('intern', btnIntern));
    if (btnJob) btnJob.addEventListener('click', () => updateTemplate('job', btnJob));
    if (btnNet) btnNet.addEventListener('click', () => updateTemplate('net', btnNet));
  }

  // 7. COPY TOOLTIP CONTROL
  const emailVal = document.getElementById('emailVal');
  const copyTooltip = document.getElementById('copyTooltip');

  if (emailVal) {
    emailVal.addEventListener('click', () => {
      navigator.clipboard.writeText('manjunathgk146@gmail.com')
        .then(() => {
          if (copyTooltip) {
            copyTooltip.textContent = '✓ Email Copied!';
            copyTooltip.style.opacity = '1';
            setTimeout(() => {
              copyTooltip.style.opacity = '0';
            }, 1800);
          }
        })
        .catch(err => {
          console.error("Could not copy: ", err);
        });
    });
  }

  // 8. VIDEO CONTROLS FOR INTRO VIDEO
  const introVideo = document.getElementById('introVideo');
  const videoMuteBtn = document.getElementById('videoMuteBtn');
  if (introVideo && videoMuteBtn) {
    const muteIcon = videoMuteBtn.querySelector('.mute-icon');
    const volumeIcon = videoMuteBtn.querySelector('.volume-icon');

    videoMuteBtn.addEventListener('click', () => {
      if (introVideo.muted) {
        introVideo.muted = false;
        muteIcon.classList.add('hidden');
        volumeIcon.classList.remove('hidden');
        videoMuteBtn.setAttribute('aria-label', 'Mute video');
      } else {
        introVideo.muted = true;
        muteIcon.classList.remove('hidden');
        volumeIcon.classList.add('hidden');
        videoMuteBtn.setAttribute('aria-label', 'Unmute video');
      }
    });
  }
});
