/**
 * Portfolio Interactive Scripts
 * Handles:
 * 1. Automatic browser theme detection via CSS media queries (prefers-color-scheme)
 * 2. Synchronized Night/Day mode toggles (Header + Left Sidebar)
 * 3. Left vertical navigation bar (drawer toggle on mobile, keyboard accessible, backdrop dismiss)
 * 4. ScrollSpy for vertical navigation items with retro active indicators
 * 5. Interactive terminal chat transmission simulator
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeManager();
    initVerticalSidebar();
    initScrollSpy();
    initTerminalChat();
    initSkillBars();
    initVideoPlayer();
    initProjectModal();
    initFooterInteractions();
    initContactForm();
});

/**
 * Manages Night / Day Mode theme states with CSS media query detection
 * Synchronizes both header and sidebar theme toggle buttons
 */
function initThemeManager() {
    const headerToggleBtn = document.getElementById('theme-toggle');
    const headerIcon = document.getElementById('theme-toggle-icon');
    const headerText = document.getElementById('theme-mode-text');

    const sidebarToggleBtn = document.getElementById('sidebar-theme-toggle');
    const sidebarText = document.getElementById('sidebar-theme-text');

    const heroToggleBtn = document.getElementById('hero-theme-toggle');
    const heroIcon = document.getElementById('hero-theme-icon');
    const heroText = document.getElementById('hero-theme-text');
    
    // Media query to detect default browser/OS preference
    const mediaQueryDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check local storage for explicit user preference
    const storedTheme = localStorage.getItem('portfolio-theme');
    
    // Determine active initial theme: Stored preference, or detect from browser media query
    let currentTheme = storedTheme ? storedTheme : (mediaQueryDark.matches ? 'dark' : 'light');

    // Apply the active theme
    applyTheme(currentTheme);

    // Listen to OS/browser theme changes dynamically if user hasn't manually overridden
    mediaQueryDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('portfolio-theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Theme toggle action handler
    function toggleCurrentTheme() {
        const activeTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        localStorage.setItem('portfolio-theme', activeTheme);
        applyTheme(activeTheme);
    }

    if (headerToggleBtn) {
        headerToggleBtn.addEventListener('click', toggleCurrentTheme);
    }
    if (sidebarToggleBtn) {
        sidebarToggleBtn.addEventListener('click', toggleCurrentTheme);
    }
    if (heroToggleBtn) {
        heroToggleBtn.addEventListener('click', toggleCurrentTheme);
    }

    /**
     * Applies theme to DOM, updates button aria attributes & icons
     */
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const isDark = theme === 'dark';
        const titleText = isDark ? 'Switch to Day Mode' : 'Switch to Night Mode';
        const iconChar = isDark ? '🌙' : '☀️';
        const labelText = isDark ? 'NIGHT' : 'DAY';

        // Update Header Toggle
        if (headerToggleBtn) {
            headerToggleBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
            headerToggleBtn.setAttribute('title', titleText);
        }
        if (headerIcon) {
            headerIcon.textContent = iconChar;
        }
        if (headerText) {
            headerText.textContent = labelText;
        }

        // Update Sidebar Toggle
        if (sidebarToggleBtn) {
            sidebarToggleBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
            sidebarToggleBtn.setAttribute('title', titleText);
            const sideIcon = sidebarToggleBtn.querySelector('.theme-icon');
            if (sideIcon) sideIcon.textContent = iconChar;
        }
        if (sidebarText) {
            sidebarText.textContent = labelText;
        }

        // Update Hero Toggle
        if (heroToggleBtn) {
            heroToggleBtn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
            heroToggleBtn.setAttribute('title', titleText);
        }
        if (heroIcon) {
            heroIcon.textContent = iconChar;
        }
        if (heroText) {
            heroText.textContent = `[THEME: ${labelText}]`;
        }
    }
}

/**
 * Handles the Vertical Sidebar Navigation (Left side of screen)
 * Accessible drawer for mobile/tablet, smooth scroll, and backdrop dismiss
 */
function initVerticalSidebar() {
    const sidebar = document.getElementById('pixel-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    const openBtn = document.getElementById('mobile-nav-toggle');
    const closeBtn = document.getElementById('sidebar-close-btn');
    const navLinks = document.querySelectorAll('.sidebar-link');

    if (!sidebar) return;

    function openSidebar() {
        sidebar.classList.add('active');
        if (backdrop) backdrop.classList.add('active');
        if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = window.innerWidth < 1024 ? 'hidden' : '';
    }

    function closeSidebar() {
        sidebar.classList.remove('active');
        if (backdrop) backdrop.classList.remove('active');
        if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    // Toggle button on mobile
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            const isOpen = sidebar.classList.contains('active');
            if (isOpen) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    // Close button inside sidebar
    if (closeBtn) {
        closeBtn.addEventListener('click', closeSidebar);
    }

    // Backdrop click dismisses
    if (backdrop) {
        backdrop.addEventListener('click', closeSidebar);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            closeSidebar();
        }
    });

    // Close mobile drawer when clicking any link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 1024) {
                closeSidebar();
            }
        });
    });
}

/**
 * ScrollSpy: Highlights the active link in the vertical sidebar as user scrolls
 */
function initScrollSpy() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sections = Array.from(sidebarLinks).map(link => {
        const id = link.getAttribute('href').replace('#', '');
        return document.getElementById(id);
    }).filter(Boolean);

    function updateActiveSection() {
        const scrollPosition = window.scrollY + 180;

        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            if (section.offsetTop <= scrollPosition) {
                const currentId = section.getAttribute('id');
                
                sidebarLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                        link.setAttribute('aria-current', 'page');
                    } else {
                        link.classList.remove('active');
                        link.removeAttribute('aria-current');
                    }
                });
                break;
            }
        }
    }

    window.addEventListener('scroll', updateActiveSection, { passive: true });
    updateActiveSection();
}

/**
 * ==========================================================================
 * INTERACTIVE KABEER AI PORTFOLIO CHAT AGENT
 * 
 * Simulates an interactive AI version of K M Kabeeruddin.
 * Visitors can ask questions about technical skills, major projects, 
 * education, contact methods, and work opportunities.
 * 
 * --------------------------------------------------------------------------
 * HOW TO INTEGRATE A LIVE AI API (e.g., OpenAI / Gemini / Claude):
 * --------------------------------------------------------------------------
 * 1. BACKEND PROXY (Recommended for Security):
 *    Never expose your `OPENAI_API_KEY` in client-side JavaScript.
 *    Create a serverless function or backend endpoint (e.g. `/api/chat`)
 *    that forwards requests to OpenAI:
 * 
 *    async function fetchFromBackend(userMessage) {
 *        const response = await fetch('/api/chat', {
 *            method: 'POST',
 *            headers: { 'Content-Type': 'application/json' },
 *            body: JSON.stringify({ message: userMessage })
 *        });
 *        const data = await response.json();
 *        return data.reply;
 *    }
 * 
 * 2. DIRECT OPENAI CLIENT API CALL (For prototypes or local testing):
 *    const OPENAI_API_KEY = "YOUR_API_KEY_HERE"; // Warning: Exposes key on client
 *    async function callOpenAIApi(userMessage) {
 *        const res = await fetch("https://api.openai.com/v1/chat/completions", {
 *            method: "POST",
 *            headers: {
 *                "Content-Type": "application/json",
 *                "Authorization": `Bearer ${OPENAI_API_KEY}`
 *            },
 *            body: JSON.stringify({
 *                model: "gpt-4o-mini", // or gpt-3.5-turbo
 *                messages: [
 *                    {
 *                        role: "system",
 *                        content: "You are Kabeer AI, an interactive AI version of K M Kabeeruddin, a Full-Stack Software Engineer (B.Tech in CSE). Answer visitor questions professionally, enthusiastically, and concisely about Kabeer's skills (JS, TS, React, Node.js, Python, MongoDB, SQL), projects (Full-Stack E-Commerce Platform, Kanban Workflow Dashboard), and background. Invite them to contact Kabeer or download his CV."
 *                    },
 *                    { role: "user", content: userMessage }
 *                ],
 *                temperature: 0.7,
 *                max_tokens: 300
 *            })
 *        });
 *        const data = await res.json();
 *        return data.choices[0].message.content;
 *    }
 * ==========================================================================
 */
function initTerminalChat() {
    const chatForm = document.getElementById('terminal-chat-form');
    const chatInput = document.getElementById('chat-user-input');
    const messagesContainer = document.getElementById('chat-messages-container');
    const typingIndicator = document.getElementById('chat-typing-indicator');
    const clearBtn = document.getElementById('chat-clear-btn');
    const charCounter = document.getElementById('chat-char-counter');
    const quickChips = document.querySelectorAll('.quick-chip-btn');

    if (!chatForm || !chatInput || !messagesContainer) return;

    // Track character count
    chatInput.addEventListener('input', () => {
        const count = chatInput.value.length;
        if (charCounter) {
            charCounter.textContent = `${count} / 280`;
        }
    });

    // Handle Quick Query Chip Clicks
    quickChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const query = chip.dataset.query || chip.textContent.trim();
            chatInput.value = query;
            if (charCounter) charCounter.textContent = `${query.length} / 280`;
            handleSendMessage(query);
            chatInput.value = '';
            if (charCounter) charCounter.textContent = '0 / 280';
        });
    });

    // Handle Form Submission
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = chatInput.value.trim();
        if (!text) return;

        handleSendMessage(text);
        chatInput.value = '';
        if (charCounter) charCounter.textContent = '0 / 280';
    });

    // Handle Reset / Clear Chat
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            messagesContainer.innerHTML = `
                <div class="chat-msg msg-system">
                    <span class="msg-prefix">[SYSTEM]:</span>
                    <span class="msg-content">Neural memory cleared. Ready for new transmission.</span>
                </div>
                <div class="chat-msg msg-bot">
                    <div class="msg-avatar-icon" aria-hidden="true">👾</div>
                    <div class="msg-bubble">
                        <div class="msg-sender-meta">
                            <span class="msg-sender-name">KABEER AI</span>
                            <span class="msg-time-badge">${getCurrentTimeFormatted()}</span>
                        </div>
                        <div class="msg-content">
                            Memory reset! What would you like to explore next? Feel free to ask about my skills, projects, or background!
                        </div>
                    </div>
                </div>
            `;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        });
    }

    /**
     * Dispatches user message, displays typing state, and generates AI reply
     */
    function handleSendMessage(messageText) {
        // 1. Append User Message Bubble
        appendUserMessage(messageText);

        // 2. Show Typing Indicator
        showTypingIndicator(true);

        // 3. Simulate AI processing time (600ms - 1000ms for natural conversational rhythm)
        const thinkDuration = Math.floor(Math.random() * 400) + 650;

        setTimeout(() => {
            showTypingIndicator(false);
            
            // Generate contextual response
            // NOTE: To hook up OpenAI API, replace getContextualAiResponse() with:
            // const aiReply = await callOpenAIApi(messageText);
            const aiReply = getContextualAiResponse(messageText);
            
            appendBotMessage(aiReply);
        }, thinkDuration);
    }

    /**
     * Appends a user message to the display area
     */
    function appendUserMessage(text) {
        const userMsg = document.createElement('div');
        userMsg.className = 'chat-msg msg-user';
        userMsg.innerHTML = `
            <div class="msg-avatar-icon" aria-hidden="true">👤</div>
            <div class="msg-bubble">
                <div class="msg-sender-meta">
                    <span class="msg-sender-name">YOU (GUEST)</span>
                    <span class="msg-time-badge">${getCurrentTimeFormatted()}</span>
                </div>
                <div class="msg-content">${escapeHTML(text)}</div>
            </div>
        `;
        messagesContainer.appendChild(userMsg);
        scrollToBottom();
    }

    /**
     * Appends an AI message to the display area
     */
    function appendBotMessage(htmlContent) {
        const botMsg = document.createElement('div');
        botMsg.className = 'chat-msg msg-bot';
        botMsg.innerHTML = `
            <div class="msg-avatar-icon" aria-hidden="true">👾</div>
            <div class="msg-bubble">
                <div class="msg-sender-meta">
                    <span class="msg-sender-name">KABEER AI</span>
                    <span class="msg-time-badge">${getCurrentTimeFormatted()}</span>
                </div>
                <div class="msg-content">${htmlContent}</div>
            </div>
        `;
        messagesContainer.appendChild(botMsg);
        scrollToBottom();
    }

    /**
     * Controls the visibility of the animated typing indicator
     */
    function showTypingIndicator(show) {
        if (!typingIndicator) return;
        typingIndicator.style.display = show ? 'flex' : 'none';
        if (show) scrollToBottom();
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function getCurrentTimeFormatted() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    /**
     * Contextual Intelligence Engine:
     * Evaluates user query keywords and returns tailored responses for K M Kabeeruddin
     */
    function getContextualAiResponse(rawQuery) {
        const query = rawQuery.toLowerCase();

        // 1. Greetings & Identity
        if (query.match(/\b(hi|hello|hey|greetings|who are you|sup|morning|evening)\b/)) {
            return `Greetings! I'm <strong>Kabeer AI</strong>, the digital avatar of K M Kabeeruddin. I'm trained on his portfolio, technical background, and project experience. How can I help you today? You can ask about his <a href="#skills">skills</a>, <a href="#projects">projects</a>, or <a href="#contact">how to get in touch</a>!`;
        }

        // 2. Skills & Technical Stack
        if (query.match(/\b(skill|skills|tech|stack|languages|javascript|typescript|react|node|python|backend|frontend|framework)\b/)) {
            return `Kabeer specializes in <strong>Full-Stack Software Engineering</strong>:<br>
            • <strong>Languages:</strong> JavaScript (ES6+ 92%), TypeScript (85%), Python (88%), Java &amp; C++ (80%), SQL (86%).<br>
            • <strong>Frontend:</strong> React.js, Next.js, Semantic HTML5, Vanilla CSS3, Responsive UX.<br>
            • <strong>Backend &amp; DB:</strong> Node.js, Express.js, RESTful APIs, MongoDB, PostgreSQL.<br>
            • <strong>DevOps &amp; Tools:</strong> Git/GitHub, Docker, Linux CLI, Postman, CI/CD.<br>
            Check out the animated meter bars in the <a href="#skills">Skills section</a>!`;
        }

        // 3. Projects & Portfolio Work
        if (query.match(/\b(project|projects|work|ecommerce|dashboard|kanban|built|apps|portfolio)\b/)) {
            return `Kabeer has engineered several production-grade systems:<br>
            1. <strong>Full-Stack Enterprise E-Commerce:</strong> Built with React, Node.js, Express &amp; MongoDB, featuring JWT security, search indexing, and cart management.<br>
            2. <strong>Interactive Kanban Workflow Dashboard:</strong> Real-time project tracking with drag-and-drop state transitions.<br>
            3. <strong>Retro Developer OS &amp; Portfolio:</strong> Pixel-art styled responsive web experience with auto night-mode detection.<br>
            Explore them in detail in the <a href="#projects">Featured Projects</a> section!`;
        }

        // 4. Education & Academic Background
        if (query.match(/\b(education|degree|college|university|btech|school|bachelor|study|studies|marks|cgpa)\b/)) {
            return `Kabeer holds a <strong>Bachelor of Technology (B.Tech) in Computer Science &amp; Engineering (2020 - 2024)</strong>. His coursework focused deeply on Data Structures &amp; Algorithms, Database Systems (DBMS), Operating Systems, Computer Networks, and Modular Software Engineering. You can review the full timeline in the <a href="#timeline">Timeline section</a>!`;
        }

        // 5. Hiring, Career, Collaboration & Work Availability
        if (query.match(/\b(hire|job|role|opportunity|available|work with|collaborate|freelance|contract|full-time)\b/)) {
            return `Yes! Kabeer is <strong>actively open to full-time Software Engineering roles and exciting collaborations</strong>.<br>
            He is experienced in building scalable web architectures, writing clean maintainable code, and working within agile teams. You can connect directly via <a href="#contact">the contact form</a> or email him at <a href="mailto:contact@example.com">contact@example.com</a>.`;
        }

        // 6. Resume / CV
        if (query.match(/\b(resume|cv|download|document|pdf)\b/)) {
            return `You can view or download Kabeer's full curriculum vitae directly! Click here to download: <a href="Kabeer_s_Resume.pdf" download target="_blank" style="color:var(--accent-yellow);font-weight:bold;">📜 Download Kabeer's Resume (PDF)</a>.`;
        }

        // 7. Video / Introduction
        if (query.match(/\b(video|intro|introduction|watch|self intro)\b/)) {
            return `You can watch Kabeer's personal video introduction in the <a href="#spotlight">Spotlight section</a> right above Projects! It features a responsive retro CRT video player with both his local introduction video and YouTube stream.`;
        }

        // 8. Contact & Socials
        if (query.match(/\b(contact|email|message|reach|call|phone|linkedin|github)\b/)) {
            return `You can reach Kabeer through multiple channels:<br>
            • <strong>Email:</strong> <a href="mailto:contact@example.com">contact@example.com</a><br>
            • <strong>Location:</strong> Hyderabad, India<br>
            • <strong>Contact Form:</strong> Jump to <a href="#contact">Contact Form</a> below to transmit an inquiry directly!`;
        }

        // 9. Default Fallback Response
        return `Interesting query! While I am currently running on simulated portfolio intelligence, I can share plenty of details about Kabeer's craft. Try asking me about:
        <br>• <em>"What are your core technical skills?"</em>
        <br>• <em>"Tell me about your flagship projects."</em>
        <br>• <em>"What is your educational background?"</em>
        <br>• <em>"How can I hire you?"</em>
        <br>Or send Kabeer a direct transmission via the <a href="#contact">Contact section</a>!`;
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag));
    }
}

/**
 * Animates skill progress bars with an 8-bit filling effect upon scrolling into view
 */
function initSkillBars() {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection) return;

    const skillFills = skillsSection.querySelectorAll('.pixel-meter-fill');
    
    // Store original target percentage and reset width to 0% for animation
    skillFills.forEach(fill => {
        const targetPct = fill.style.getPropertyValue('--skill-pct') || '85%';
        fill.dataset.target = targetPct;
        fill.style.width = '0%';
    });

    // Observe when the skills section scrolls into view
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillFills.forEach((fill, index) => {
                    setTimeout(() => {
                        fill.style.width = fill.dataset.target;
                    }, index * 45);
                });
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    observer.observe(skillsSection);
}

/**
 * Interactive Video Source Switcher (YouTube Stream vs Local Intro)
 */
function initVideoPlayer() {
    const youtubeBtn = document.getElementById('tab-youtube-btn');
    const localBtn = document.getElementById('tab-local-btn');
    const youtubeContainer = document.getElementById('youtube-player-container');
    const localContainer = document.getElementById('local-player-container');
    const localVideo = document.getElementById('portfolio-local-video');
    const hudSource = document.getElementById('video-hud-source');
    const windowTitle = document.querySelector('.video-player-window .pixel-window-title');

    if (!youtubeBtn || !localBtn || !youtubeContainer || !localContainer) return;

    youtubeBtn.addEventListener('click', () => {
        youtubeBtn.classList.add('active');
        youtubeBtn.setAttribute('aria-selected', 'true');
        localBtn.classList.remove('active');
        localBtn.setAttribute('aria-selected', 'false');

        youtubeContainer.style.display = 'block';
        localContainer.style.display = 'none';

        if (hudSource) hudSource.textContent = 'YOUTUBE / CLOUD HD';
        if (windowTitle) windowTitle.textContent = 'YOUTUBE_LIVE_FEED.MP4';

        if (localVideo) {
            localVideo.pause();
        }
    });

    localBtn.addEventListener('click', () => {
        localBtn.classList.add('active');
        localBtn.setAttribute('aria-selected', 'true');
        youtubeBtn.classList.remove('active');
        youtubeBtn.setAttribute('aria-selected', 'false');

        youtubeContainer.style.display = 'none';
        localContainer.style.display = 'block';

        if (hudSource) hudSource.textContent = 'HTML5 / MP4 STREAM';
        if (windowTitle) windowTitle.textContent = 'SELF_INTRO_BROADCAST.MP4';
    });
}

/**
 * ==========================================================================
 * PROJECT THUMBNAILS & DETAILED SPECIFICATION MODAL ARCHITECTURE
 * 
 * CONNECTION EXPLANATION:
 * 1. Data Connection:
 *    Every project in HTML defines a unique identifier via the 'data-project-id'
 *    attribute on both its thumbnail wrapper (.project-thumb-wrapper) and its
 *    detail action button (.open-details-btn).
 *    Example: data-project-id="ecommerce" -> maps to projectsData['ecommerce'].
 * 
 * 2. Event Binding:
 *    The initProjectModal() function iterates over all elements matching
 *    '[data-project-id]' within the projects section. When a user clicks or
 *    presses Enter/Space on any thumbnail, the project ID is extracted via
 *    'element.getAttribute("data-project-id")'.
 * 
 * 3. Dynamic Rendering & Accessibility:
 *    The corresponding project record is looked up in 'projectsData'. Its
 *    architecture breakdown, summary, key engineering features, tech stack,
 *    and live demo / repository links are dynamically rendered into the
 *    accessible '#project-detail-modal' dialog.
 * ==========================================================================
 */
const projectsData = {
    'ecommerce': {
        title: 'Full-Stack Enterprise E-Commerce Platform',
        category: 'FULL-STACK WEB APP',
        status: 'PRODUCTION READY',
        year: '2024',
        summary: 'A high-performance online retail platform engineered with secure JWT authentication, complex catalog multi-attribute querying, persistent cart state synchronization, and mock payment gateway integration.',
        architecture: 'Decoupled client-server architecture featuring a modular React frontend communicating with a RESTful Express/Node.js microservices layer and MongoDB document database utilizing compound indexes.',
        challenges: 'Managing atomic stock decrementing during concurrent checkout sessions and ensuring sub-100ms catalog query response times across nested category trees.',
        keyFeatures: [
            'Role-based access control (Customer checkout vs Admin inventory management)',
            'Full-text search with regex indexing, category filters, and price ranges',
            'MongoDB aggregate pipelines for sales analytics and customer order histories',
            'High-contrast pixel-art UI optimized for 100% responsive cross-device layout'
        ],
        tags: ['React.js', 'Node.js', 'Express', 'MongoDB', 'JWT Auth', 'REST APIs'],
        demoUrl: 'https://example.com/demo/ecommerce',
        githubUrl: 'https://github.com/example/ecommerce-platform',
        bannerIcon: '🛒'
    },
    'kanban': {
        title: 'Interactive Task & Workflow Kanban Dashboard',
        category: 'WEB APPLICATION',
        status: 'ACTIVE SYSTEM',
        year: '2023 - 2024',
        summary: 'A real-time collaborative project management dashboard featuring fluid drag-and-drop task movement, multi-user state synchronization, and productivity throughput metrics.',
        architecture: 'Vanilla ES6+ JavaScript client with native HTML5 Drag and Drop API, coupled with a Node.js WebSocket gateway for zero-latency state broadcasts and localized offline caching.',
        challenges: 'Maintaining conflict-free task order arrays during simultaneous drag-and-drop actions across multiple active collaborative browser sessions.',
        keyFeatures: [
            'Smooth 60fps drag-and-drop interaction across customizable pipeline lanes',
            'Instant multi-client state reflection via bidirectional WebSockets',
            'Analytical productivity telemetry: velocity charts, lead time, and burndown',
            'Full keyboard navigation accessibility with ARIA live region announcements'
        ],
        tags: ['JavaScript (ES6+)', 'CSS Grid', 'Node.js', 'WebSockets', 'State Engine'],
        demoUrl: 'https://example.com/demo/kanban',
        githubUrl: 'https://github.com/example/kanban-dashboard',
        bannerIcon: '⚡'
    },
    'ai-assistant': {
        title: 'AI Code Intelligence & Syntax Analyzer',
        category: 'DEVELOPER TOOL',
        status: 'BETA VERSION',
        year: '2024',
        summary: 'An intelligent software engineering tool performing real-time AST syntax analysis, algorithmic complexity detection (Big-O), and context-aware code refactoring.',
        architecture: 'FastAPI asynchronous Python microservice communicating with LLM code completion models, interfaced with a lightweight React code workspace and WebAssembly syntax tokenizers.',
        challenges: 'Balancing LLM inference latency with instant local AST linting to deliver instant syntax feedback while streaming model suggestions.',
        keyFeatures: [
            'Abstract Syntax Tree (AST) parsing with automated Big-O estimation',
            'Context-aware explanation of nested logic bottlenecks and memory leaks',
            'One-click automated refactoring to modern ES6+ and PEP8 standards',
            'Dockerized container setup for frictionless developer onboarding'
        ],
        tags: ['Python', 'FastAPI', 'React', 'AST Parser', 'LLM Integration', 'Docker'],
        demoUrl: 'https://example.com/demo/code-assistant',
        githubUrl: 'https://github.com/example/ai-code-analyzer',
        bannerIcon: '🤖'
    },
    'retro-portfolio': {
        title: 'Retro Pixel Art Developer OS & Portfolio Engine',
        category: 'CREATIVE UI/UX',
        status: 'DEPLOYED & LIVE',
        year: '2023',
        summary: 'An interactive 8-bit retro arcade developer portfolio engine featuring automatic browser night-mode detection, responsive vertical navigation, and simulated AI terminal comms.',
        architecture: 'Pure Vanilla CSS & semantic HTML5 engineered with CSS custom property design tokens, responsive media queries, and modular vanilla JavaScript.',
        challenges: 'Achieving an authentic vintage 8-bit CRT monitor aesthetic while rigorously maintaining modern web accessibility standards, readability, and mobile responsiveness.',
        keyFeatures: [
            'Zero runtime dependencies guaranteeing sub-second page performance',
            'Synchronized Day/Night theme toggles with OS media query change listener',
            'Off-canvas sliding navigation drawer for mobile and tablet touchscreens',
            'Segmented 8-bit skill progress meters and interactive AI terminal simulator'
        ],
        tags: ['Vanilla CSS', 'Modern JavaScript', 'Pixel Typography', 'Semantic HTML5'],
        demoUrl: '#hero',
        githubUrl: 'https://github.com/example/pixel-portfolio',
        bannerIcon: '👾'
    },
    'cloud-monitor': {
        title: 'Cloud Microservices & Metrics Telemetry Monitor',
        category: 'DEVOPS & SYSTEMS',
        status: 'PRODUCTION DEPLOYED',
        year: '2023',
        summary: 'A distributed infrastructure monitoring dashboard tracking microservice uptime, container memory footprints, API latency percentiles, and Redis cache throughput.',
        architecture: 'Containerized Node.js telemetry pipeline gathering Prometheus time-series metrics, integrated with Redis pub/sub caching and a responsive analytics frontend.',
        challenges: 'Filtering and aggregating high-volume telemetry events without placing excessive CPU overhead on observed client service instances.',
        keyFeatures: [
            'Real-time p95/p99 API response latency monitoring with threshold alerts',
            'Docker swarm container memory and CPU utilization telemetry',
            'Redis cache hit/miss ratio optimization tracking and anomaly detection',
            'Customizable metric thresholds with visual status HUD indicators'
        ],
        tags: ['Docker', 'Node.js', 'Redis', 'Prometheus', 'Linux CLI', 'REST APIs'],
        demoUrl: 'https://example.com/demo/cloud-monitor',
        githubUrl: 'https://github.com/example/cloud-telemetry',
        bannerIcon: '📊'
    },
    'algo-visualizer': {
        title: 'Algorithmic Graph & Pathfinding Visualizer',
        category: 'COMPUTER SCIENCE',
        status: 'OPEN SOURCE',
        year: '2022 - 2023',
        summary: 'An interactive computer science tool illustrating shortest-path graph algorithms (Dijkstra, A*, BFS, DFS) and sorting algorithms with custom maze generation.',
        architecture: 'High-performance HTML5 Canvas animation engine constructed in TypeScript with asynchronous frame-rate synchronization and decoupled state queues.',
        challenges: 'Rendering smooth 60fps pathfinding node expansions on large 50x50 grids without UI frame drops or garbage collection pauses.',
        keyFeatures: [
            'Visual step-by-step exploration of Dijkstra, A-Star, BFS, and DFS',
            'Interactive obstacle drawing, weighted nodes, and recursive maze generator',
            'Comparative algorithm telemetry: total nodes visited vs final path length',
            'Adjustable animation speed slider and step-by-step execution mode'
        ],
        tags: ['TypeScript', 'HTML5 Canvas', 'Algorithms', 'Data Structures', 'CSS3'],
        demoUrl: 'https://example.com/demo/algo-visualizer',
        githubUrl: 'https://github.com/example/algo-visualizer',
        bannerIcon: '🧭'
    }
};

/**
 * Initializes the Project Modal Dialog and binds click listeners to thumbnails
 */
function initProjectModal() {
    const modal = document.getElementById('project-detail-modal');
    const modalBody = document.getElementById('modal-content-area');
    const modalWindowTitle = document.getElementById('modal-window-title');
    const modalStatusBadge = document.getElementById('modal-status-badge');
    const modalGithubLink = document.getElementById('modal-github-link');
    const modalDemoLink = document.getElementById('modal-demo-link');
    const closeBtn = document.getElementById('modal-close-btn');
    const dismissBtn = document.getElementById('modal-dismiss-btn');

    if (!modal || !modalBody) return;

    // Select all interactive thumbnails and detail buttons with data-project-id
    const projectTriggers = document.querySelectorAll('.project-thumb-wrapper, .open-details-btn');

    projectTriggers.forEach(trigger => {
        const projectId = trigger.getAttribute('data-project-id');
        if (!projectId) return;

        // Open modal on click
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openProjectDetails(projectId);
        });

        // Open modal on Enter or Space for keyboard accessibility on thumbnails
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openProjectDetails(projectId);
            }
        });
    });

    /**
     * Populates and displays the Project Detail Modal
     */
    function openProjectDetails(projectId) {
        const data = projectsData[projectId];
        if (!data) return;

        // 1. Update Window Title & Status
        if (modalWindowTitle) {
            modalWindowTitle.textContent = `PROJECT_SPEC // ${projectId.toUpperCase()}.LOG`;
        }
        if (modalStatusBadge) {
            modalStatusBadge.textContent = `STATUS: ${data.status}`;
        }

        // 2. Update Action Links
        if (modalGithubLink) {
            modalGithubLink.href = data.githubUrl;
            modalGithubLink.setAttribute('aria-label', `View ${data.title} code repository`);
        }
        if (modalDemoLink) {
            modalDemoLink.href = data.demoUrl;
            modalDemoLink.setAttribute('aria-label', `Open live demo for ${data.title}`);
        }

        // 3. Populate Modal Body Content
        modalBody.innerHTML = `
            <div class="modal-project-meta-row">
                <span class="modal-project-category">${escapeHTML(data.category)}</span>
                <span class="modal-project-year">${escapeHTML(data.year)}</span>
            </div>

            <div class="modal-title-group">
                <h3 class="modal-project-title" id="modal-project-title">
                    <span style="font-size:1.8rem;margin-right:8px;" aria-hidden="true">${data.bannerIcon}</span>
                    ${escapeHTML(data.title)}
                </h3>
            </div>

            <div class="modal-project-summary">
                <p>${escapeHTML(data.summary)}</p>
            </div>

            <div class="modal-callout-box">
                <h4 class="modal-callout-title">
                    <span>⚙️</span> SYSTEM ARCHITECTURE &amp; DESIGN
                </h4>
                <p class="modal-callout-text">${escapeHTML(data.architecture)}</p>
            </div>

            <div>
                <h4 class="modal-section-title">▶ KEY TECHNICAL FEATURES</h4>
                <ul class="modal-features-list">
                    ${data.keyFeatures.map(feat => `
                        <li class="modal-feature-item">
                            <span class="modal-feature-bullet">◆</span>
                            <span>${escapeHTML(feat)}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>

            <div>
                <h4 class="modal-section-title">▶ CORE TECHNOLOGIES &amp; TOOLS</h4>
                <div class="project-tags">
                    ${data.tags.map(t => `<span class="tag">${escapeHTML(t)}</span>`).join('')}
                </div>
            </div>
        `;

        // 4. Reveal Modal
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Set focus to close button for accessibility
        if (closeBtn) closeBtn.focus();
    }

    /**
     * Closes the Project Detail Modal
     */
    function closeModal() {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Close button click
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (dismissBtn) dismissBtn.addEventListener('click', closeModal);

    // Click on backdrop outside the modal card to dismiss
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

/**
 * ==========================================================================
 * FOOTER INTERACTIONS & ACCESSIBILITY
 * Handles smooth return-to-top scrolling and focus transfer
 * ==========================================================================
 */
function initFooterInteractions() {
    const backToTopBtn = document.getElementById('back-to-top-btn');
    if (!backToTopBtn) return;

    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Smooth scroll to top of viewport
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Set focus to the hero section or title for keyboard screen-reader accessibility
        const heroSection = document.getElementById('hero');
        const heroTitle = document.getElementById('hero-title');
        const targetElement = heroTitle || heroSection;

        if (targetElement) {
            targetElement.setAttribute('tabindex', '-1');
            targetElement.focus({ preventScroll: true });
        }
    });
}

/**
 * ==========================================================================
 * CONTACT FORM CLIENT-SIDE VALIDATION & FEEDBACK
 * Provides simulated transmission confirmation without reloading page
 * ==========================================================================
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('contact-name');
        const emailInput = document.getElementById('contact-email-input');
        const messageInput = document.getElementById('contact-message');
        const submitBtn = document.getElementById('contact-submit-btn');

        if (!nameInput || !emailInput || !messageInput) return;

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        if (!name || !email || !message) {
            alert('Please fill out all required transmission fields.');
            return;
        }

        // Show transmission feedback on button
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '⚡ TRANSMITTING...';

        setTimeout(() => {
            submitBtn.innerHTML = '✔ TRANSMISSION RECEIVED!';
            submitBtn.style.background = 'var(--accent-green)';
            submitBtn.style.color = '#050b14';

            // Reset form fields
            contactForm.reset();

            // Revert button after 3.5 seconds
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.style.color = '';
            }, 3500);
        }, 900);
    });
}



