(() => {
  const STORAGE_KEY = 'pdm-lang';
  const LANGS = ['en', 'ko', 'ja'];

  const messages = {
    en: {
      language: 'Language',
      indexTitle: 'pre-design-md demos',
      indexDescription: 'Compare Codex and Claude demo pages generated from pre-design-md exports.',
      demos: 'demos',
      backToApp: 'Back to app ↗',
      heroEyebrow: 'Codex vs Claude',
      heroTitle: 'Same specs, different hands.',
      heroLead:
        'Each pair below renders the same exported design specs through two AI agents. Pick a project and a spec format to compare side by side.',
      comparePairs: 'Compare pairs',
      kelvinBody: 'Warehouse-native BI landing page.',
      halftoneBody: 'Editorial brand and art direction studio.',
      saas: 'SaaS',
      studio: 'Studio',
      richComparison: 'Rich Prompt',
      googleComparison: 'Google DESIGN.md',
      compareTitle: 'pre-design-md demo comparison',
      compareDescription: 'Side-by-side comparison of Codex and Claude demo pages.',
      project: 'Project',
      spec: 'Spec',
      openCodex: 'Open Codex',
      openClaude: 'Open Claude',
      app: 'App ↗',
      codexDemo: 'Codex demo',
      claudeDemo: 'Claude demo',
      openFullPage: 'Open full page ↗',
      projects: {
        kelvin: 'Kelvin',
        halftone: 'Halftone',
      },
      specs: {
        rich: 'Rich Prompt',
        google: 'Google DESIGN.md',
      },
    },
    ko: {
      language: '언어',
      indexTitle: 'pre-design-md 데모',
      indexDescription: 'pre-design-md export로 만든 Codex와 Claude 데모 페이지를 비교합니다.',
      demos: '데모',
      backToApp: '앱으로 돌아가기 ↗',
      heroEyebrow: 'Codex vs Claude',
      heroTitle: '같은 스펙, 다른 결과.',
      heroLead:
        '아래 각 쌍은 같은 디자인 스펙을 두 AI 에이전트로 렌더한 결과입니다. 프로젝트와 스펙 형식을 골라 나란히 비교하세요.',
      comparePairs: 'Compare pairs',
      kelvinBody: '웨어하우스 네이티브 BI 랜딩 페이지.',
      halftoneBody: '에디토리얼 브랜드·아트 디렉션 스튜디오.',
      saas: 'SaaS',
      studio: '스튜디오',
      richComparison: 'Rich Prompt 비교',
      googleComparison: 'Google DESIGN.md 비교',
      compareTitle: 'pre-design-md 데모 비교',
      compareDescription: 'Codex와 Claude 데모 페이지를 나란히 비교합니다.',
      project: '프로젝트',
      spec: '스펙',
      openCodex: 'Codex 열기',
      openClaude: 'Claude 열기',
      app: '앱 ↗',
      codexDemo: 'Codex 데모',
      claudeDemo: 'Claude 데모',
      openFullPage: '전체 페이지 열기 ↗',
      projects: {
        kelvin: 'Kelvin',
        halftone: 'Halftone',
      },
      specs: {
        rich: 'Rich Prompt',
        google: 'Google DESIGN.md',
      },
    },
    ja: {
      language: '言語',
      indexTitle: 'pre-design-md デモ',
      indexDescription: 'pre-design-md の export から生成した Codex と Claude のデモページを比較します。',
      demos: 'デモ',
      backToApp: 'アプリへ戻る ↗',
      heroEyebrow: 'Codex vs Claude',
      heroTitle: '同じ仕様、異なる結果。',
      heroLead:
        '下の各ペアは、同じデザイン仕様を 2 つの AI エージェントでレンダリングした結果です。プロジェクトと仕様形式を選んで並べて比較できます。',
      comparePairs: 'Compare pairs',
      kelvinBody: 'ウェアハウスネイティブ BI のランディングページ。',
      halftoneBody: 'エディトリアルなブランド／アートディレクションスタジオ。',
      saas: 'SaaS',
      studio: 'スタジオ',
      richComparison: 'Rich Prompt を比較',
      googleComparison: 'Google DESIGN.md を比較',
      compareTitle: 'pre-design-md デモ比較',
      compareDescription: 'Codex と Claude のデモページを並べて比較します。',
      project: 'プロジェクト',
      spec: '仕様',
      openCodex: 'Codex を開く',
      openClaude: 'Claude を開く',
      app: 'アプリ ↗',
      codexDemo: 'Codex デモ',
      claudeDemo: 'Claude デモ',
      openFullPage: '全ページを開く ↗',
      projects: {
        kelvin: 'Kelvin',
        halftone: 'Halftone',
      },
      specs: {
        rich: 'Rich Prompt',
        google: 'Google DESIGN.md',
      },
    },
  };

  function detectLang() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (LANGS.includes(stored)) return stored;

    const browserLangs = navigator.languages ?? [navigator.language];
    for (const item of browserLangs) {
      const code = item.toLowerCase().split('-')[0];
      if (LANGS.includes(code)) return code;
    }
    return 'en';
  }

  let currentLang = detectLang();

  function t() {
    return messages[currentLang] ?? messages.en;
  }

  function setText(selector, value) {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  }

  function setAttr(selector, attr, value) {
    const el = document.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  }

  function setMetaDescription(value) {
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', value);
  }

  function readCompareState() {
    const project = document.querySelector('[data-toggle="project"] .toggle-btn.is-active')?.dataset.value ?? 'kelvin';
    const spec = document.querySelector('[data-toggle="spec"] .toggle-btn.is-active')?.dataset.value ?? 'rich';
    return { project, spec };
  }

  function updateCompareSummary() {
    const summary = document.querySelector('#summary');
    if (!summary) return;
    const state = readCompareState();
    summary.textContent = `${t().projects[state.project]} · ${t().specs[state.spec]}`;
  }

  function ensureSwitcher() {
    if (document.querySelector('.pdm-lang-switcher')) return;

    const header = document.querySelector('.topbar, .bar');
    if (!header) return;

    const style = document.createElement('style');
    style.textContent = `
      .pdm-lang-switcher {
        display: flex;
        gap: 0;
        padding: 2px;
        background: var(--surface-sunken);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
      }

      .pdm-lang-btn {
        position: relative;
        padding: 0.25rem 0.5rem;
        background: transparent;
        color: var(--text-muted);
        font-family: var(--font-mono);
        font-size: 0.6875rem;
        font-weight: 600;
        letter-spacing: 0.04em;
        border-radius: calc(var(--radius-md) - 2px);
        cursor: pointer;
        transition: background 0.15s ease, color 0.15s ease;
      }

      .pdm-lang-btn:hover {
        color: var(--text);
      }

      .pdm-lang-btn.is-active {
        background: var(--surface);
        color: var(--text);
        box-shadow: var(--shadow-sm);
      }

      .pdm-lang-btn:focus-within {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
      }

      .pdm-lang-btn input {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        margin: 0;
        opacity: 0;
        cursor: pointer;
      }

      @media (max-width: 900px) {
        .bar .pdm-lang-switcher {
          flex: 0 0 auto;
        }

        .bar .pdm-lang-btn {
          padding: 0.25rem 0.45rem;
        }
      }

      @media (max-width: 560px) {
        .bar .pdm-lang-btn {
          padding-inline: 0.4rem;
        }
      }
    `;
    document.head.append(style);

    const switcher = document.createElement('form');
    switcher.className = 'pdm-lang-switcher';
    switcher.setAttribute('role', 'radiogroup');
    switcher.innerHTML = LANGS.map(
      (lang) => `
        <label class="pdm-lang-btn" data-lang="${lang}">
          <input type="radio" name="pdm-demo-lang" value="${lang}">
          <span>${lang.toUpperCase()}</span>
        </label>
      `,
    ).join('');

    switcher.addEventListener('change', (event) => {
      const input = event.target.closest('input[name="pdm-demo-lang"]');
      if (!input) return;
      currentLang = input.value;
      localStorage.setItem(STORAGE_KEY, currentLang);
      applyI18n();
    });

    const before = header.querySelector('.topbar-link, .links');
    header.insertBefore(switcher, before);
  }

  function syncSwitcher() {
    const switcher = document.querySelector('.pdm-lang-switcher');
    if (!switcher) return;

    switcher.setAttribute('aria-label', t().language);
    switcher.querySelectorAll('.pdm-lang-btn').forEach((label) => {
      const active = label.dataset.lang === currentLang;
      label.classList.toggle('is-active', active);
      const input = label.querySelector('input');
      if (input) input.checked = active;
    });
  }

  function applyIndex() {
    document.title = t().indexTitle;
    setMetaDescription(t().indexDescription);
    setText('.brand-summary', t().demos);
    setText('.topbar-link', t().backToApp);
    setText('.hero .eyebrow', t().heroEyebrow);
    setText('.hero h1', t().heroTitle);
    setText('.hero .lead', t().heroLead);
    setText('#pairs-title', t().comparePairs);
    setText('.card:nth-of-type(1) p', t().kelvinBody);
    setText('.card:nth-of-type(1) .tag', t().saas);
    setText('.card:nth-of-type(1) .button.primary', t().richComparison);
    setText('.card:nth-of-type(1) .button:not(.primary)', t().googleComparison);
    setText('.card:nth-of-type(2) p', t().halftoneBody);
    setText('.card:nth-of-type(2) .tag', t().studio);
    setText('.card:nth-of-type(2) .button.primary', t().richComparison);
    setText('.card:nth-of-type(2) .button:not(.primary)', t().googleComparison);
  }

  function applyCompare() {
    document.title = t().compareTitle;
    setMetaDescription(t().compareDescription);
    setText('.brand-summary', t().demos);
    setText('[data-toggle="project"] .toggle-btn[data-value="kelvin"]', t().projects.kelvin);
    setText('[data-toggle="project"] .toggle-btn[data-value="halftone"]', t().projects.halftone);
    setText('[data-toggle="spec"] .toggle-btn[data-value="rich"]', 'Rich Prompt');
    setText('[data-toggle="spec"] .toggle-btn[data-value="google"]', t().specs.google);
    setText('.toggle:nth-of-type(1) .toggle-label', t().project);
    setText('.toggle:nth-of-type(2) .toggle-label', t().spec);
    setAttr('.toggle:nth-of-type(1)', 'aria-label', t().project);
    setAttr('.toggle:nth-of-type(2)', 'aria-label', t().spec);
    setText('#codex-link', t().openCodex);
    setText('#claude-link', t().openClaude);
    setText('.link--app', t().app);
    setText('#codex-open', t().openFullPage);
    setText('#claude-open', t().openFullPage);
    setAttr('.panel:nth-of-type(1)', 'aria-label', t().codexDemo);
    setAttr('.panel:nth-of-type(2)', 'aria-label', t().claudeDemo);
    setAttr('#codex-frame', 'title', t().codexDemo);
    setAttr('#claude-frame', 'title', t().claudeDemo);
    updateCompareSummary();
  }

  function applyI18n() {
    document.documentElement.lang = currentLang;
    ensureSwitcher();
    syncSwitcher();

    if (document.querySelector('.topbar')) {
      applyIndex();
    } else if (document.querySelector('.bar')) {
      applyCompare();
    }
  }

  document.addEventListener('click', (event) => {
    if (event.target.closest('.toggle-btn')) {
      window.setTimeout(applyI18n, 0);
    }
  });

  applyI18n();
})();
