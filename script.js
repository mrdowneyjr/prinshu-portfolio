(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = document.querySelectorAll('.reveal');

  // Progressive reveal: leave content visible until the observer is ready, so a
  // failed/blocked script can never leave the whole page faded out.
  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -28px 0px' });
    revealItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        item.classList.add('is-visible');
      } else {
        revealObserver.observe(item);
      }
    });
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }
  // Only enable hidden-until-revealed styles after every item has a safe path to visibility.
  document.documentElement.classList.add('js-ready', 'motion-ready');

  // Gentle mouse aura for desktop pointer devices.
  const aura = document.querySelector('.cursor-aura');
  if (aura && window.matchMedia('(pointer: fine)').matches && !reduceMotion) {
    document.body.classList.add('pointer-on');
    window.addEventListener('pointermove', (event) => {
      aura.style.left = `${event.clientX}px`;
      aura.style.top = `${event.clientY}px`;
    }, { passive: true });
  }

  // Animate résumé-backed metrics when the metrics section becomes visible.
  const counters = document.querySelectorAll('[data-count]');
  const countUp = (element) => {
    const target = Number(element.dataset.count || 0);
    const suffix = element.dataset.suffix || '';
    if (!Number.isFinite(target)) return;
    if (reduceMotion) {
      element.textContent = `${target}${suffix}`;
      return;
    }
    const duration = 1100;
    const startTime = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${Math.round(target * eased)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.55 });
    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach(countUp);
  }

  // Rotating focus labels in the hero.
  const roleElement = document.getElementById('role-rotator');
  const roles = ['Offensive Security', 'Red Teaming', 'Azure Security', 'Security Automation', 'Adversary Simulation'];
  if (roleElement && !reduceMotion) {
    let roleIndex = 0;
    window.setInterval(() => {
      roleElement.style.opacity = '0';
      window.setTimeout(() => {
        roleIndex = (roleIndex + 1) % roles.length;
        roleElement.textContent = roles[roleIndex];
        roleElement.style.opacity = '1';
      }, 180);
    }, 2400);
    roleElement.style.transition = 'opacity .18s ease';
  }

  // Mobile navigation.
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.getElementById('primary-nav');
  const closeMenu = () => {
    if (!menuToggle || !navLinks) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
    navLinks.classList.remove('is-open');
  };
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      menuToggle.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
      navLinks.classList.toggle('is-open', !expanded);
    });
    navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
  }

  // Interactive project filters.
  const filterButtons = document.querySelectorAll('.filter-chip');
  const projectCards = document.querySelectorAll('.project-card');
  const filterEmpty = document.getElementById('filter-empty');
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter || 'all';
      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      let visibleCount = 0;
      projectCards.forEach((card) => {
        const categories = (card.dataset.category || '').split(/\s+/);
        const show = filter === 'all' || categories.includes(filter);
        card.hidden = !show;
        if (show) visibleCount += 1;
      });
      if (filterEmpty) filterEmpty.hidden = visibleCount !== 0;
    });
  });

  // A safe simulated shell. Input is matched to fixed commands; it is never executed.
  const terminalOutput = document.getElementById('terminal-output');
  const terminalForm = document.getElementById('terminal-form');
  const terminalInput = document.getElementById('terminal-input');
  const terminalClear = document.getElementById('terminal-clear');
  const terminalCommands = {
    help: 'Available commands: about, skills, projects, metrics, contact, clear.',
    about: 'Prinshu Shukla | Cybersecurity Engineer | Bengaluru, India | 3.5+ years across offensive security, red teaming, cloud security, and automation.',
    skills: 'Focus areas: Red Teaming, Active Directory, Azure Security, Attack Surface Management, API Security, TPRA, BAS, Python, Bash, PowerShell, Pytest.',
    projects: 'Featured work: MIRA (merchant risk assessment), Attack Surface Monitoring Platform, Malware Analysis Utility. Select “Selected work” above for details.',
    metrics: 'Resume highlights: 60+ red team engagements; 150+ critical P0/P1 findings; 100K+ merchants assessed per month; 120+ third-party risk assessments.',
    contact: 'Email: princeshukla41@gmail.com | LinkedIn: linkedin.com/in/prinshu-shukla'
  };

  const appendLine = (text, className = '') => {
    if (!terminalOutput) return;
    const line = document.createElement('p');
    if (className) line.className = className;
    line.textContent = text;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  };

  const runCommand = (rawCommand) => {
    if (!terminalOutput) return;
    const command = rawCommand.trim().toLowerCase().replace(/\s+/g, ' ');
    if (!command) return;
    appendLine(`visitor@portfolio:~$ ${rawCommand.trim()}`, 'terminal-command-line');
    if (command === 'clear') {
      terminalOutput.replaceChildren();
      appendLine('Terminal cleared. Type help to see available commands.', 'terminal-muted');
      return;
    }
    if (Object.prototype.hasOwnProperty.call(terminalCommands, command)) {
      appendLine(terminalCommands[command], 'terminal-response');
      return;
    }
    appendLine(`Command not found: ${command}. This simulated shell supports help, about, skills, projects, metrics, contact, and clear.`, 'terminal-error');
  };

  if (terminalForm && terminalInput) {
    terminalForm.addEventListener('submit', (event) => {
      event.preventDefault();
      runCommand(terminalInput.value);
      terminalInput.value = '';
    });
    document.querySelectorAll('[data-command]').forEach((button) => {
      button.addEventListener('click', () => {
        runCommand(button.dataset.command || 'help');
        terminalInput.focus();
      });
    });
  }
  if (terminalClear && terminalOutput) {
    terminalClear.addEventListener('click', () => {
      terminalOutput.replaceChildren();
      appendLine('Terminal cleared. Type help to see available commands.', 'terminal-muted');
      if (terminalInput) terminalInput.focus();
    });
  }

  // Modal explains the terminal and provides a clear path to the actual interface.
  const modal = document.getElementById('terminal-modal');
  const openTerminalButton = document.getElementById('open-terminal');
  const closeTerminalButton = document.getElementById('close-terminal');
  const jumpToTerminalButton = document.getElementById('jump-to-terminal');
  const openModal = () => {
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    if (closeTerminalButton) closeTerminalButton.focus();
  };
  const closeModal = () => {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
  };
  if (openTerminalButton) openTerminalButton.addEventListener('click', openModal);
  if (closeTerminalButton) closeTerminalButton.addEventListener('click', closeModal);
  if (modal) {
    modal.querySelectorAll('[data-close-modal="true"]').forEach((element) => element.addEventListener('click', closeModal));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !modal.hidden) closeModal();
    });
  }
  if (jumpToTerminalButton) {
    jumpToTerminalButton.addEventListener('click', () => {
      closeModal();
      document.getElementById('terminal')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      window.setTimeout(() => terminalInput?.focus(), reduceMotion ? 0 : 450);
    });
  }

  // Copy-to-clipboard with a clear fallback message.
  const copyButton = document.getElementById('copy-email');
  const copyFeedback = document.getElementById('copy-feedback');
  if (copyButton && copyFeedback) {
    copyButton.addEventListener('click', async () => {
      const email = copyButton.dataset.email || 'princeshukla41@gmail.com';
      try {
        if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard API unavailable');
        await navigator.clipboard.writeText(email);
        copyFeedback.textContent = 'Email copied to clipboard.';
      } catch (error) {
        copyFeedback.textContent = `Email: ${email} — copy it from here or use “Start a conversation”.`;
      }
    });
  }

  const year = document.getElementById('current-year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
