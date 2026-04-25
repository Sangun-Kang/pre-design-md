import type { Messages } from './types';

export const ja: Messages = {
  'lang.en': 'English',
  'lang.ko': '한국어',
  'lang.ja': '日本語',

  'nav.start': 'スタート',
  'nav.typography': 'Typography',
  'nav.spacing': 'Spacing',
  'nav.radius': 'Radius',
  'nav.shadow': 'Shadow',
  'nav.color': 'Color',
  'nav.preview': 'プレビュー',
  'nav.export': '書き出し',

  'common.next': '次へ',
  'common.back': '戻る',
  'common.restart': '最初から',

  'start.heroA': '"いい感じ” を',
  'start.heroB': '決定に変える',
  'start.chainPrefix': '5 ステップ、決めるのは各 1 つ。',
  'start.chain.0': 'Typography',
  'start.chain.1': 'Spacing',
  'start.chain.2': 'Radius',
  'start.chain.3': 'Shadow',
  'start.chain.4': 'Color',
  'start.startBtn': 'はじめる',
  'start.quickExport': 'デフォルトで書き出す',

  'typography.eyebrow': 'STEP 1 · TYPOGRAPHY',
  'typography.title': 'まずは骨組みから。',
  'typography.description':
    'フォントペアリングを選ぶと土台が決まります。ベースサイズと比率は下のパネルで微調整できます。',
  'typography.pairingsHeading': 'フォントペアリング',
  'typography.dockToggleOpen': 'スケール設定を開く',
  'typography.dockToggleClose': 'スケール設定を閉じる',
  'typography.baseSize': 'ベースサイズ',
  'typography.ratio': 'スケール比',
  'typography.livePreview': '現在のスケール',
  'typography.sampleHeading': '"いい感じ” を、決定に変える',
  'typography.sampleBody':
    '文字がページに並ぶ姿で、画面の性格が決まります。同じ言葉でも、目に留まる重さが変わる。',
  'typography.sampleCaption': '— キャプション · メタデータ · 補足',
  'typography.pairingHeading': '"いい感じ” を、決定に変える',
  'typography.pairingBody':
    'いろはにほへと ちりぬるを。文字のかたちは、このシステムで下すすべての決定の空気を運びます。',

  'spacing.eyebrow': 'STEP 2 · SPACING',
  'spacing.title': '間隔のリズム。',
  'spacing.description':
    'ベースユニットとスケール方式を決めます。以降すべてのコンポーネントの padding と gap がこの基準に従います。',

  'radius.eyebrow': 'STEP 3 · RADIUS',
  'radius.title': '角がつくる性格。',
  'radius.description':
    'ベース角丸と適用方式を選びます。uniform は全体を同じ値に、scaled はカードを丸く、入力欄はシャープに — 役割ごとに変わります。',

  'shadow.eyebrow': 'STEP 4 · SHADOW',
  'shadow.title': '表面の奥行き。',
  'shadow.description':
    'シャドウの強さを選びます。primary の色をほんのり含ませた tinted シャドウも選べます。',
  'shadow.tintedTitle': 'Tinted シャドウ',
  'shadow.tintedHint':
    'primary の色がほんのりにじむシャドウです。Color ステップで決めた色が反映されます。',

  'color.eyebrow': 'STEP 5 · COLOR',
  'color.title': '雰囲気を決める色。',
  'color.description':
    'primary の色相と彩度、ニュートラルを決めるだけで、11 段階のパレット・セマンティック・インタラクション状態まで自動で派生します。',
  'color.primaryHue': 'Primary 色相',
  'color.chroma': '彩度',
  'color.neutralStyle': 'ニュートラル',
  'color.darkMode': 'ダークモード対応',
  'color.darkModeHint': ' — ダークモード用のカラーも DESIGN.md に含まれます。',

  'preview.eyebrow': 'STEP 6 · PREVIEW',
  'preview.title': 'すべての決定を、一画面に。',
  'preview.description':
    'ここまでの決定が実際の UI に反映された状態です。しっくりこなければ、上部のステッパーから該当ステップに戻って調整できます。',
  'preview.sectionSampler': 'コンポーネント',
  'preview.sectionLanding': 'ランディング',

  'export.eyebrow': 'STEP 7 · EXPORT',
  'export.title': 'DESIGN.md プロンプト',
  'export.description':
    '下のプロンプトをコピーして、Claude Code の /init 直後、または Cursor・Codex のプロジェクト開始時に貼り付けると DESIGN.md が生成されます。',
  'export.incompleteTitle': 'まだ決まっていないステップがあります',
  'export.incompleteBody':
    '未決定のステップ({missing})はプロンプトから省かれ、先頭に WARNING ブロックが追加されます。戻って仕上げれば、より充実した DESIGN.md になります。',
  'export.summaryTitle': '決定の要約',
  'export.promptTitle': 'DESIGN.md プロンプト',
  'export.copyBtn': 'クリップボードにコピー',
  'export.copied': 'コピーしました ✓',
  'export.usageTitle': '使い方',
  'export.usage.1':
    '**Claude Code**: 新規プロジェクトで `/init` を実行した直後に、このプロンプトを貼り付けます。`DESIGN.md` がリポジトリ直下に生成されます。',
  'export.usage.2':
    '**Cursor / Codex**: プロジェクト開始時にチャットへ貼り付け、「これに従って `DESIGN.md` を生成して」と依頼します。',
  'export.usage.3':
    '生成された `DESIGN.md` は、チームで共有するデザイン決定の source of truth になります。以降、AI が新しいコンポーネントを作るたびにこのファイルを参照します。',

  'decisions.undecided': '— 未定',

  'start.scrollHint': '下にスクロール ↓',
  'start.info.eyebrow': 'このサイトについて',
  'start.info.title': 'コードより先に、デザインの仕様。',
  'start.info.whyLabel': 'WHY',
  'start.info.whyTitle': 'UI のコードは AI が書く時代',
  'start.info.whyBody':
    '共通の仕様がないと、コンポーネントごとに角丸・余白・色がばらばらになり、全体としてちぐはぐに見えてしまいます。',
  'start.info.doLabel': 'やること',
  'start.info.doTitle': '5 ステップ、それぞれ 1 つの決定',
  'start.info.doBody':
    'Typography → Spacing → Radius → Shadow → Color。各ステップで決めることは最小限。残りのトークンは自動で派生します。',
  'start.info.getLabel': '得られるもの',
  'start.info.getTitle': '1 枚の DESIGN.md プロンプト',
  'start.info.getBody':
    'Claude Code・Cursor・Codex に貼り付けると、プロジェクト全体の source of truth になります。これからつくるコンポーネントも、同じ仕様に揃います。',
  'start.info.ctaTitle': '2 分あれば終わります。',
  'start.info.ctaBody': '登録も保存も不要 — ステップを 5 つ進めるだけ。',

  'sampler.block.nav': 'ナビゲーション',
  'sampler.block.buttons': 'ボタン',
  'sampler.block.inputs': '入力',
  'sampler.block.cards': 'カード',
  'sampler.block.badges': 'バッジ',
  'sampler.block.alerts': 'アラート',
  'sampler.action': '実行',
  'sampler.cancel': 'キャンセル',
  'sampler.moreInfo': '詳しく',
  'sampler.disabled': '無効',
  'sampler.emailPlaceholder': 'メールアドレス',
  'sampler.choosePlan': 'プランを選択',
  'sampler.planFree': 'フリー',
  'sampler.planPro': 'プロ',
  'sampler.planTeam': 'チーム',
  'sampler.tellMore': 'もう少し教えてください…',
  'sampler.agreeTerms': '利用規約に同意します',
  'sampler.card.title': 'カードタイトル',
  'sampler.card.body': 'カードの本文です。画像は現在の primary hue に合うものが自動で選ばれます。',
  'sampler.card.textOnly': 'テキストのみのカード',
  'sampler.card.textOnlyBody':
    '画像なしで、タイトル・本文・アクションで構成されたカード。padding と radius は Spacing・Radius のトークンに従います。',
  'sampler.card.stat': '指標カード',
  'sampler.card.statLabel': '前週比の伸び',
  'sampler.alert.new.title': '新しいバージョンがあります',
  'sampler.alert.new.body': 'バージョン 2.3 が用意できました。再起動して反映してください。',
  'sampler.alert.upload.title': 'アップロード完了',
  'sampler.alert.upload.body': 'ファイルは正常に処理されました。',
  'sampler.alert.storage.title': 'ストレージがほぼいっぱいです',
  'sampler.alert.storage.body': '現在のプランの 92% を使用しています。',
  'sampler.alert.connection.title': '接続に失敗しました',
  'sampler.alert.connection.body': 'サービスに接続できません。ネットワークをご確認ください。',

  'landing.nav.product': 'プロダクト',
  'landing.nav.docs': 'ドキュメント',
  'landing.nav.changelog': '更新履歴',
  'landing.nav.pricing': '料金',
  'landing.nav.signin': 'ログイン',
  'landing.nav.cta': 'はじめる',
  'landing.hero.badge': 'v2.0 · 明日ローンチ',
  'landing.hero.lede':
    'Pinecone は、チームのビジュアル言語を、AI ツールが実際に従える 1 枚のマークダウンに変換します。以降のコンポーネントも同じ調子で揃います。',
  'landing.hero.ctaPrimary': '無料ではじめる',
  'landing.hero.ctaSecondary': 'デモを見る ↗',
  'landing.hero.trustedBy': 'このデザインチームが採用しています',
  'landing.stats.steps': 'ステップ',
  'landing.stats.palette': 'パレットの段階',
  'landing.stats.time': 'DESIGN.md まで',
  'landing.features.eyebrow': '仕組み',
  'landing.features.title': '3 つの原則、1 つの成果物。',
  'landing.feature.1.title': '決定の数を減らす',
  'landing.feature.1.body':
    '構造的な決定だけが重要 — ほんの数個のベース値から残りのトークンは派生します。組み合わせ爆発なし。',
  'landing.feature.2.title': '意図を保持',
  'landing.feature.2.body':
    'CSS の値だけでなく「なぜその選択なのか」まで残るので、AI は未掲載の文脈でも判断できます。',
  'landing.feature.3.title': 'エージェント対応',
  'landing.feature.3.body':
    '成果物は 1 枚のマークダウン。Claude Code・Cursor・Codex が source of truth として解釈します。',
  'landing.cta.title': '一貫したシステムを出荷する準備は?',
  'landing.cta.lede': '5 つの質問、1 枚のマークダウン、追加の会議はゼロ。',
  'landing.cta.primary': '無料ではじめる',
  'landing.cta.secondary': '問い合わせる',
  'landing.footer.tag': 'AI ツール時代向けにエンコードされたデザインの意図。',
  'landing.footer.product': 'プロダクト',
  'landing.footer.company': '会社',
  'landing.footer.legal': '規約',
  'landing.footer.copy': '© 2026 Sangun Kang · sangun950@gmail.com',

  'export.tab.googleSpec.label': 'Google DESIGN.md',
  'export.tab.googleSpec.hint': '公式仕様。lint にも通る、いちばん無難な選択。',
  'export.tab.richPrompt.label': 'Rich Prompt',
  'export.tab.richPrompt.hint': 'OKLCH そのまま、根拠も全部。AI エージェントに渡す文脈が最も豊富。',
  'export.tab.cssVars.label': 'CSS Variables',
  'export.tab.cssVars.hint': 'スタイルシートに貼るだけ。マークダウンもプロンプトも無し。',
};