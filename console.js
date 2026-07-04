/**
 * =======================================================
 * DEVELOPER CLI TERMINAL ENGINE - console.js
 * =======================================================
 * Target: console.html
 * Functionality:
 * - Dynamic CLI commands execution parser
 * - Arrow up/down command history buffering
 * - Tab key autocompletion systems
 * - Mobile toggles
 * - Canvas Green Matrix Digital Rain Easter Egg
 */

document.addEventListener('DOMContentLoaded', () => {
  const logsContainer = document.getElementById('terminalLogs');
  const inputField = document.getElementById('terminalInput');
  const terminalScreen = document.getElementById('terminalScreen');

  let commandHistory = [];
  let historyIndex = -1;

  const commandsList = ['help', 'about', 'skills', 'projects', 'certs', 'ping', 'matrix', 'sudo hire', 'clear'];

  // CLI Engine Command Definitions
  const systemCommands = {
    help: () => {
      writeLine('Available control modules:');
      writeLine('  about      - Display academic profile & CGPA specs');
      writeLine('  skills     - Query full technologies toolkit bento');
      writeLine('  projects   - Retrieve major SDE system repositories');
      writeLine('  certs      - Output professional certifications list');
      writeLine('  ping       - Verify latency logs and node status');
      writeLine('  matrix     - Toggle green digital rain canvas overlay (Easter Egg)');
      writeLine('  sudo hire  - Run privilege escalation to recruit');
      writeLine('  clear      - Empty system log history screens');
    },
    about: () => {
      writeLine('=== PROFILE LEDGER ===', 'cyan');
      writeLine('Identity: Manjunath G K');
      writeLine('Education: B.E. Computer Science & Engineering (Final-year)');
      writeLine('Institution: UBDT College of Engineering, Davanagere');
      writeLine('CGPA cumulative: 8.8 CGPA');
      writeLine('Specialization: Java Backend Architectures & Systems development');
    },
    skills: () => {
      writeLine('=== SYSTEMS TOOLKIT ===', 'cyan');
      writeLine('Languages:  Java 8/17/21, Python 3, SQL, JavaScript, C', 'mint');
      writeLine('Backend:    Spring Boot, JPA, Hibernate, JWT, Spring Security, Flask', 'mint');
      writeLine('Databases:  MySQL, PostgreSQL, Redis Caching, DynamoDB, H2', 'mint');
      writeLine('Build/Ops:  Git, GitHub Actions, Docker, Maven, Postman APIs', 'mint');
    },
    projects: () => {
      writeLine('=== REPOSITORIES ARCHIVES ===', 'cyan');
      writeLine('* Real-Time Log Ingestion - WebSockets masking (AES-256) in memory', 'violet');
      writeLine('* CarbonLite Tracker      - Capstone footprint system (Spring Boot/JPA/MySQL)', 'violet');
      writeLine('* Finance Backend API     - Secure REST transaction controllers', 'violet');
      writeLine('* S3 File integrity       - Signature hashes validator (Python/DynamoDB)', 'violet');
    },
    certs: () => {
      writeLine('=== CREDENTIALS vault ===', 'cyan');
      writeLine('- Infosys SpringBoard SDE Intern Capstone (CarbonLite app)');
      writeLine('- Amigoscode Spring Boot for Beginners');
      writeLine('- Scaler Java Concurrency & Multithreading Systems');
      writeLine('- Infosys Java Foundations, DSA Java, and DBMS normalcy');
      writeLine('- Intel CBSE AI For All democratization');
      writeLine('- TCS iON Career Edge - Young Professional development');
    },
    ping: () => {
      const pingTime = Math.floor(Math.random() * 12) + 8;
      writeLine(`PING api.mgk.dev [127.0.0.1]: 64 bytes - time=${pingTime}ms status=200 OK`, 'mint');
    },
    'sudo hire': () => {
      writeLine('Handshaking privilege escalation protocol...', 'warning');
      setTimeout(() => {
        writeLine('AUTH STATUS: AUTHORIZED. PRIVILEGES ESCALATED.', 'mint');
        writeLine('SYSTEM RESPONSE: Recruitment route initiated! Dispatched connection packets to manjunathgk146@gmail.com.', 'cyan');
        writeLine('Please call: +91 86185 45293 to secure placement.', 'violet');
      }, 500);
    },
    clear: () => {
      logsContainer.innerHTML = '';
    }
  };

  const writeLine = (text, className = '') => {
    const line = document.createElement('div');
    line.className = `terminal-line ${className}`;
    line.textContent = text;
    logsContainer.appendChild(line);
    // Keep scrolled
    terminalScreen.scrollTop = terminalScreen.scrollHeight;
  };

  // Keyboard processing
  if (inputField) {
    // Keep focus
    document.addEventListener('click', () => {
      inputField.focus();
    });

    inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const value = inputField.value.trim();
        inputField.value = '';
        if (!value) return;

        writeLine(`mgk@sde:~$ ${value}`, 'violet');
        commandHistory.push(value);
        historyIndex = commandHistory.length;

        const cleanCmd = value.toLowerCase();
        if (systemCommands[cleanCmd]) {
          systemCommands[cleanCmd]();
        } else if (cleanCmd === 'matrix') {
          toggleMatrixRain();
        } else {
          writeLine(`sh: command not recognized: "${value}". Type "help" for options.`, 'error');
        }
      } 
      // Arrow Up History
      else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (commandHistory.length && historyIndex > 0) {
          historyIndex--;
          inputField.value = commandHistory[historyIndex];
        }
      } 
      // Arrow Down History
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          inputField.value = commandHistory[historyIndex];
        } else {
          historyIndex = commandHistory.length;
          inputField.value = '';
        }
      }
      // Tab Autocomplete
      else if (e.key === 'Tab') {
        e.preventDefault();
        const value = inputField.value.trim().toLowerCase();
        if (!value) return;

        const matches = commandsList.filter(c => c.startsWith(value));
        if (matches.length === 1) {
          inputField.value = matches[0];
        } else if (matches.length > 1) {
          writeLine(`mgk@sde:~$ ${inputField.value}`, 'violet');
          writeLine(matches.join('    '));
        }
      }
    });
  }

  // Matrix Rain overlay Easter Egg
  let matrixActive = false;
  let matrixInterval = null;
  const canvas = document.getElementById('matrixCanvas');
  
  const toggleMatrixRain = () => {
    if (!canvas) return;
    if (matrixActive) {
      canvas.style.display = 'none';
      matrixActive = false;
      clearInterval(matrixInterval);
      writeLine('Matrix overlay disabled.', 'warning');
    } else {
      canvas.style.display = 'block';
      matrixActive = true;
      initMatrixRain();
      writeLine('Matrix digital rain overlay enabled. Type "matrix" to toggle.', 'mint');
    }
  };

  const initMatrixRain = () => {
    const ctx = canvas.getContext('2d');
    canvas.width = terminalScreen.offsetWidth;
    canvas.height = terminalScreen.offsetHeight;

    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$@#%+*=&';
    const columns = canvas.width / 14;
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 5, 10, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(142, 209, 169, 0.35)'; // Moss matching tri-tone
      ctx.font = '11px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 14, drops[i] * 14);

        if (drops[i] * 14 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    matrixInterval = setInterval(draw, 33);
  };
});
