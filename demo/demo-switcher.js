(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.has('embed')) return;

  const storageKey = 'pdm-lang';
  const uiMessages = {
    en: {
      agent: 'Agent',
      project: 'Project',
      spec: 'Spec',
      compare: 'Compare',
      app: 'App',
    },
    ko: {
      agent: '에이전트',
      project: '프로젝트',
      spec: '스펙',
      compare: '비교',
      app: '앱',
    },
    ja: {
      agent: 'エージェント',
      project: 'プロジェクト',
      spec: '仕様',
      compare: '比較',
      app: 'アプリ',
    },
  };

  function readLang() {
    const stored = localStorage.getItem(storageKey);
    return stored && stored in uiMessages ? stored : 'en';
  }

  const ui = uiMessages[readLang()] ?? uiMessages.en;

  const agents = [
    { id: 'codex', label: 'Codex' },
    { id: 'claude', label: 'Claude' },
  ];
  const projects = [
    { id: 'kelvin', label: 'Kelvin' },
    { id: 'halftone', label: 'Halftone' },
  ];
  const specs = [
    { id: 'rich', label: 'Rich Prompt' },
    { id: 'google', label: 'Google DESIGN.md' },
  ];

  const parts = window.location.pathname.split('/').filter(Boolean);
  const agent = parts.at(-2);
  const file = parts.at(-1) ?? '';
  const match = file.match(/^(kelvin|halftone)-(rich|google)\.html$/);

  if (!agent || !match || !agents.some((item) => item.id === agent)) return;

  const current = {
    agent,
    project: match[1],
    spec: match[2],
  };

  function href(next) {
    return `../${next.agent}/${next.project}-${next.spec}.html`;
  }

  function linkGroup(label, items, key) {
    return `
      <div class="pdm-switcher-group" aria-label="${label}">
        ${items
          .map((item) => {
            const isActive = current[key] === item.id;
            const next = { ...current, [key]: item.id };
            return `<a class="${isActive ? 'is-active' : ''}" href="${href(next)}">${item.label}</a>`;
          })
          .join('')}
      </div>
    `;
  }

  const style = document.createElement('style');
  style.textContent = `
    /* App-chrome alignment: mirrors src/styles/base.css --app-* tokens. */
    .pdm-demo-switcher {
      position: fixed;
      left: 50%;
      bottom: 16px;
      z-index: 2147483000;
      width: min(calc(100% - 24px), 1040px);
      transform: translateX(-50%);
      display: grid;
      grid-template-columns: minmax(12rem, 1fr) auto auto;
      align-items: center;
      gap: 12px;
      padding: 8px 10px;
      border: 1px solid oklch(92% 0 0);
      border-radius: 0.875rem;
      background: color-mix(in oklch, oklch(99% 0 0) 88%, transparent);
      color: oklch(18% 0 0);
      box-shadow: 0 16px 32px -8px oklch(0% 0 0 / 0.12), 0 6px 12px -6px oklch(0% 0 0 / 0.08);
      font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }

    .pdm-demo-switcher a {
      color: inherit;
      text-decoration: none;
    }

    .pdm-switcher-brand {
      display: inline-flex;
      align-items: baseline;
      gap: 0.5rem;
      min-width: 0;
      padding-inline: 0.375rem;
      font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-weight: 600;
      font-size: 0.8125rem;
      letter-spacing: -0.01em;
      color: oklch(18% 0 0);
    }

    .pdm-switcher-brand strong {
      font-weight: 600;
      white-space: nowrap;
    }

    .pdm-switcher-brand span {
      overflow: hidden;
      color: oklch(62% 0 0);
      font-family: inherit;
      font-size: 0.7rem;
      font-weight: 500;
      letter-spacing: 0;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .pdm-switcher-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      justify-content: flex-end;
    }

    .pdm-switcher-group {
      display: inline-flex;
      gap: 0;
      padding: 2px;
      background: oklch(97% 0 0);
      border: 1px solid oklch(92% 0 0);
      border-radius: 0.625rem;
    }

    .pdm-switcher-group a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.25rem 0.5rem;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 0.6875rem;
      font-weight: 500;
      line-height: 1.2;
      letter-spacing: 0.02em;
      color: oklch(48% 0 0);
      border-radius: 0.4375rem;
      white-space: nowrap;
      transition: background 0.15s ease, color 0.15s ease;
    }

    .pdm-switcher-group a:hover {
      color: oklch(18% 0 0);
    }

    .pdm-switcher-group a.is-active {
      background: oklch(100% 0 0);
      color: oklch(18% 0 0);
      font-weight: 600;
      box-shadow: 0 1px 2px 0 oklch(0% 0 0 / 0.05);
    }

    .pdm-switcher-links {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      justify-content: flex-end;
    }

    .pdm-switcher-link {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.4375rem 0.75rem;
      font-family: 'Inter', system-ui, sans-serif;
      font-size: 0.8125rem;
      font-weight: 500;
      line-height: 1;
      color: oklch(48% 0 0);
      background: transparent;
      border: 1px solid transparent;
      border-radius: 0.625rem;
      white-space: nowrap;
      transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
    }

    .pdm-switcher-link:hover {
      background: oklch(100% 0 0);
      color: oklch(18% 0 0);
      border-color: oklch(92% 0 0);
    }

    body {
      padding-bottom: max(84px, env(safe-area-inset-bottom)) !important;
    }

    @media (max-width: 860px) {
      .pdm-demo-switcher {
        grid-template-columns: 1fr;
      }

      .pdm-switcher-controls,
      .pdm-switcher-links {
        justify-content: flex-start;
      }

      body {
        padding-bottom: 184px !important;
      }
    }
  `;

  const projectLabel = projects.find((item) => item.id === current.project)?.label;
  const specLabel = specs.find((item) => item.id === current.spec)?.label;
  const agentLabel = agents.find((item) => item.id === current.agent)?.label;

  const nav = document.createElement('nav');
  nav.className = 'pdm-demo-switcher';
  nav.setAttribute('aria-label', 'Demo switcher');
  nav.innerHTML = `
    <a class="pdm-switcher-brand" href="../">
      <strong>pre-design-md</strong>
      <span>${agentLabel} · ${projectLabel} · ${specLabel}</span>
    </a>
    <div class="pdm-switcher-controls">
      ${linkGroup(ui.agent, agents, 'agent')}
      ${linkGroup(ui.project, projects, 'project')}
      ${linkGroup(ui.spec, specs, 'spec')}
    </div>
    <div class="pdm-switcher-links">
      <a class="pdm-switcher-link" href="../compare.html?project=${current.project}&agent=${current.agent}">${ui.compare}</a>
      <a class="pdm-switcher-link" href="../../">${ui.app}</a>
    </div>
  `;

  document.head.append(style);
  document.body.append(nav);
})();
