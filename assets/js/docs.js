// ============================================================
// Documentation JS — Openflows Developer Docs
// Interactive components: accordion, copy, search, terminal, tabs
// ============================================================

// --- Accordion Toggle ---
document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
        const item = header.parentElement;
        const wasOpen = item.classList.contains('open');

        // Allow multiple open or close current
        item.classList.toggle('open');

        // Update body max-height for animation
        const body = item.querySelector('.accordion-body');
        if (!wasOpen) {
            body.style.maxHeight = body.scrollHeight + 'px';
        } else {
            body.style.maxHeight = '0';
        }
    });
});

// --- Code Copy to Clipboard ---
document.querySelectorAll('.code-copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        const codeBlock = btn.closest('.code-block');
        const pre = codeBlock.querySelector('pre');
        const text = pre.textContent;

        try {
            await navigator.clipboard.writeText(text);
            btn.textContent = 'Copied!';
            btn.classList.add('copied');
            setTimeout(() => {
                btn.textContent = 'Copy';
                btn.classList.remove('copied');
            }, 2000);
        } catch (err) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            btn.textContent = 'Copied!';
            btn.classList.add('copied');
            setTimeout(() => {
                btn.textContent = 'Copy';
                btn.classList.remove('copied');
            }, 2000);
        }
    });
});

// --- Client-side Search Filter ---
const searchInput = document.querySelector('.docs-search-input');
const searchResults = document.querySelector('.docs-search-results');

if (searchInput && searchResults) {
    const pages = [
        { title: 'Getting Started', desc: 'Quick start guide for Openflows', url: '/docs/getting-started/' },
        { title: 'Installation', desc: 'Install Openflows on Linux, macOS, or Windows', url: '/docs/getting-started/installation.html' },
        { title: 'Agent Setup', desc: 'Configure NEXUS, FORGE, SENTINEL, and LORE agents', url: '/docs/guides/agent-setup.html' },
        { title: 'Workflow Integration', desc: 'Integrate Openflows with your existing workflows', url: '/docs/guides/workflow-integration.html' },
        { title: 'API Endpoints', desc: 'REST API reference for Openflows', url: '/docs/api/endpoints.html' },
        { title: 'Authentication', desc: 'API authentication and token management', url: '/docs/api/authentication.html' },
        { title: 'System Design', desc: 'Openflows architecture and system design', url: '/docs/architecture/system-design.html' },
        { title: 'Agent Roles', desc: 'Understanding NEXUS, FORGE, SENTINEL, LORE, and VESSEL roles', url: '/docs/architecture/agent-roles.html' },
        { title: 'FAQ', desc: 'Frequently asked questions about Openflows', url: '/docs/faq.html' },
        { title: 'Terminal Demo', desc: 'Interactive terminal simulation', url: '/demos/terminal.html' },
        { title: 'Walkthrough', desc: 'Step-by-step workflow walkthrough', url: '/demos/walkthrough.html' },
        { title: 'Web Development', desc: 'Use case: automating web development', url: '/use-cases/web-development.html' },
        { title: 'DevOps Automation', desc: 'Use case: automating DevOps workflows', url: '/use-cases/devops.html' },
        { title: 'API Explorer', desc: 'Interactive API endpoint tester', url: '/developers/api-explorer.html' },
        { title: 'Integrations', desc: 'Integration guides for GitHub, Slack, and more', url: '/developers/integrations.html' },
    ];

    let activeIndex = -1;

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) {
            searchResults.classList.remove('visible');
            searchResults.innerHTML = '';
            activeIndex = -1;
            return;
        }

        const matches = pages.filter(p =>
            p.title.toLowerCase().includes(query) ||
            p.desc.toLowerCase().includes(query)
        );

        if (matches.length === 0) {
            searchResults.innerHTML = '<div class="docs-search-result-item"><span style="color:var(--text-muted)">No results found</span></div>';
            searchResults.classList.add('visible');
            activeIndex = -1;
            return;
        }

        searchResults.innerHTML = matches.map((m, i) =>
            `<a href="${m.url}" class="docs-search-result-item${i === activeIndex ? ' active' : ''}" data-index="${i}">
                <div class="docs-search-result-title">${m.title}</div>
                <div class="docs-search-result-desc">${m.desc}</div>
            </a>`
        ).join('');
        searchResults.classList.add('visible');
        activeIndex = -1;
    });

    // Keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
        const items = searchResults.querySelectorAll('.docs-search-result-item');
        if (!items.length) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeIndex = Math.min(activeIndex + 1, items.length - 1);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeIndex = Math.max(activeIndex - 1, 0);
        } else if (e.key === 'Enter' && activeIndex >= 0) {
            e.preventDefault();
            items[activeIndex].click();
            return;
        } else if (e.key === 'Escape') {
            searchResults.classList.remove('visible');
            searchInput.blur();
            return;
        } else {
            return;
        }

        items.forEach(it => it.classList.remove('active'));
        items[activeIndex].classList.add('active');
    });

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('visible');
        }
    });
}

// --- Tab Switcher ---
document.querySelectorAll('.tab-switcher').forEach(switcher => {
    const tabs = switcher.querySelectorAll('.tab-tab');
    const panels = switcher.querySelectorAll('.tab-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.getAttribute('data-tab');

            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const targetPanel = switcher.querySelector(`[data-panel="${targetId}"]`);
            if (targetPanel) targetPanel.classList.add('active');
        });
    });
});

// --- Terminal Simulation Engine ---
class TerminalSimulation {
    constructor(container) {
        this.container = container;
        this.body = container.querySelector('.terminal-body');
        this.replayBtn = container.querySelector('.terminal-replay');
        this.lines = [];
        this.currentLine = 0;
        this.currentChar = 0;
        this.isRunning = false;

        // Parse lines from data attributes or markup
        this.parseLines();

        if (this.replayBtn) {
            this.replayBtn.addEventListener('click', () => this.start());
        }

        // Auto-start on page load
        this.start();
    }

    parseLines() {
        const rawLines = this.body.querySelectorAll('.terminal-line');
        rawLines.forEach(line => {
            const type = line.getAttribute('data-type') || 'command';
            const prompt = line.getAttribute('data-prompt') || '';
            const delay = parseInt(line.getAttribute('data-delay') || '0', 10);
            this.lines.push({
                element: line,
                type,
                prompt,
                delay,
                fullText: line.textContent,
            });
            line.textContent = '';
        });
    }

    start() {
        this.isRunning = false;
        this.currentLine = 0;
        this.currentChar = 0;
        this.lines.forEach(l => l.element.textContent = '');
        this.isRunning = true;
        this.typeNextLine();
    }

    typeNextLine() {
        if (!this.isRunning || this.currentLine >= this.lines.length) {
            this.isRunning = false;
            return;
        }

        const line = this.lines[this.currentLine];
        const delay = line.delay || (line.type === 'output' ? 100 : 300);

        setTimeout(() => {
            this.typeLine(line, () => {
                this.currentLine++;
                this.currentChar = 0;
                this.typeNextLine();
            });
        }, line.type === 'command' ? 200 : 50);
    }

    typeLine(line, onComplete) {
        const text = line.fullText;
        if (!text || this.currentChar >= text.length) {
            if (onComplete) onComplete();
            return;
        }

        line.element.textContent = text.substring(0, this.currentChar + 1);
        this.currentChar++;

        const speed = line.type === 'command' ? 35 : 5;
        setTimeout(() => this.typeLine(line, onComplete), speed);
    }
}

// Initialize all terminal simulations
document.querySelectorAll('.terminal').forEach(term => {
    new TerminalSimulation(term);
});

// --- API Explorer Mock ---
const apiExplorerForm = document.querySelector('.api-explorer-form');
if (apiExplorerForm) {
    const sendBtn = apiExplorerForm.querySelector('.api-explorer-send');
    const responseArea = document.querySelector('.api-explorer-response');
    const methodSelect = apiExplorerForm.querySelector('.api-explorer-method');
    const endpointInput = apiExplorerForm.querySelector('.api-explorer-endpoint');
    const bodyInput = apiExplorerForm.querySelector('.api-explorer-body');

    if (sendBtn && responseArea) {
        // Method selector toggle
        if (methodSelect) {
            // Style the select based on selected method
            const updateMethodColor = () => {
                const method = methodSelect.value;
                methodSelect.style.color =
                    method === 'GET' ? 'var(--accent-teal)' :
                    method === 'POST' ? 'var(--nexus)' :
                    method === 'PUT' ? 'var(--accent-gold)' :
                    'var(--vessel)';
            };
            methodSelect.addEventListener('change', updateMethodColor);
            updateMethodColor();
        }

        sendBtn.addEventListener('click', () => {
            const method = methodSelect ? methodSelect.value : 'GET';
            const endpoint = endpointInput ? endpointInput.value : '/api/v1/agents';
            const body = bodyInput ? bodyInput.value : '';

            const mockResponses = {
                'GET': {
                    status: 200,
                    body: JSON.stringify({
                        agents: [
                            { id: 'nexus', role: 'coordinator', status: 'active', tasks_completed: 142 },
                            { id: 'forge-1', role: 'builder', status: 'working', current_task: 'T-004: Documentation Hub' },
                            { id: 'sentinel', role: 'reviewer', status: 'idle', reviews_completed: 89 },
                            { id: 'lore', role: 'historian', status: 'active', knowledge_base: '2,847 entries' }
                        ],
                        total: 4,
                        active: 3
                    }, null, 2)
                },
                'POST': {
                    status: 201,
                    body: JSON.stringify({
                        message: 'Agent task created successfully',
                        task: {
                            id: 'T-NEW',
                            title: 'New Task',
                            status: 'pending',
                            assigned_to: 'forge',
                            created_at: new Date().toISOString()
                        }
                    }, null, 2)
                },
                'PUT': {
                    status: 200,
                    body: JSON.stringify({
                        message: 'Agent configuration updated',
                        updated_fields: ['model', 'reasoning_effort'],
                        timestamp: new Date().toISOString()
                    }, null, 2)
                },
                'DELETE': {
                    status: 200,
                    body: JSON.stringify({
                        message: 'Task cancelled successfully',
                        task_id: 'T-CANCEL',
                        cancelled_at: new Date().toISOString()
                    }, null, 2)
                }
            };

            const response = mockResponses[method] || mockResponses['GET'];

            // Show loading state
            sendBtn.textContent = 'Sending...';
            sendBtn.disabled = true;

            setTimeout(() => {
                const statusEl = document.querySelector('.api-explorer-response-status');
                if (statusEl) {
                    statusEl.textContent = `${response.status} OK`;
                    statusEl.className = 'api-explorer-response-status success';
                }

                responseArea.textContent = response.body;
                sendBtn.innerHTML = 'Send &#10148;';
                sendBtn.disabled = false;
            }, 600);
        });
    }
}
