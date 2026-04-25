# pre-design-md — 설계 명세서

> DESIGN.md를 만들기 위한 재료를 시각적으로 결정하는 웹 애플리케이션.

---

## 1. 개요

### 1.1 이 앱의 포지션
pre-design-md는 **디자인 산출물이 아니라 AI 입력(DESIGN.md 프롬프트)을 만드는 도구**다.

사용자는 5개 단계로 구조적 결정을 시각적으로 내린다. 앱은 그 결정을 AI 에이전트가 정확히 같은 방식으로 재현할 수 있는 프롬프트로 변환한다. 이 프롬프트를 Claude Code, Cursor, Codex 등에 붙여넣으면 프로젝트의 DESIGN.md가 일관된 의도를 담고 생성된다.

"또 다른 theme builder"가 아니다. 산출물이 코드가 아니라 **AI가 해석할 의도 + 값의 결합**이라는 점이 결정적 차이다.

### 1.2 비목표 (v1)
- 완전한 디자인 시스템 빌더 아님 — Figma Tokens나 Style Dictionary 대체가 아니다
- 반응형/브레이크포인트 조정 없음
- 커스텀 폰트 업로드 없음 (웹 세이프 + Google Fonts 프리셋만)
- 컴포넌트 라이브러리 생성 없음
- 다크모드는 선택사항 (v1에서는 라이트 모드 중심, 다크 지원 여부만 표기)

---

## 2. 핵심 설계 원칙

### 원칙 1 — 구조적 결정 소수화
사용자가 내리는 결정은 5단계, 각 단계에서 1~2개의 base 결정만 받는다. 나머지는 전부 자동 파생. 타이포 base size + ratio가 결정되면 type scale 전체가 자동 생성되는 식이다.

카테고리별로 수십 개 값을 개별 선택하게 하면 조합 폭발과 정합성 붕괴가 일어난다. 실제 디자인 시스템이 일관돼 보이는 이유는 "base 몇 개가 나머지를 지배"하기 때문이고, 그 구조를 그대로 UX로 가져온다.

### 원칙 2 — 프리뷰가 UX의 핵심
토큰을 추상적으로 "이거 vs 저거" 비교하게 하지 않는다. 모든 선택지는 실제 컴포넌트나 섹션에 적용된 상태로 렌더된다. "이 ratio랑 저 ratio 중에 뭐가 낫지?"는 의미 없고, "이 ratio로 그린 카드랑 저 ratio로 그린 카드 중에 뭐가 낫지?"가 의미 있다.

### 원칙 3 — 결정의 의도 보존
최종 프롬프트는 값(CSS variables)만이 아니라 **왜 이 선택인지의 자연어 의도**를 포함한다. AI 에이전트가 DESIGN.md를 읽고 실제 코드를 쓸 때, "왜 이 값인지"의 의도까지 알면 정해지지 않은 영역(새 컴포넌트, 특수 상황)에서도 일관된 판단을 할 수 있다.

---

## 3. 유저 플로우

```
Start
  │
  ▼
Step 1 — Typography     (뼈대)
  ▼
Step 2 — Spacing        (뼈대)
  ▼
Step 3 — Radius         (형태감)
  ▼
Step 4 — Shadow         (표면감)
  ▼
Step 5 — Color          (분위기)
  ▼
Preview                 (모든 토큰 적용된 완성 UI)
  ▼
Export                  (DESIGN.md 프롬프트)
```

### 플로우 규칙
- 기본은 선형(게임 캐릭터 메이커 스타일)
- 뒤 단계로 가도 이전 단계의 결정은 유지
- 이전 단계로 돌아가 값을 바꾸면 이후 단계의 프리뷰는 실시간 갱신 (단, 이후 단계에서 한 선택은 유지)
- Preview에서 만족 안 하면 특정 단계로 점프 가능
- 어느 단계에서든 Export는 가능 (현재까지 결정된 값만으로 프롬프트 생성, 단 불완전 경고)

---

## 4. 단계별 설계

각 단계는 동일한 구조를 따른다:
- **사용자 결정**: base 값 1~2개
- **자동 파생**: base로부터 생성되는 토큰 집합
- **UI 패턴**: 어떤 방식으로 시각화할지
- **Interaction 자동 파생**: color 단계 이후 hover/focus/active 등이 암묵적으로 생성됨

### 4.1 Step 1 — Typography

**사용자 결정**
- Base font size: `14 / 16 / 18 / 20px` 중 선택
- Scale ratio: `1.125 (minor second) / 1.2 (minor third) / 1.25 (major third) / 1.333 (perfect fourth) / 1.5 (perfect fifth)` 중 선택
- Font pairing 프리셋 3~5개 (예: "모던 sans", "에디토리얼 serif+sans", "테크니컬 mono+sans")

**자동 파생**
- Type scale: `xs(-2), sm(-1), base(0), md(1), lg(2), xl(3), 2xl(4), 3xl(5), 4xl(6)` → `base × ratio^n`
- Line height: 헤딩은 1.2~1.3, 본문은 1.5~1.7 (scale ratio가 클수록 본문 line-height 약간 축소)
- Font weight: 400 / 500 / 600 / 700 (pairing 프리셋에 따라 사용 폭 달라짐)

**UI 패턴**
- 가로로 나열된 프리뷰 카드. 각 카드가 하나의 (base + ratio + pairing) 조합
- 카드 안에 실제 h1~h4 + 본문 + 캡션이 전부 렌더됨 (스케일 전체가 보이도록)
- "Quick brown fox..." 류 샘플 텍스트로 읽히는 느낌을 체감
- 선택 후 다음 단계 이동 버튼 노출

### 4.2 Step 2 — Spacing

**사용자 결정**
- Base unit: `4 / 8 px` 중 선택
- Scale approach: `linear (4,8,12,16,20,24,32,40,48,64) / multiplicative (4,8,16,32,64 — 티셔츠 사이즈)` 중 선택

**자동 파생**
- Spacing tokens: `2xs, xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl`
- 컴포넌트별 권장 padding/gap (버튼 padding은 sm/md, 카드 padding은 lg)

**UI 패턴**
- 동일한 컴포넌트 세트(카드 + 버튼 + 리스트)가 각 spacing 프리셋으로 나란히 렌더
- 좁은 느낌 / 넉넉한 느낌의 체감이 바로 비교됨

### 4.3 Step 3 — Radius

**사용자 결정**
- Base radius: `0 (sharp) / 4 (subtle) / 8 (soft) / 12 (rounded) / 16+ (pill-like)` 중 선택
- Scale approach: `uniform (모든 컴포넌트가 동일 radius) / scaled (카드는 더 둥글게, 인풋은 덜 둥글게)`

**자동 파생**
- Radius tokens: `none, sm, md, lg, xl, full`
- 컴포넌트별 권장 값 (input=md, card=lg, badge=full 등)

**UI 패턴**
- 버튼 + 인풋 + 카드 한 세트가 각 radius 프리셋마다 렌더
- Shape이 성격을 얼마나 바꾸는지 체감

### 4.4 Step 4 — Shadow / Elevation

**사용자 결정**
- Intensity: `none / subtle / medium / strong`
- Tinted 여부: pure black shadow vs. primary 색으로 살짝 물든 shadow (primary 단계에서 결정되므로 지금은 "tinted 선호?"만 토글, 색은 Step 5 이후 반영)

**자동 파생**
- Shadow tokens: `sm, md, lg, xl` — 각 레벨은 offset + blur + opacity 조합
- Elevation 위계: dropdown < card < modal < toast

**UI 패턴**
- 동일한 카드가 각 intensity 프리셋으로 렌더
- "flat / soft / material / dramatic" 계열 체감

### 4.5 Step 5 — Color

**사용자 결정**
- Primary hue: wheel로 선택하거나 프리셋 6~8개 (파랑/청록/보라/자주/빨강/주황/노랑/초록 계열)
- Primary chroma: `muted / balanced / vivid`
- Neutral style: `pure gray / warm gray / cool gray / primary-tinted gray`
- Dark mode support: boolean

**자동 파생 (OKLCH, culori 사용)**
- Primary scale: 50 ~ 950 (11단계)
- Neutral scale: 50 ~ 950 (선택한 스타일에 따라 hue 미세 조정)
- Semantic colors: success / warning / danger / info — 각 색의 chroma를 primary의 chroma 수준에 맞춰 조정 (primary가 muted인데 semantic만 vivid면 어색함)
- **Interaction states (자동 파생, 사용자 결정 없음)**
  - hover: lightness −5%
  - active: lightness −10%
  - focus ring: `outline 2px solid var(--color-primary-500); outline-offset: 2px`
  - disabled: opacity 40%
- Tinted shadow: Step 4에서 tinted 선호면 여기서 primary hue 기반 shadow color 생성

**UI 패턴**
- 실제 UI 샘플(버튼 + 카드 + 네비 + 알럿) 위에 컬러 실시간 적용
- 팔레트 전체를 별도 영역에 노출 (이해와 검증)
- Light/Dark 토글 프리뷰 (지원 시)

### 4.6 Preview Stage

이전 단계 결정 전부 적용된 "완성된 UI"를 보여준다.

- **컴포넌트 샘플러**: 버튼(primary/secondary/ghost/destructive), 인풋(text/select/checkbox/radio), 카드, 뱃지, 알럿(info/success/warning/danger), 네비게이션
- **랜딩 섹션**: Hero(제목 + 부제 + CTA + 배경 이미지) + Feature list(3개 카드) + 심플 푸터
- **이미지**: 사전 준비된 풀에서 컬러 조화로 필터링해 자동 배치
- 만족 안 하면 단계 네비로 특정 단계 복귀

### 4.7 Export Stage

- **결정 요약**: 사람이 읽기 쉬운 형태로 모든 base 결정 나열
- **DESIGN.md 프롬프트**: 복사 버튼이 붙은 하나의 마크다운 텍스트
- **사용 가이드**: "이 프롬프트를 Claude Code의 `/init` 직후 또는 Cursor의 프로젝트 시작 시 붙여넣으면 DESIGN.md가 생성됩니다"

---

## 5. 프리뷰 프레임 설계

### 5.1 컴포넌트 샘플러
단일 파일 컴포넌트로 모든 주요 UI 요소를 한 화면에 배치. 각 요소는 현재 store의 토큰을 소비해 렌더.

- Buttons: primary / secondary / ghost / destructive + size(sm/md/lg) × state(default/hover/disabled)
- Inputs: text input / select / checkbox / radio / textarea
- Cards: title + body + image + action footer
- Badges: neutral / info / success / warning / danger
- Alerts: 네 가지 semantic variants
- Navigation: 심플 탑바 (로고 + 링크 + CTA)

### 5.2 랜딩 섹션
한 화면짜리 가상 제품 랜딩. "이 디자인 토큰으로 실제 페이지를 만들면 이렇게 된다"를 보여준다.

- **Hero**: 큰 제목 + 부제 + primary CTA + 배경 이미지 (이미지 풀에서 선택)
- **Feature list**: 3개 카드 (아이콘은 단순 기하 도형, 제목, 설명)
- **Footer**: 링크 몇 개 + 카피라이트

### 5.3 이미지 풀
- 사전 생성 이미지 10~15장 (풍경, 추상, 오브젝트 등 무난한 톤)
- 각 이미지 메타데이터에 dominant hue(OKLCH `h`)를 미리 계산해 저장 (런타임 분석 X)
- 필터링: 현재 primary hue ±30° 범위 내 이미지 우선, 통과한 것 중 랜덤

---

## 6. 상태 관리

### 6.1 Zustand store 구조 (TypeScript)

```ts
type Step =
  | 'start' | 'typography' | 'spacing' | 'radius'
  | 'shadow' | 'color' | 'preview' | 'export';

interface DesignState {
  // Progress
  currentStep: Step;
  completedSteps: Set<Step>;

  // Atomic decisions (null = 미결정)
  typography: {
    baseSize: 14 | 16 | 18 | 20;
    ratio: 1.125 | 1.2 | 1.25 | 1.333 | 1.5;
    pairingId: string;
  } | null;

  spacing: {
    baseUnit: 4 | 8;
    scale: 'linear' | 'multiplicative';
  } | null;

  radius: {
    base: 0 | 4 | 8 | 12 | 16;
    scale: 'uniform' | 'scaled';
  } | null;

  shadow: {
    intensity: 'none' | 'subtle' | 'medium' | 'strong';
    tintedPreferred: boolean;
  } | null;

  color: {
    primaryHue: number;       // 0~360
    chroma: 'muted' | 'balanced' | 'vivid';
    neutralStyle: 'pure' | 'warm' | 'cool' | 'tinted';
    supportsDark: boolean;
  } | null;

  // Actions
  setStep(step: Step): void;
  updateTypography(v: DesignState['typography']): void;
  // ... 각 단계별 updater
  reset(): void;
}
```

### 6.2 파생 값
- Store는 **원자적 결정만** 저장
- 파생 값(type scale, color palette, spacing scale 등)은 저장하지 않고 selector 훅에서 즉시 계산 + useMemo
- CSS variables는 파생 값을 한 번에 묶어 최상위 컨테이너의 `style` 속성으로 주입
- 단일 진실 공급원: "결정"과 "표현"을 분리

### 6.3 변경 영향 범위
- Store 변경 → selector 재계산 → CSS vars 객체 갱신 → 최상위 div `style` 갱신 → 하위 전부 재렌더링(값 변경된 경우)
- Tailwind 안 쓰는 이유가 이 지점: 빌드 타임 고정이 아닌 런타임 주입이 자연스러움

---

## 7. DESIGN.md 프롬프트 템플릿

### 7.1 구조

```markdown
# Design System Source of Truth

You are generating a DESIGN.md for a frontend project.
The following decisions represent the design intent and MUST be preserved
in the generated DESIGN.md. Use the values verbatim; elaborate on rationale
in your own words where helpful.

## Intent
- Overall feeling: {derived adjective set — e.g. "calm, editorial, lightly technical"}
- Target context: {landing / dashboard / marketing — user-selectable or "general"}
- Design philosophy: {auto-generated 2-3 sentence summary}

## Typography
- Base font size: {baseSize}px
- Modular scale ratio: {ratio} ({ratioName})
- Font pairing: {pairingName} — {pairingDescription}
- Rationale: {자연어 설명 — 왜 이 base와 ratio를 골랐는지 의도}

### Type scale
```css
--font-size-xs: {value}rem;
--font-size-sm: {value}rem;
--font-size-base: {value}rem;
...
```

### Line heights
```css
--line-height-tight: {value};
--line-height-normal: {value};
--line-height-relaxed: {value};
```

## Spacing
- Base unit: {baseUnit}px
- Scale approach: {linear | multiplicative}
- Rationale: {간격 밀도가 어떤 느낌을 주는지}

```css
--space-2xs: ... ;
--space-xs: ... ;
...
```

## Radius
- Base radius: {base}px ({label})
- Scale approach: {uniform | scaled}
- Per-component usage:
  - Input: {value}
  - Button: {value}
  - Card: {value}
  - Badge: {value}

```css
--radius-none, --radius-sm, --radius-md, --radius-lg, --radius-xl, --radius-full
```

## Shadow / Elevation
- Intensity: {level}
- Tinted: {yes | no — tint color: {colorIfYes}}

```css
--shadow-sm: ... ;
--shadow-md: ... ;
--shadow-lg: ... ;
--shadow-xl: ... ;
```

- Elevation hierarchy: dropdown < card < modal < toast

## Color
- Primary hue: {hue}° (OKLCH)
- Chroma level: {muted | balanced | vivid}
- Neutral style: {pure | warm | cool | tinted}
- Dark mode: {supported | not supported}
- Rationale: {이 컬러 조합이 전달하는 감정/포지션}

### Primary palette
```css
--color-primary-50:  oklch(...);
--color-primary-100: oklch(...);
...
--color-primary-950: oklch(...);
```

### Neutral palette
```css
--color-neutral-50: oklch(...);
...
```

### Semantic colors
```css
--color-success-500: oklch(...);
--color-warning-500: oklch(...);
--color-danger-500:  oklch(...);
--color-info-500:    oklch(...);
```

### Interaction states (derived)
- `hover`: lightness −5%
- `active`: lightness −10%
- `focus`: 2px outline in `var(--color-primary-500)` with 2px offset
- `disabled`: 40% opacity

## Usage guidelines
- Primary actions: `var(--color-primary-500)` / `var(--color-primary-600)` on hover
- Cards: `var(--radius-lg)` + `var(--shadow-md)`
- Buttons: `var(--radius-md)` + `var(--shadow-sm)`
- Body text: `var(--font-size-base)` with `var(--line-height-normal)`
- Section spacing: `var(--space-2xl)` between major blocks

## What this design system is NOT
- Not a component library specification — tokens only
- Not opinionated about responsive breakpoints
- Extend these tokens via prefixed custom properties (`--color-brand-*`), don't replace
- Dark mode tokens are {included | out of scope for v1}

## Generation instructions for AI
When using this DESIGN.md:
1. Treat values as authoritative; do not re-derive from preference
2. When a component needs a value not listed here, pick the nearest available token
3. If a new decision is required, document it in an appended section and flag it clearly
4. Preserve the rationale comments — they encode design intent
```

### 7.2 생성 로직
- 템플릿은 TS 모듈로 관리 (`src/lib/buildPrompt.ts`에 `buildDesignPrompt(state): string`)
- Rationale 자연어는 결정 조합에 따라 조건부 생성 (규칙 기반, AI 호출 없음)

---

## 8. 기술 스택

### Core
- Vite 5
- React 18
- TypeScript (strict)
- Zustand

### Styling
- Vanilla CSS + CSS Modules
- CSS custom properties를 최상위 컨테이너에 동적 주입
- Tailwind 미사용 (런타임 토큰 주입과 마찰이 있기 때문)

### Color
- culori — OKLCH 변환 + 팔레트 생성

### Util
- clsx — 조건부 클래스
- framer-motion — 단계 전환 애니메이션 (선택)

### Deploy
- Vite build → static → Vercel or Cloudflare Pages

### 의존성 최소화 원칙
UI 라이브러리(shadcn, radix, mui 등)는 쓰지 않는다.
- 이 앱이 디자인 철학을 보여주는 도구인데, 다른 라이브러리 쓰면 아이러니
- 모든 프리뷰 컴포넌트는 자체 구현 — 그래야 토큰이 일관되게 적용되는지 직접 검증됨
- 번들 사이즈도 작게 유지

---

## 8.5 아키텍처 원칙

### 8.5.1 레이어 구조와 책임

```
┌──────────────────────────────────────────────┐
│  steps/            (단계 UI)                  │
│  preview/          (프리뷰 UI)                │  ← UI 레이어
│  components/       (공용 UI)                  │     (사이드 이펙트 허용)
├──────────────────────────────────────────────┤
│  store/            (Zustand — 원자적 결정)    │  ← 상태 레이어
├──────────────────────────────────────────────┤
│  lib/              (파생 계산, 프롬프트 빌드)  │  ← 도메인 레이어
│                                                 │     (순수 함수만)
└──────────────────────────────────────────────┘
```

- **lib/** — React나 DOM을 import하지 않는다. 입력만으로 결정되는 순수 함수. 예: `buildTypeScale(base, ratio) → TypeScaleTokens`, `buildPalette(hue, chroma) → ColorPalette`, `buildDesignPrompt(state) → string`. 이 레이어는 단위 테스트가 쉽고, 나중에 CLI로도 재사용 가능.
- **store/** — 상태만 보관. 결정을 저장하고 읽는다. 파생 계산은 절대 여기 두지 않는다.
- **steps/, preview/, components/** — UI. 필요하면 store를 구독하고, lib의 함수를 호출해서 파생값을 얻고, 그것으로 렌더.

### 8.5.2 의존 방향 (단방향)

```
UI → store → (nothing)
UI → lib → (nothing)
store → (nothing)
lib → (nothing)
```

- UI는 store와 lib에 의존한다
- store와 lib은 서로 의존하지 않고, UI에도 의존하지 않는다
- 이 방향이 지켜지면 store와 lib은 React 없이도 동작하며, 나중에 Next.js나 CLI로 옮기기 쉽다

### 8.5.3 데이터 흐름 (단방향)

```
[User action]
      │
      ▼
store.updateX()       ← 원자적 결정 저장
      │
      ▼
useSelector + useMemo ← lib의 순수 함수 호출하여 파생값 계산
      │
      ▼
applyTokens(derived)  ← CSS 변수 객체 생성
      │
      ▼
<div style={cssVars}> ← 최상위 컨테이너에 주입
      │
      ▼
하위 컴포넌트 재렌더
```

- "결정"과 "표현"의 분리: store는 무엇을 골랐는지만 알고, 그게 어떤 CSS 값으로 변환되는지는 모른다
- 파생값은 저장하지 않는다: 매번 계산 (useMemo로 캐시)
- CSS vars 주입 지점은 **단 한 곳**: `<App>` 또는 `<Wizard>` 루트의 style 속성

### 8.5.4 테스트 전략

- **lib/** — 단위 테스트 대상. `buildTypeScale`, `buildPalette`, `buildDesignPrompt`는 입력/출력이 명확하므로 vitest로 케이스 나열
- **store/** — 액션 호출 후 상태 스냅샷 검증 정도
- **steps/, preview/** — 테스트 필수 아님. 시각적 검증이 더 빠름

### 8.5.5 설계 의도의 근거

- **왜 파생값을 store에 저장하지 않나**: 원자적 결정이 하나만 바뀌어도 파생값 전체가 재계산되어야 하는데, store에 같이 두면 동기화 버그의 온상. 파생은 순수 함수로 그때그때 계산.
- **왜 CSS vars 주입을 한 곳에서만 하나**: 여러 곳에서 주입하면 어떤 값이 실제 적용되는지 추적 불가. DOM 계층 상 가장 위에서 한 번만 주입하면 하위 전체가 상속받는다.
- **왜 lib은 React를 모르게 하나**: 이 앱은 궁극적으로 "CSS 토큰 + 마크다운 프롬프트"를 만드는 함수다. UI는 그 함수를 사용자가 시각적으로 조작하게 해주는 껍데기일 뿐. 핵심 로직이 React에 묶여 있으면 이 포지셔닝이 흐려진다.

---

## 9. 파일 구조

```
pre-design-md/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── store/
│   │   └── designStore.ts
│   ├── steps/
│   │   ├── StartStep.tsx
│   │   ├── TypographyStep.tsx
│   │   ├── SpacingStep.tsx
│   │   ├── RadiusStep.tsx
│   │   ├── ShadowStep.tsx
│   │   ├── ColorStep.tsx
│   │   ├── PreviewStep.tsx
│   │   └── ExportStep.tsx
│   ├── preview/
│   │   ├── ComponentSampler.tsx
│   │   ├── LandingSection.tsx
│   │   └── applyTokens.ts        // store → CSS vars 객체 변환
│   ├── lib/
│   │   ├── typeScale.ts
│   │   ├── spacingScale.ts
│   │   ├── radiusScale.ts
│   │   ├── shadowTokens.ts
│   │   ├── colorPalette.ts       // culori 래퍼
│   │   ├── imageFilter.ts        // 컬러 기반 이미지 선택
│   │   └── buildPrompt.ts
│   ├── components/
│   │   ├── Wizard.tsx            // 단계 컨테이너
│   │   ├── StepNav.tsx           // 진행도 표시 + 점프
│   │   ├── PresetCard.tsx        // 공용 프리셋 선택 카드
│   │   └── ui/                   // 내부 Button/Input/Card 등
│   ├── assets/
│   │   └── preview-images/
│   │       ├── index.ts          // 메타데이터(dominant hue 포함)
│   │       └── *.webp
│   ├── styles/
│   │   ├── reset.css
│   │   └── base.css
│   └── types/
│       └── design.ts
├── public/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 10. Open questions

개발 진행하면서 결정할 것들:

- 단계 네비게이션 UI: 상단 stepper bar vs. 사이드 패널
- 프리셋 개수: 각 단계별 4~5개면 충분한지 실제 만들어 보고 판단
- 이미지 생성: Midjourney/Flux로 사전 생성 vs. Unsplash API 활용
- 랜딩 섹션의 텍스트 콘텐츠: 고정 카피 vs. 선택된 톤에 따라 변화
- 모바일 대응: v1에서는 데스크톱 우선, 모바일은 "데스크톱 권장" 안내로 처리할지
