(() => {
  "use strict";

  const CLAWD_BODY_PATH =
    "M8 11H34V19H38V23H34V31H31.5V27H30V31H27.5V27H14.5V31H12V27H10.5V31H8V23H4V19H8Z";
  const AGY_ARCH_PATH =
    "M89.6992 93.695C94.3659 97.195 101.366 94.8617 94.9492 88.445C75.6992 69.7783 79.7825 18.445 55.8659 18.445C31.9492 18.445 36.0325 69.7783 16.7825 88.445C9.78251 95.445 17.3658 97.195 22.0325 93.695C40.1159 81.445 38.9492 59.8617 55.8659 59.8617C72.7825 59.8617 71.6159 81.445 89.6992 93.695Z";

  /** @typedef {"ko" | "en"} Lang */

  const TABS = [
    { id: "overview", num: "1", ko: "overview", en: "overview" },
    { id: "demo", num: "2", ko: "cli · demo", en: "cli · demo" },
    { id: "architecture", num: "3", ko: "architecture", en: "architecture" },
  ];

  const PROFILE_ENTRY = {
    id: "profile",
    slug: "profile",
    kind: "profile",
    name: "KyongSik Yoon",
    badge: "herdr",
    badgeClass: "badge-custom",
    cwd: "~/KyongSik-Yoon",
    branch: "main",
    agent: "herdr",
    repoUrl: "https://github.com/KyongSik-Yoon/KyongSik-Yoon",
    siteUrl: "https://ksyoon.com/",
    sub: { ko: "프로필 · AI 사용량 카드", en: "Profile · AI usage telemetry" },
    summary: {
      ko: "Claude Code, Antigravity CLI(agy), Gemini, Tailscale 및 온디바이스 음성 AI를 일상 워크플로우에 맞게 직접 튜닝하고 확장하는 개발자 KyongSik Yoon(sam)의 작업실입니다.",
      en: "Workspace of KyongSik Yoon (sam), building harness plugins, binary patchers, safety gates, remote daemons, and on-device tools around Claude Code, Antigravity CLI, Gemini, and Tailscale.",
    },
    stack: ["Kotlin", "Rust", "Go", "TypeScript", "Linux / Wayland", "Android NPU"],
    features: [
      {
        title: { ko: "AI 하네스 & 터미널 UX 엔지니어링", en: "AI Harness & Terminal UX" },
        desc: {
          ko: "herdr v0.9.5 멀티플렉서 환경 위에서 Claude Code(cc-desktop-mod v0.81.2)와 Antigravity CLI(agy-cli-patch v0.2.4)의 출력 렌더링, 상태줄, 사이드 패인을 직접 개조합니다.",
          en: "Customizes Claude Code (cc-desktop-mod v0.81.2) and Antigravity CLI (agy-cli-patch v0.2.4) rendering, statuslines, and side panes inside herdr v0.9.5.",
        },
      },
      {
        title: { ko: "안전 게이트 & 모델 오케스트레이션", en: "Safety Gates & Model Routing" },
        desc: {
          ko: "Gemini Decisions API 기반 3대 독립 플러그인(decision · decision-stop · decision-subagent)으로 위험 명령 차단, diff 체크리스트 심사, Gemini 4 10단계 동적 모델 라우팅을 수행합니다.",
          en: "Runs three native plugins (decision, decision-stop, decision-subagent) for 0ms shell safety gating, diff audits, and 10-tier Gemini 4 subagent/swarm routing.",
        },
      },
      {
        title: { ko: "크로스 디바이스 연결 & 프라이버시", en: "Cross-Device Bridge & Privacy" },
        desc: {
          ko: "Tailscale 기반 임시 포트 게이트(ts-gate v0.1.0), Linux 원격 데몬(gemini-remote-linux), 온디바이스 음성 받아쓰기(soksak + soksak-daemon)로 안전한 개인 개발 환경을 구축합니다.",
          en: "Connects Android, Linux desktops, and tailnet services privately via ts-gate v0.1.0, gemini-remote-linux, and on-device soksak.",
        },
      },
    ],
    installCmd: "git clone https://github.com/KyongSik-Yoon/KyongSik-Yoon.git",
    cliBlockTitle: "workspace-index.sh",
    cliSnippet: `$ ls -1 ~/dev/git-repo | grep -E "cc-desktop|soksak|agy-|gemini-remote|ts-gate"
cc-desktop-mod      # v0.81.2 · Claude Code 데스크톱 스타일 플러그인 스위트
soksak              # Android 온디바이스 한국어/개발용어 받아쓰기 + Rust PC 데몬
agy-cli-patch       # v0.2.4 · Antigravity CLI(agy) 9종 무의존성 동적 바이너리 패처
agy-decision-lab    # Gemini Decisions API 안전 게이트·스웜 라우터·5종 MCP
gemini-remote-linux # Go 1.27.3 · Linux PC ↔ Gemini 모바일/웹/데스크톱 원격 데몬
ts-gate             # v0.1.0 · Linux/macOS Tailnet 전용 일시 포트 게이트 TUI/CLI`,
    archNodes: [
      "Android (soksak)",
      "Tailscale Mesh (ts-gate)",
      "Herdr v0.9.5 + Collie",
      "Claude / Antigravity CLI",
      "Decision Gate & Plugins",
    ],
    statusline: {
      type: "custom-herdr",
      row1: {
        model: "herdr[v0.9.5]",
        tag: "IME+screen",
        ctxPct: 38,
        dir: "~/KyongSik-Yoon",
        branch: "main",
        extra: "6 spaces active",
      },
      row2: { label: "claude", p5: 18, t5: "3h12m", p7: 45, t7: "2d0h", extra: "cc-desktop-mod v0.81.2" },
      row3: { label: "gemini", p5: 24, t5: "2h45m", p7: 60, t7: "3d4h", extra: "agy-cli-patch v0.2.4 · decision-lab" },
    },
  };

  const PROJECTS = [
    {
      id: "cc-desktop-mod",
      slug: "cc-desktop-mod",
      kind: "claude",
      name: "cc-desktop-mod",
      badge: "claude",
      badgeClass: "badge-claude",
      cwd: "~/dev/git-repo/cc-desktop-mod",
      branch: "main",
      agent: "claude",
      repoUrl: "https://github.com/KyongSik-Yoon/cc-desktop-mod",
      siteUrl: "https://kyongsik-yoon.github.io/cc-desktop-mod/",
      sub: {
        ko: "v0.81.2 · Claude Code 데스크톱 UX 플러그인 스위트",
        en: "v0.81.2 · Claude Desktop UI mod & side-pane suite",
      },
      summary: {
        ko: "Claude Code(>=2.1.323) 터미널 UI를 데스크톱 앱의 Code 탭 감각(프롬프트 말풍선, 상단 Progress Band, 접히는 도구 호출, 마크다운·Mermaid 렌더링, 줄 댓글 Diff·미리보기 패인)으로 탈바꿈시키는 플러그인 마켓플레이스(v0.81.2)입니다.",
        en: "Transforms Claude Code (>=2.1.323) terminal UI into a Claude Desktop workspace with prompt bubbles, live Progress Band, folded tool runs, Mermaid/table rendering, and inline line-comment diff/preview panes (v0.81.2).",
      },
      stack: ["TypeScript", "v0.81.2", "Claude Code >=2.1.323", "MIT"],
      features: [
        {
          title: { ko: "데스크톱 말풍선 & Progress Band", en: "Prompt Bubbles & Progress Band" },
          desc: {
            ko: "입력 프롬프트를 액센트 말풍선으로 구분하고, 작업 중 현재 스텝·CPU/경과시간·PR 체크 칩(#12 ✓ 5/5)·컨텍스트(◑ 62%)·백그라운드 태스크를 상단 밴드에 표시합니다.",
            en: "Styles prompts as accented bubbles while pinning current step, running process CPU/time, PR check chips, context usage, and background tasks.",
          },
        },
        {
          title: { ko: "줄 댓글(Line Comments) · Diff & 미리보기 패인", en: "Line Comments in Diff, Preview & Plan" },
          desc: {
            ko: "/desk-diff 줄 단위 코멘트는 물론, /desk-preview(단축키 c)와 desk-plan 승인 카드(3)에서 계획·마크다운 문서 라인별 댓글을 패널 전폭 입력칸으로 작성해 다음 프롬프트에 실어 보냅니다.",
            en: "Write inline line/range comments in /desk-diff, Markdown preview (/desk-preview with 'c'), or desk-plan approval cards ('3') via full-width comment fields synced into your next prompt.",
          },
        },
        {
          title: { ko: "통합 사이드 패인 & 마켓플레이스 5종", en: "Integrated Panes & 5 Marketplace Plugins" },
          desc: {
            ko: "desk-look(/desk-pr GitHub·GitLab 머지, /desk-tasks, /desk-context, /desk-monitor)에 더해 desk-plan, desk-review(/simplify→/code-review), desk-asana, desk-slack 4종을 함께 제공합니다.",
            en: "Ships desk-look (/desk-pr, /desk-tasks, /desk-context, Linux /desk-monitor) plus separate desk-plan, desk-review, desk-asana, and desk-slack plugins.",
          },
        },
      ],
      installCmd: "/plugin install desk-look --marketplace KyongSik-Yoon/cc-desktop-mod",
      cliBlockTitle: "claude-code :: desk-look v0.81.2",
      cliSnippet: `/plugin install desk-look --marketplace KyongSik-Yoon/cc-desktop-mod
/plugin install desk-plan@cc-desktop-mod
/plugin install desk-review@cc-desktop-mod
/plugin install desk-asana@cc-desktop-mod
/plugin install desk-slack@cc-desktop-mod`,
      simPreview: {
        prompt: "❯ cc-desktop-mod v0.81.2 줄 댓글과 미리보기 패인 구조 정리해줘",
        fold: "▸ Ran 2 commands, read 4 files ›  (src/panes/diff.ts, src/panes/preview.ts)",
        answer: [
          "┌────────────────┐      ┌──────────────────────┐",
          "│ Claude Hook    │─────▶│ Desk Look Band v0.81 │",
          "└────────────────┘      └──────────┬───────────┘",
          "                                   ▼",
          "       [/desk-diff & /desk-preview Line Comments]",
        ].join("\n"),
        band: "● step 3/3 · main · ctx ◑ 42% · PR #88 ✓ · 0 bg jobs",
      },
      archNodes: [
        "Claude Code >=2.1.323",
        "desk-look v0.81.2 Renderer",
        "Bubble / Fold / Line Comments",
        "desk-plan · review · asana · slack",
      ],
      statusline: {
        type: "claude",
        row1: {
          model: "opus-5",
          effort: "high",
          dir: "cc-desktop-mod",
          branch: "main*",
          ahead: 1,
          ctxPct: 42,
          duration: "18m",
        },
        row2: {
          provider: "claude",
          p5: 18,
          t5: "3h12m",
          p7: 45,
          t7: "2d4h",
          scopedName: "fable",
          scopedPct: 12,
          advisorCalls: 3,
          advisorTokens: "4.2k",
        },
        row3: {
          provider: "codex",
          p5: 8,
          t5: "1h40m",
          p7: 31,
          t7: "4d1h",
        },
      },
    },
    {
      id: "soksak",
      slug: "soksak",
      kind: "custom-soksak",
      name: "soksak",
      badge: "whisper-npu",
      badgeClass: "badge-custom",
      cwd: "~/dev/git-repo/soksak",
      branch: "main",
      agent: "soksak",
      repoUrl: "https://github.com/KyongSik-Yoon/soksak",
      siteUrl: "https://soksak.ksyoon.com/",
      sub: {
        ko: "속삭 — Android 온디바이스 한국어 + 개발용어 음성 받아쓰기",
        en: "Soksak — On-device Korean + dev-jargon Android voice dictation",
      },
      summary: {
        ko: "음성을 서버로 전혀 보내지 않고 기기 내부(whisper.cpp CPU 또는 Qualcomm QNN NPU)에서 한국어·영어 개발 용어를 즉시 받아써 활성 입력창이나 Tailscale 무의존성 Rust 데몬(soksak-daemon)을 거쳐 PC 클립보드에 꽂아주는 Android 앱입니다.",
        en: "100% offline Android voice dictation forked from OpenWispr. Recognizes mixed Korean/English tech terms via whisper.cpp or Qualcomm NPU and optionally relays transcripts over Tailscale to soksak-daemon.",
      },
      stack: ["Kotlin", "C++", "whisper.cpp", "sherpa-onnx + QNN", "Rust daemon (std)"],
      features: [
        {
          title: { ko: "플로팅 버블 & 자동 엔터(⏎)", en: "Floating Bubble & Auto-Enter (⏎)" },
          desc: {
            ko: "접근성 서비스로 포커스를 빼앗지 않고 글을 삽입하며, 1~5초 후 Enter를 눌러 주는 자동 엔터 링(버블 터치 시 취소)으로 모바일 에이전트 프롬프트를 손대지 않고 보냅니다.",
            en: "Injects text via AccessibilityService without stealing focus, featuring an optional 1–5s auto-enter ring countdown (tap bubble to cancel).",
          },
        },
        {
          title: { ko: "CAM++ · VoxLock & Snapdragon NPU", en: "CAM++ VoxLock & SM8850/SM8750 NPU" },
          desc: {
            ko: "내 목소리 등록(CAM++)과 VoxLock으로 주변 TV·타인 음성을 분리하며, Snapdragon 8 Elite Gen 5(SM8850)와 Snapdragon 8 Elite(SM8750) 실기기에서 Large v3 Turbo NPU를 정식 지원합니다.",
            en: "Filters speaker noise with CAM++ and VoxLock, running Whisper Large v3 Turbo natively on Qualcomm NPU across both SM8850 and verified SM8750 devices.",
          },
        },
        {
          title: { ko: "Tailscale PC 직송 · 프라이버시 데몬", en: "soksak-daemon (:48620) & soksak-paste" },
          desc: {
            ko: "무의존성 Rust 데몬(포트 48620)이 Tailscale 망과 연동 코드로 PC 클립보드에 텍스트를 수신(로그에 발화 내용 미기록)하며, Hyprland 한글 IME 깨짐을 막는 soksak-paste를 지원합니다.",
            en: "Zero-dependency Rust daemon on Tailscale port 48620 relays clipboard text (never logging content) with soksak-paste for IME-safe Hyprland input.",
          },
        },
      ],
      installCmd: "soksak-daemon pair && systemctl --user enable --now soksak-daemon",
      cliBlockTitle: "soksak-daemon :: pair & tailnet relay (:48620)",
      cliSnippet: `$ soksak-daemon pair
In Soksak: Settings -> Send to PC
  PC address    100.64.0.42:48620
  Pairing code  7482-9103

$ soksak-daemon
listening on port 48620 (Tailscale only); run \`soksak-daemon pair\` for the pairing code

$ soksak-daemon send 127.0.0.1:48620 "시험"   # local relay check (text not logged)`,
      archNodes: [
        "Mic AudioRecord",
        "CAM++ / VoxLock Filter",
        "whisper.cpp / QNN NPU",
        "Dev Alias Correction",
        "Android Input / soksak-daemon :48620",
      ],
      statusline: {
        type: "custom-soksak",
        row1: {
          model: "whisper-v3-turbo[qnn-npu]",
          engine: "SM8850 · SM8750",
          rtfPct: 16,
          rtfLabel: "0.16x RTF",
          target: "android → soksak-daemon",
        },
        row2: {
          label: "voxlock",
          p5: 94,
          t5: "CAM++ locked",
          p7: 22,
          t7: "noise gate",
        },
        row3: {
          label: "tailnet",
          host: "sam@omarchy:48620",
          autoEnter: "auto-⏎ 2.0s",
          vocab: "Korean + dev aliases",
        },
      },
    },
    {
      id: "agy-cli-patch",
      slug: "agy-cli-patch",
      kind: "agy",
      name: "agy-cli-patch",
      badge: "agy",
      badgeClass: "badge-agy",
      cwd: "~/dev/git-repo/agy-cli-patch",
      branch: "main",
      agent: "agy",
      repoUrl: "https://github.com/KyongSik-Yoon/agy-cli-patch",
      siteUrl: "https://agy-cli-patch.ksyoon.com/",
      sub: {
        ko: "v0.2.4 · Antigravity CLI(agy) 9종 무의존성 동적 바이너리 패처",
        en: "v0.2.4 · 9-patch zero-dependency binary patcher for Antigravity CLI",
      },
      summary: {
        ko: "Antigravity CLI(agy — Linux & macOS, x86_64 & ARM64)의 ELF64/Mach-O .gopclntab 심볼과 기계어 시그니처를 mmap으로 탐색해 스트리밍·CJK 마크다운·코드 테마·컴팩션 임계치 등 9종 패치를 적용하는 무의존성 Rust TUI/CLI 도구(v0.2.4)입니다.",
        en: "Zero-dependency Rust TUI/CLI binary patcher (v0.2.4) for Antigravity CLI across Linux & macOS (x86_64 & ARM64). Scans .gopclntab and opcode signatures via mmap to apply 9 modular patches with automatic backup and Mach-O re-signing.",
      },
      stack: ["Rust (std only)", "v0.2.4", "ELF64 / Mach-O 64", "x86_64 & ARM64"],
      features: [
        {
          title: { ko: "대화형 3단계 TUI & 동적 시그니처 스캔", en: "Interactive TUI & .gopclntab Scan" },
          desc: {
            ko: "인자 없이 실행하면 raw ANSI 3단계 TUI로 패치 가능 여부를 사전 대조하며, --preset은 agy-batch·agy-nodrip 2종을 자동 갱신합니다(Apple Silicon 9종 전체 / Linux ARM64 7종 지원).",
            en: "Launches a 3-step raw-ANSI TUI when invoked without args, pre-checks opcode compatibility, and offers --preset for agy-batch / agy-nodrip (all 9 patches on Apple Silicon, 7 on Linux ARM64).",
          },
        },
        {
          title: { ko: "전체 9종 모듈형 바이너리 패치", en: "All 9 Modular Patches (-p)" },
          desc: {
            ko: "nodrip, batch, heading, cjk-bold, tilde-strike, code-theme(흐린 native→vs/bw 등 교체), compact(32k~1000k 임계치 양방향 조절), banner((patch v0.2.4)), release-notes를 조합합니다.",
            en: "Combines nodrip, batch, heading, cjk-bold, tilde-strike, code-theme (default vs), compact (32k–1000k bidirectional checkpoint tuning), banner, and release-notes.",
          },
        },
        {
          title: { ko: "antigravity.orig 백업 & 자동 서명", en: "antigravity.orig Backup & Codesign" },
          desc: {
            ko: "대상 바이너리와 같은 디렉토리에 antigravity.orig 원본 백업을 유지(--restore 복구)하고 Linux FICLONE reflink 및 macOS ad-hoc codesign -f -s - 서명을 자동 수행합니다.",
            en: "Stores antigravity.orig alongside the target binary (supporting --restore), leverages Linux FICLONE reflinks, and re-signs Mach-O outputs automatically.",
          },
        },
      ],
      installCmd: "agy-cli-patch -p all --compact 180k -o agy-batch",
      cliBlockTitle: "agy-cli-patch -p all --compact 180k -o agy-batch",
      cliSnippet: `$ agy-cli-patch -p all --compact 180k -o agy-batch
[*] 대상 바이너리: /usr/bin/antigravity (버전 1.5.7, ELF64 x86_64)
[*] 원본 백업: /usr/bin/antigravity.orig (reflink)
  ✓ nodrip        : textDrip 16ms 딜레이 제거
  ✓ batch         : 응답 완료 시 마크다운 일괄 출력
  ✓ heading       : '##' 헤딩 프리픽스 숨김
  ✓ cjk-bold      : 볼드 뒤 한글 조사 구문 깨짐 수정
  ✓ tilde-strike  : 단일 '~' 취소선 오인식 방지
  ✓ code-theme    : 터미널 스킴 코드 블록 테마 -> vs
  ✓ compact       : 자동 컴팩션 임계값 256k -> 180k
  ✓ banner        : (patch v0.2.4) 배너 표기
[+] 생성 완료: ~/.local/bin/agy-batch -> /usr/bin/agy-batch`,
      archNodes: [
        "mmap(antigravity binary)",
        "ELF64 / Mach-O .gopclntab",
        "x86_64 / ARM64 Signature",
        "antigravity.orig + Patch",
        "Symlink / codesign -f -s -",
      ],
      statusline: {
        type: "agy",
        row1: {
          model: "orchestrator-carbon[1m]",
          effort: "high",
          dir: "agy-cli-patch",
          branch: "main",
          ctxPct: 31,
          duration: "11m",
        },
        row2: { provider: "gemini", p5: 19, t5: "3h04m", p7: 44, t7: "2d8h" },
        row3: { provider: "3p", p5: 4, t5: "4h18m", p7: 15, t7: "5d1h" },
        row4: { pr: "v0.2.4", state: "merged", title: "ARM64(Apple Silicon·Linux) 패치 확대 및 code-theme·compact 지원" },
      },
    },
    {
      id: "agy-decision-lab",
      slug: "agy-decision-lab",
      kind: "agy",
      name: "agy-decision-lab",
      badge: "agy",
      badgeClass: "badge-agy",
      cwd: "~/dev/git-repo/agy-decision-lab",
      branch: "main",
      agent: "agy",
      repoUrl: "https://github.com/KyongSik-Yoon/agy-decision-lab",
      siteUrl: null,
      sub: {
        ko: "Gemini Decisions API 안전 게이트·스웜 라우터·Rust MCP",
        en: "3 native agy plugins (safety gate, stop audit, subagent router) & Rust MCP",
      },
      summary: {
        ko: "gemini-decision-1 판별 모델을 Antigravity CLI 네이티브 플러그인 3종(decision · decision-stop · decision-subagent)과 로컬 stdio Rust MCP 서버(agy-decision-mcp)로 패키지화해 위험 명령 사전 차단, diff 체크리스트 심사, Gemini 4 10단계 서브에이전트 라우팅을 제공합니다.",
        en: "Packages gemini-decision-1 into three standalone Antigravity CLI plugins (decision, decision-stop, decision-subagent) and a tokio/rmcp stdio server (agy-decision-mcp), separating API billing keys from main agy sessions.",
      },
      stack: ["Rust", "tokio", "rmcp", "Gemini Decisions API", "stdio MCP"],
      features: [
        {
          title: { ko: "3대 독립 네이티브 플러그인 구성", en: "Three Standalone Native Plugins" },
          desc: {
            ko: "decision(PreToolUse 0ms 패스스루 안전 게이트), decision-stop(Stop Git diff 증분 심사), decision-subagent(스폰 모델 라우팅)가 독립 플러그인과 config.env 키 분리로 동작합니다.",
            en: "Splits into plugins/decision (PreToolUse 0ms fast-path + gate), plugins/decision-stop (incremental diff check), and plugins/decision-subagent with isolated XDG config.env keys.",
          },
        },
        {
          title: { ko: "Gemini 4 10단계 스웜·서브에이전트 라우터", en: "10-Tier Gemini 4 Subagent Router" },
          desc: {
            ko: "레거시 agy-route REPL 없이 PreToolUse overwrite만으로 invoke_subagent 및 swarm add 호출 시 Gemini 4 Hydrogen·Argon·Carbon 10단계 모델과 추론 강도(low~xhigh)를 자동 주입합니다.",
            en: "Injects 10-tier Hydrogen/Argon/Carbon models and reasoning effort via PreToolUse overwrite on invoke_subagent and swarm add without breaking parent prompt caches.",
          },
        },
        {
          title: { ko: "agy-decision-mcp 5종 Rust MCP 도구", en: "5 Rust stdio MCP Tools" },
          desc: {
            ko: "gate_shell_command, evaluate_decisions, scan_code_checklist, workspace_git_digest, batch_code_context 5종 도구를 제공해 다중 저장소 Git 요약과 체크리스트 심사를 고속 처리합니다.",
            en: "Exposes gate_shell_command, evaluate_decisions, scan_code_checklist, workspace_git_digest, and batch_code_context over tokio rmcp stdio MCP.",
          },
        },
      ],
      installCmd: "./scripts/install.sh",
      cliBlockTitle: "agy-decision-hook :: gate, stop & subagent-router",
      cliSnippet: `$ agy-decision-hook status
Config        (XDG 설정·API 키):        ~/.config/agy-decision-lab/config.env (GEMINI_API_KEY: configured)
PreToolUse    (명령 안전 검문소):       enabled (플러그인: decision)
PreToolUse    (서브에이전트·스웜 라우터): enabled (플러그인: decision-subagent)
Stop          (완료 체크리스트 검증):   enabled (플러그인: decision-stop)

$ agy-decision-hook test-gate "git push --force origin main"
decision=DENY  model=gemini-decision-1  latency=142ms
reason: protected branch 'main' force-push blocked by PreToolUse policy

$ agy-decision-hook test-subagent "Audit lock ordering across async channels" --kind swarm --workspace inherit
route -> Gemini 4 Argon (High) · reason=concurrency audit requires multi-step reasoning`,
      archNodes: [
        "PreToolUse / Stop Hook",
        "agy-decision-hook (Rust)",
        "gemini-decision-1 API",
        "Allow / Deny / Model Overwrite",
        "agy-decision-mcp (5 Tools)",
      ],
      statusline: {
        type: "agy",
        row1: {
          model: "orchestrator-carbon[1m]",
          effort: "high",
          dir: "agy-decision-lab",
          branch: "main*",
          ahead: 2,
          ctxPct: 54,
          duration: "32m",
        },
        row2: { provider: "gemini", p5: 36, t5: "2h18m", p7: 58, t7: "3d1h" },
        row3: { provider: "3p", p5: 11, t5: "3h50m", p7: 27, t7: "4d9h" },
        row4: { pr: "#31", state: "merged", title: "Hydrogen 10단계 동적 라우팅 및 레거시 REPL 계층 정리" },
      },
    },
    {
      id: "gemini-remote-linux",
      slug: "gemini-remote-linux",
      kind: "custom-gemini",
      name: "gemini-remote-linux",
      badge: "gemini-d",
      badgeClass: "badge-custom",
      cwd: "~/dev/git-repo/gemini-remote-linux",
      branch: "main",
      agent: "gemini-remote",
      repoUrl: "https://github.com/KyongSik-Yoon/gemini-remote-linux",
      siteUrl: null,
      sub: {
        ko: "Linux PC ↔ Gemini 모바일·웹·데스크톱 양방향 원격 데몬 (비공식)",
        en: "Unofficial Gemini Desktop daemon for Linux (Shell, MCP & Wayland/X11)",
      },
      summary: {
        ko: "Linux 워크스테이션을 Gemini 모바일·웹 및 리눅스 비공식 Gemini 데스크톱 앱과 양방향 연결해 로컬 워크스페이스 파일 조작, 셸 실행, MCP 브리지, Wayland/Hyprland·X11 GUI Computer Use를 구동하는 Go 1.27.3 데몬입니다.",
        en: "Connects Linux PCs to Gemini Mobile, Web, and unofficial Linux Gemini desktop clients in a single Go 1.27.3 binary for scoped workspace file tools, shell commands, MCP bridges, and Wayland/X11 Computer Use.",
      },
      stack: ["Go 1.27.3", "Robin/Punctual Protocol", "Wayland / Hyprland & X11", "MIT"],
      features: [
        {
          title: { ko: "모바일·웹·비공식 Linux 데스크톱 연동", en: "Mobile, Web & Unofficial Linux Client Sync" },
          desc: {
            ko: "장치 등록·프레즌스·핸드셰이크 세션 갱신으로 좀비 구독 없이 Android/iOS·웹·비공식 Linux 데스크톱 래퍼와 실시간 양방향 스트림을 유지합니다.",
            en: "Maintains device registration, presence heartbeats, and handshake-safe bidirectional streams across Gemini Mobile, Web, and Linux desktop wrappers.",
          },
        },
        {
          title: { ko: "로컬 툴 실행 & 외부 MCP 브리지", en: "Scoped File Tools & MCP Bridge" },
          desc: {
            ko: "허용된 폴더 내에서 셸·파일 편집(view_file 로컬 텍스트 직독 분기 포함)·Grep을 처리하며 내장 Git·Obsidian 및 외부 stdio MCP 서버를 연결합니다.",
            en: "Runs scoped shell, grep, and file edits (with local text branching in view_file) alongside built-in git/obsidian and external stdio MCP servers.",
          },
        },
        {
          title: { ko: "Wayland / X11 GUI & systemd 상주", en: "Wayland/X11 GUI & systemd Service" },
          desc: {
            ko: "Wayland/Hyprland(hyprctl, grim, wtype, ydotool)와 X11(xdotool, import) GUI 제어(ui_control)를 지원하며 ./gemini-remote service install로 사용자 서비스 등록이 가능합니다.",
            en: "Supports ui_control on both Hyprland/Wayland and X11 plus one-command user daemon installation via ./gemini-remote service install.",
          },
        },
      ],
      installCmd: "./gemini-remote login && ./gemini-remote folders add ~/dev/git-repo && ./gemini-remote register && ./gemini-remote serve",
      cliBlockTitle: "gemini-remote :: register & serve",
      cliSnippet: `$ ./gemini-remote folders add ~/dev/git-repo
$ ./gemini-remote register
$ ./gemini-remote serve   # 또는 ./gemini-remote service install
[auth]   OAuth credentials verified (device: omarchy-linux-01)
[bridge] folders mounted: ~/dev/git-repo
[mcp]    attached: git, obsidian (+ external stdio bridge)
[gui]    compositor=Hyprland (capture=grim, input=wtype+ydotool)
[stream] Robin/Punctual connected (Mobile / Web / Linux desktop wrapper)`,
      archNodes: [
        "Gemini Mobile / Web / Desktop",
        "Cloud Gateway (Robin/Punctual)",
        "gemini-remote (Go 1.27.3)",
        "Local Shell · File · MCP",
        "Wayland / Hyprland & X11 GUI",
      ],
      statusline: {
        type: "custom-gemini",
        row1: {
          model: "gemini-remote[go1.27.3]",
          proto: "Robin/Punctual",
          rttPct: 21,
          rttLabel: "41ms RTT",
          host: "omarchy-linux-01",
        },
        row2: {
          label: "stream",
          p5: 100,
          t5: "online",
          p7: 32,
          t7: "2 folders",
        },
        row3: {
          label: "wayland",
          compositor: "Hyprland + X11 ui_control",
          mcp: "git + obsidian + stdio MCP",
        },
      },
    },
    {
      id: "ts-gate",
      slug: "ts-gate",
      kind: "custom-ts",
      name: "ts-gate",
      badge: "tailnet",
      badgeClass: "badge-custom",
      cwd: "~/dev/git-repo/ts-gate",
      branch: "main",
      agent: "ts-gate",
      repoUrl: "https://github.com/KyongSik-Yoon/ts-gate",
      siteUrl: null,
      sub: {
        ko: "v0.1.0 · Linux·macOS Tailnet 전용 일시 포트 게이트 TUI/CLI",
        en: "v0.1.0 · Tailnet-only temporary reverse proxy gate manager (Linux & macOS)",
      },
      summary: {
        ko: "외부 공인 인터넷(tailscale funnel) 노출을 원천 차단하고 Tailscale tailnet 내부(tailscale serve)로만 로컬·내부망 포트를 일시 개방한 뒤, TTL 자동 만료(기본 1시간)와 재부팅 시 자동 회수(boot-guard)를 보장하는 Linux·macOS(x86_64/ARM64)용 무의존성 Rust TUI/CLI 도구(v0.1.0)입니다.",
        en: "Zero-dependency Rust TUI/CLI (v0.1.0) for Linux & macOS (x86_64 & ARM64) that exposes temporary tailnet-only services via tailscale serve with automatic TTL expiry and reboot auto-close.",
      },
      stack: ["Rust (std only)", "v0.1.0", "Linux & macOS", "Tailscale Serve"],
      features: [
        {
          title: { ko: "Tailnet 전용 & 외부 상시 포트 보호", en: "Tailnet-Only · External Port Guard" },
          desc: {
            ko: "모든 개방은 tailscale serve --bg 만 허용해 공인 funnel 노출을 차단하며, ts-gate 밖에서 열린 기존 상시 포트(:443 등)는 절대 덮어쓰거나 닫지 않습니다.",
            en: "Uses private tailscale serve --bg strictly without funnel support, and refuses to overwrite or close external always-on ports such as :443.",
          },
        },
        {
          title: { ko: "크로스 플랫폼 TTL 타이머 & Boot Guard", en: "Cross-Platform TTL & Boot Guard" },
          desc: {
            ko: "Linux(systemd-run --user + ts-gate-boot.service)와 macOS(만료 워커 + LaunchAgent plist) 양쪽에서 TTL 만료 시 자동 해제 및 재부팅 직후 sweep --boot 정리를 수행합니다.",
            en: "Enforces TTL expiry and startup sweep --boot via systemd-run/user unit on Linux and background worker/LaunchAgent plist on macOS.",
          },
        },
        {
          title: { ko: "endpoints + leases 분리 & 무의존성 TUI", en: "0600 State Split & Raw ANSI TUI" },
          desc: {
            ko: "외부 크레이트 없는 raw ANSI TUI로 엔드포인트 추가/열기/닫기/URL 복사(OSC 52)를 다루며, 상태는 endpoints.json(0600)과 leases.json(0600)에 안전하게 저장합니다.",
            en: "Drives a zero-crate ANSI TUI with OSC 52 clipboard copy while storing definitions in ~/.config/ts-gate/endpoints.json and active leases in ~/.local/state/ts-gate/leases.json.",
          },
        },
      ],
      installCmd: "ts-gate add grafana http://127.0.0.1:3000 -p 3000 -t 1h --open && ts-gate list",
      cliBlockTitle: "ts-gate v0.1.0 :: open, quick & list",
      cliSnippet: `$ ts-gate add grafana http://127.0.0.1:3000 -p 3000 -t 1h --open
[+] 개방 완료: https://omarchy.tailnet.ts.net:3000 (16:30 자동 해제)

$ ts-gate quick 127.0.0.1:8080 -p 18080 -t 15m
[+] 일회성 개방 완료: https://omarchy.tailnet.ts.net:18080 (15분 후 자동 해제)

$ ts-gate list
ts-gate v0.1.0 (tailnet 전용 · https://omarchy.tailnet.ts.net)

등록된 게이트:
  ● grafana      :3000 -> 127.0.0.1:3000  |  열림 (남은 58분, 16:30 해제)
    접속: https://omarchy.tailnet.ts.net:3000

외부 상시 포트 (보호됨):
  ◆ :443 -> 127.0.0.1:8787  (ts-gate 관리 대상 아님, 보호됨)`,
      archNodes: [
        "ts-gate CLI / Raw ANSI TUI",
        "endpoints.json & leases.json",
        "tailscale serve --bg (No Funnel)",
        "systemd-run / macOS TTL Worker",
        "ts-gate-boot / LaunchAgent Sweep",
      ],
      statusline: {
        type: "custom-ts",
        row1: {
          model: "ts-gate[v0.1.0]",
          mode: "tailnet-only",
          ttlPct: 68,
          ttlLabel: "58m left",
          funnel: "funnel: BLOCKED",
        },
        row2: {
          label: "gates",
          p5: 34,
          t5: ":3000 → :3000 (1h)",
          p7: 100,
          t7: ":443 collie protected",
        },
        row3: {
          label: "guard",
          boot: "boot-guard armed",
          state: "endpoints + leases synced",
        },
      },
    },
  ];

  const ALL_ITEMS = [PROFILE_ENTRY, ...PROJECTS];

  /** @type {{ selectedId: string; tab: string; lang: Lang; active: boolean; filter: string; sidebarOpen: boolean }} */
  const state = {
    selectedId: "cc-desktop-mod",
    tab: "overview",
    lang: "ko",
    active: true,
    filter: "",
    sidebarOpen: false,
  };

  const els = {
    topbarTabs: document.getElementById("topbar-tabs"),
    brandHomeBtn: document.getElementById("brand-home-btn"),
    mobileMenuBtn: document.getElementById("mobile-menu-btn"),
    sidebar: document.getElementById("herdr-sidebar"),
    sidebarBackdrop: document.getElementById("sidebar-backdrop"),
    spaceFilter: document.getElementById("space-filter"),
    profileSpaceList: document.getElementById("profile-space-list"),
    projectSpaceList: document.getElementById("project-space-list"),
    projectsCount: document.getElementById("projects-count"),
    activeToggleBtn: document.getElementById("active-toggle-btn"),
    stateToggleLabel: document.getElementById("state-toggle-label"),
    langToggleBtn: document.getElementById("lang-toggle-btn"),
    paneLiveDot: document.getElementById("pane-live-dot"),
    paneAgentLabel: document.getElementById("pane-agent-label"),
    paneCwd: document.getElementById("pane-cwd"),
    paneBranchChip: document.getElementById("pane-branch-chip"),
    paneBorderActions: document.getElementById("pane-border-actions"),
    terminalScroll: document.getElementById("terminal-scroll"),
    terminalContent: document.getElementById("terminal-content"),
    terminalPromptForm: document.getElementById("terminal-prompt-form"),
    terminalCmdInput: document.getElementById("terminal-cmd-input"),
    promptFeedback: document.getElementById("prompt-feedback"),
    statuslineLogoSlot: document.getElementById("statusline-logo-slot"),
    statuslineRows: document.getElementById("statusline-rows"),
  };

  function esc(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function t(val) {
    if (val && typeof val === "object" && ("ko" in val || "en" in val)) {
      return val[state.lang] ?? val.ko ?? "";
    }
    return String(val ?? "");
  }

  function getSelectedItem() {
    return ALL_ITEMS.find((item) => item.id === state.selectedId) || PROJECTS[0];
  }

  function buildBarHtml(pct, width = 6, tone = "usage") {
    const clamped = Math.max(0, Math.min(100, Math.round(pct)));
    const halfCells = Math.floor((clamped * width * 2 * 2 + 100) / 200);
    const full = Math.floor(halfCells / 2);
    const hasHalf = halfCells % 2 === 1;
    const filled = "━".repeat(full) + (hasHalf ? "╸" : "");
    const used = full + (hasHalf ? 1 : 0);
    const empty = "·".repeat(Math.max(0, width - used));

    let colorClass = "c-blue";
    if (tone === "health") {
      if (clamped >= 70) colorClass = "c-green";
      else if (clamped >= 40) colorClass = "c-teal";
      else colorClass = "c-yellow";
    } else if (clamped >= 90) {
      colorClass = "c-red";
    } else if (clamped >= 70) {
      colorClass = "c-orange";
    } else if (clamped >= 50) {
      colorClass = "c-yellow";
    }

    return `<span class="${colorClass}">${filled}</span><span class="c-muted">${empty}</span>`;
  }

  function renderClawdSvg(active) {
    const uid = "clawd-hero";
    const activeAttr = active ? ' data-active=""' : "";
    return `<svg viewBox="0 0 42 42"${activeAttr} role="img" aria-label="Claude Clawd logo">
      <defs>
        <clipPath id="${uid}-torso"><path d="M8 11H34V27H8Z" /></clipPath>
        <filter id="${uid}-glow" x="-35%" y="-35%" width="170%" height="170%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <linearGradient id="${uid}-body" x1="8" y1="11" x2="34" y2="27" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#F09676" />
          <stop offset="52%" stop-color="#D77757" />
          <stop offset="100%" stop-color="#B55437" />
        </linearGradient>
        <linearGradient id="${uid}-arm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#DF8160" />
          <stop offset="100%" stop-color="#9E442A" />
        </linearGradient>
        <linearGradient id="${uid}-leg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#9C4128" />
          <stop offset="32%" stop-color="#BC583B" />
          <stop offset="100%" stop-color="#7E2E1A" />
        </linearGradient>
        <linearGradient id="${uid}-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#FFF5EE" stop-opacity="0" />
          <stop offset="35%" stop-color="#FFF5EE" stop-opacity="0.16" />
          <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.54" />
          <stop offset="68%" stop-color="#FFD6C2" stop-opacity="0.16" />
          <stop offset="100%" stop-color="#FFF5EE" stop-opacity="0" />
        </linearGradient>
      </defs>
      <ellipse class="clawd-mascot-shadow" cx="21" cy="33.6" rx="13.5" ry="2.1" fill="#2A120A" opacity="0.22" />
      <path d="${CLAWD_BODY_PATH}" fill="#E07A57" filter="url(#${uid}-glow)" opacity="0.46" />
      <g class="clawd-mascot-float">
        <g class="clawd-legs-a">
          <rect x="8" y="25.8" width="2.5" height="5.2" rx="0.35" fill="url(#${uid}-leg)" />
          <rect x="8" y="27" width="2.5" height="1" fill="#742B17" opacity="0.55" />
          <rect x="27.5" y="25.8" width="2.5" height="5.2" rx="0.35" fill="url(#${uid}-leg)" />
          <rect x="27.5" y="27" width="2.5" height="1" fill="#742B17" opacity="0.55" />
        </g>
        <g class="clawd-legs-b">
          <rect x="12" y="25.8" width="2.5" height="5.2" rx="0.35" fill="url(#${uid}-leg)" />
          <rect x="12" y="27" width="2.5" height="1" fill="#742B17" opacity="0.55" />
          <rect x="31.5" y="25.8" width="2.5" height="5.2" rx="0.35" fill="url(#${uid}-leg)" />
          <rect x="31.5" y="27" width="2.5" height="1" fill="#742B17" opacity="0.55" />
        </g>
        <g class="clawd-arm-l">
          <rect x="4" y="19" width="4.5" height="4" rx="0.35" fill="url(#${uid}-arm)" />
          <rect x="4" y="19" width="4" height="0.9" fill="#F5AE93" opacity="0.7" />
          <rect x="4" y="22.1" width="4" height="0.9" fill="#7E2F1A" opacity="0.72" />
        </g>
        <g class="clawd-arm-r">
          <rect x="33.5" y="19" width="4.5" height="4" rx="0.35" fill="url(#${uid}-arm)" />
          <rect x="34" y="19" width="4" height="0.9" fill="#F5AE93" opacity="0.48" />
          <rect x="37.1" y="19" width="0.9" height="4" fill="#7E2F1A" opacity="0.68" />
          <rect x="34" y="22.1" width="4" height="0.9" fill="#7E2F1A" opacity="0.78" />
        </g>
        <g clip-path="url(#${uid}-torso)">
          <rect x="8" y="11" width="26" height="16" fill="url(#${uid}-body)" />
          <path d="M8 11H34L32.4 12.6H9.6Z" fill="#FAD8C8" opacity="0.62" />
          <path d="M8 11L9.6 12.6V25.4L8 27Z" fill="#F5AE93" opacity="0.42" />
          <path d="M34 11V27L32.4 25.4V12.6Z" fill="#8B3720" opacity="0.58" />
          <path d="M9.6 25.4H32.4L34 27H8Z" fill="#7E2F1A" opacity="0.64" />
          <g transform="rotate(-24 21 19)">
            <rect class="clawd-mascot-sheen" x="-26" y="3" width="14" height="32" fill="url(#${uid}-sheen)" />
          </g>
        </g>
        <g class="clawd-mascot-eyes">
          <rect x="11.75" y="14.6" width="2.8" height="4.6" rx="0.35" fill="#09090B" />
          <rect x="27.45" y="14.6" width="2.8" height="4.6" rx="0.35" fill="#09090B" />
          <rect x="12.15" y="15.05" width="0.95" height="0.95" rx="0.18" fill="#FFF5EE" opacity="0.88" />
          <rect x="27.85" y="15.05" width="0.95" height="0.95" rx="0.18" fill="#FFF5EE" opacity="0.88" />
        </g>
      </g>
    </svg>`;
  }

  function renderAgySvg(active) {
    const uid = "agy-hero";
    const activeAttr = active ? ' data-active=""' : "";
    return `<svg viewBox="0 0 112 112"${activeAttr} role="img" aria-label="Antigravity logo">
      <defs>
        <clipPath id="${uid}-clip"><path d="${AGY_ARCH_PATH}" /></clipPath>
        <filter id="${uid}-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <radialGradient id="${uid}-red" cx="56" cy="24" r="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#EA4335" stop-opacity="1" />
          <stop offset="48%" stop-color="#EA4335" stop-opacity="0.72" />
          <stop offset="100%" stop-color="#EA4335" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="${uid}-yellow" cx="37" cy="50" r="27" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#FBBC04" stop-opacity="1" />
          <stop offset="50%" stop-color="#FBBC04" stop-opacity="0.68" />
          <stop offset="100%" stop-color="#FBBC04" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="${uid}-green" cx="31" cy="71" r="28" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#34A853" stop-opacity="0.95" />
          <stop offset="55%" stop-color="#34A853" stop-opacity="0.5" />
          <stop offset="100%" stop-color="#34A853" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="${uid}-violet" cx="74" cy="48" r="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#9358F7" stop-opacity="0.85" />
          <stop offset="55%" stop-color="#7B61FF" stop-opacity="0.4" />
          <stop offset="100%" stop-color="#4285F4" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="${uid}-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0" />
          <stop offset="32%" stop-color="#FFFFFF" stop-opacity="0.16" />
          <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.82" />
          <stop offset="68%" stop-color="#D2E3FC" stop-opacity="0.22" />
          <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
        </linearGradient>
        <radialGradient id="${uid}-glint" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.68" />
          <stop offset="42%" stop-color="#FFF8E1" stop-opacity="0.28" />
          <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0" />
        </radialGradient>
      </defs>
      <g class="agy-logo-halo" filter="url(#${uid}-glow)">
        <path d="${AGY_ARCH_PATH}" fill="#4285F4" />
        <path d="${AGY_ARCH_PATH}" fill="url(#${uid}-green)" />
        <path d="${AGY_ARCH_PATH}" fill="url(#${uid}-yellow)" />
        <path d="${AGY_ARCH_PATH}" fill="url(#${uid}-violet)" />
        <path d="${AGY_ARCH_PATH}" fill="url(#${uid}-red)" />
      </g>
      <g>
        <circle class="agy-logo-mote-a" cx="50" cy="90" r="2.6" fill="#669DF6" />
        <circle class="agy-logo-mote-b" cx="62" cy="92" r="2.1" fill="#8AB4F8" />
      </g>
      <g class="agy-logo-levitate">
        <g clip-path="url(#${uid}-clip)">
          <rect x="0" y="0" width="112" height="112" fill="#4285F4" />
          <rect x="0" y="0" width="112" height="112" fill="url(#${uid}-green)" />
          <rect x="0" y="0" width="112" height="112" fill="url(#${uid}-yellow)" />
          <rect x="0" y="0" width="112" height="112" fill="url(#${uid}-violet)" />
          <rect x="0" y="0" width="112" height="112" fill="url(#${uid}-red)" />
          <circle class="agy-logo-glint" cx="56" cy="40" r="28" fill="url(#${uid}-glint)" />
          <g transform="rotate(-24 56 56)">
            <rect class="agy-logo-sheen" x="-92" y="-28" width="52" height="168" fill="url(#${uid}-sheen)" />
          </g>
        </g>
        <path d="${AGY_ARCH_PATH}" fill="none" stroke="#FFFFFF" stroke-opacity="0.28" stroke-width="2.4" />
      </g>
    </svg>`;
  }

  function renderCustomSvg(kind, active) {
    const activeAttr = active ? ' data-active=""' : "";
    if (kind === "custom-soksak") {
      return `<svg viewBox="0 0 40 40"${activeAttr} role="img" aria-label="Soksak NPU icon">
        <g class="custom-logo-pulse">
          <rect x="4" y="6" width="32" height="24" rx="8" fill="#182232" stroke="#73daca" stroke-width="1.8" />
          <path d="M12 20v-4M16.5 23v-10M21 25v-14M25.5 22v-8M30 20v-4" stroke="#73daca" stroke-width="2.2" stroke-linecap="round" />
          <path d="M14 30l-3 5 7-5" fill="#182232" stroke="#73daca" stroke-width="1.6" stroke-linejoin="round" />
        </g>
      </svg>`;
    }
    if (kind === "custom-gemini") {
      return `<svg viewBox="0 0 40 40"${activeAttr} role="img" aria-label="Gemini remote Linux icon">
        <g class="custom-logo-pulse">
          <circle cx="20" cy="20" r="16" fill="#111827" stroke="#4796e3" stroke-width="1.5" />
          <path d="M20 7c0 7.2-5.8 13-13 13 7.2 0 13 5.8 13 13 0-7.2 5.8-13 13-13-7.2 0-13-5.8-13-13Z" fill="#8ab4f8" />
        </g>
      </svg>`;
    }
    if (kind === "custom-ts") {
      return `<svg viewBox="0 0 40 40"${activeAttr} role="img" aria-label="Tailscale gate icon">
        <g class="custom-logo-pulse">
          <path d="M20 4l12 5v9c0 8.2-5.1 14.6-12 18-6.9-3.4-12-9.8-12-18V9l12-5Z" fill="#121824" stroke="#73daca" stroke-width="1.8" />
          <circle cx="14" cy="17" r="2.1" fill="#73daca" />
          <circle cx="20" cy="17" r="2.1" fill="#7aa2f7" />
          <circle cx="26" cy="17" r="2.1" fill="#73daca" />
          <circle cx="20" cy="24" r="2.1" fill="#9ece6a" />
        </g>
      </svg>`;
    }
    return `<svg viewBox="0 0 40 40"${activeAttr} role="img" aria-label="Herdr mux icon">
      <g class="custom-logo-pulse">
        <rect x="4" y="6" width="32" height="28" rx="6" fill="#121622" stroke="#7aa2f7" stroke-width="1.8" />
        <path d="M12 16l6 4-6 4M21 24h7" stroke="#7aa2f7" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      </g>
    </svg>`;
  }

  function renderTabs() {
    els.topbarTabs.innerHTML = TABS.map((tab) => {
      const isActive = state.tab === tab.id;
      return `<button type="button" class="tab-chip${isActive ? " is-active" : ""}" data-tab="${tab.id}">
        <span class="tab-num">${tab.num}</span>
        <span>${esc(tab[state.lang])}</span>
      </button>`;
    }).join("");
  }

  function renderSpaceCard(item, indexBadge) {
    const isSelected = state.selectedId === item.id;
    const statusGlyph = state.active ? "●" : "○";
    const statusCls = state.active ? "is-working" : "is-idle";
    const idxHint = indexBadge ? `<span class="c-muted">${indexBadge}</span>` : "";

    return `<button
      type="button"
      class="space-card${isSelected ? " is-selected" : ""}"
      data-select-id="${esc(item.id)}"
      role="option"
      aria-selected="${isSelected ? "true" : "false"}"
    >
      <div class="space-card-row1">
        <span class="space-card-title-group">
          <span class="status-symbol ${statusCls}" aria-hidden="true">${statusGlyph}</span>
          <span class="space-name">${esc(item.name)}</span>
          ${idxHint}
        </span>
        <span class="space-agent-badge ${item.badgeClass}">${esc(item.badge)}</span>
      </div>
      <div class="space-card-row2">
        <span class="space-sub">${esc(t(item.sub))}</span>
        <span class="space-branch">⎇ ${esc(item.branch)}</span>
      </div>
    </button>`;
  }

  function renderSidebar() {
    const q = state.filter.trim().toLowerCase();
    els.profileSpaceList.innerHTML = renderSpaceCard(PROFILE_ENTRY, "~");

    const filtered = PROJECTS.filter((p) => {
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.badge.toLowerCase().includes(q) ||
        t(p.sub).toLowerCase().includes(q) ||
        p.stack.some((s) => s.toLowerCase().includes(q))
      );
    });

    els.projectsCount.textContent = `${filtered.length}/${PROJECTS.length} ACTIVE`;
    if (filtered.length === 0) {
      els.projectSpaceList.innerHTML = `<div class="c-muted" style="padding:10px;font-size:11.5px;">no matching spaces</div>`;
    } else {
      els.projectSpaceList.innerHTML = filtered
        .map((p) => renderSpaceCard(p, String(PROJECTS.indexOf(p) + 1)))
        .join("");
    }
  }

  function renderPaneBorder(item) {
    els.paneLiveDot.style.background = state.active ? "var(--accent-green)" : "var(--text-dim)";
    els.paneAgentLabel.textContent = item.agent;
    els.paneCwd.textContent = item.cwd;
    els.paneBranchChip.textContent = `⎇ ${item.branch}`;

    const actions = [];
    if (item.siteUrl) {
      actions.push(
        `<a class="pane-action-btn is-primary" href="${esc(item.siteUrl)}" target="_blank" rel="noopener noreferrer">Live Site ↗</a>`
      );
    }
    actions.push(
      `<a class="pane-action-btn" href="${esc(item.repoUrl)}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>`
    );
    els.paneBorderActions.innerHTML = actions.join("");
  }

  function renderTerminalBody(item) {
    const cmdLine =
      item.id === "profile"
        ? `cat ~/KyongSik-Yoon/README.md && herdr spaces --all`
        : `cd ${item.cwd} && cat README.md`;

    const profileExtras =
      item.id === "profile"
        ? `<div class="term-section">
            <div class="term-section-heading">${state.lang === "ko" ? "프로필 & AI 토큰 사용량 카드" : "Profile & AI Usage Telemetry"}</div>
            <div class="profile-card-wrap profile-header-card" style="margin-bottom:10px;">
              <img class="profile-avatar" src="https://raw.githubusercontent.com/KyongSik-Yoon/KyongSik-Yoon/main/sam.png" alt="KyongSik Yoon" />
              <div>
                <div class="c-white" style="font-size:15px;font-weight:700;">KyongSik Yoon (sam)</div>
                <div class="c-dim" style="font-size:12px;">${state.lang === "ko" ? "AI 에이전트 하네스 · CLI 패처 · 분산 시스템 개발자" : "AI Agent Harness · Binary Patcher · Systems Engineer"}</div>
              </div>
            </div>
            <div class="profile-card-wrap">
              <img src="https://raw.githubusercontent.com/KyongSik-Yoon/KyongSik-Yoon/main/cards/ai-usage-full.svg" alt="AI usage" />
            </div>
          </div>`
        : "";

    const simSection = item.simPreview
      ? `<div class="term-section">
          <div class="term-section-heading">${state.lang === "ko" ? "Claude Code 데스크톱 모드 미리보기" : "Claude Desktop Mode Preview"}</div>
          <div class="term-box">
            <div class="term-box-header">
              <span>cc-desktop-mod · desk-look pane</span>
              <span class="c-teal">inline VT100</span>
            </div>
            <div style="padding:12px 14px;">
              <div class="sim-bubble">${esc(item.simPreview.prompt)}</div>
              <div class="sim-fold">${esc(item.simPreview.fold)}</div>
              <pre class="term-pre" style="padding:8px 0;">${esc(item.simPreview.answer)}</pre>
              <div class="sim-progress-band">
                <span class="c-green">${esc(item.simPreview.band)}</span>
              </div>
            </div>
          </div>
        </div>`
      : "";

    const showOverview = state.tab === "overview";
    const showDemo = state.tab === "overview" || state.tab === "demo";
    const showArch = state.tab === "overview" || state.tab === "architecture";

    const featuresHtml = showOverview
      ? `<div class="term-section">
          <div class="term-section-heading">${state.lang === "ko" ? "핵심 기능" : "Key Capabilities"}</div>
          <div class="feature-grid">
            ${item.features
              .map(
                (f) => `<article class="feature-item">
                  <div class="feature-title">${esc(t(f.title))}</div>
                  <p class="feature-desc">${esc(t(f.desc))}</p>
                </article>`
              )
              .join("")}
          </div>
        </div>`
      : "";

    const demoHtml = showDemo
      ? `${simSection}
        <div class="term-section">
          <div class="term-section-heading">${state.lang === "ko" ? "설치 및 실행" : "Install & Quickstart"}</div>
          <div class="term-box">
            <div class="term-box-header">
              <span>${esc(item.cliBlockTitle)}</span>
              <button type="button" class="copy-btn" data-copy="${esc(item.installCmd)}">⧉ copy command</button>
            </div>
            <pre class="term-pre">${esc(item.cliSnippet)}</pre>
          </div>
        </div>`
      : "";

    const archHtml = showArch
      ? `<div class="term-section">
          <div class="term-section-heading">${state.lang === "ko" ? "동작 흐름" : "Architecture Flow"}</div>
          <div class="term-box">
            <div class="arch-flow">
              ${item.archNodes
                .map(
                  (node, idx) =>
                    `<span class="arch-node">${esc(node)}</span>${
                      idx < item.archNodes.length - 1 ? `<span class="arch-arrow" aria-hidden="true">→</span>` : ""
                    }`
                )
                .join("")}
            </div>
          </div>
        </div>`
      : "";

    els.terminalContent.innerHTML = `
      <div class="term-cmd-echo">
        <span class="term-cmd-prompt">sam@omarchy</span>
        <span class="c-muted">:</span>
        <span class="c-cyan">${esc(item.cwd)}</span>
        <span class="c-muted">$</span>
        <span class="term-cmd-text">${esc(cmdLine)}</span>
      </div>

      <div class="term-hero-block">
        <div class="term-title-row">
          <h1 class="term-project-title">${esc(item.name)}</h1>
          <span class="term-project-sub">${esc(t(item.sub))}</span>
        </div>
        <p class="term-summary">${esc(t(item.summary))}</p>
        <div class="term-badge-row">
          <span class="term-badge is-highlight">agent:${esc(item.agent)}</span>
          ${item.stack.map((s) => `<span class="term-badge">${esc(s)}</span>`).join("")}
        </div>
      </div>

      ${profileExtras}
      ${featuresHtml}
      ${demoHtml}
      ${archHtml}
    `;

    els.terminalScroll.scrollTop = 0;
  }

  function renderStatusline(item) {
    const sl = item.statusline;
    let logoHtml = "";
    let rowsHtml = "";

    if (sl.type === "claude") {
      logoHtml = renderClawdSvg(state.active);
      const r1 = sl.row1;
      const r2 = sl.row2;
      const r3 = sl.row3;
      const ahead = r1.ahead ? ` <span class="c-yellow">↑${r1.ahead}f</span>` : "";

      rowsHtml = `
        <div class="statusline-row"><span class="c-blue">${esc(r1.model)}</span> <span class="c-yellow">${esc(r1.effort)}</span> <span class="c-dim">│</span> <span class="c-cyan">${esc(r1.dir)}</span> <span class="c-green">(${esc(r1.branch.replace("*", ""))}${r1.branch.endsWith("*") ? `<span class="c-red">*</span>` : ""}${ahead})</span> <span class="c-dim">│</span> <span class="c-white">context</span> ${buildBarHtml(r1.ctxPct, 6)} <span class="c-white">${r1.ctxPct}%</span> <span class="c-dim">│ ⏱</span> <span class="c-white">${esc(r1.duration)}</span></div>
        <div class="statusline-row"><span class="c-dim">├─</span> <span class="c-clawd">claude</span> <span class="c-white">5h</span> ${buildBarHtml(r2.p5, 6)} <span class="c-white">${String(r2.p5).padStart(3, " ")}%</span> <span class="c-dim">${esc(r2.t5)}</span> <span class="c-dim">·</span> <span class="c-white">7d</span> ${buildBarHtml(r2.p7, 6)} <span class="c-white">${String(r2.p7).padStart(3, " ")}%</span> <span class="c-dim">${esc(r2.t7)}</span> <span class="c-dim">·</span> <span class="c-magenta">${esc(r2.scopedName)}</span> ${buildBarHtml(r2.scopedPct, 6)} <span class="c-white">${r2.scopedPct}%</span> <span class="c-dim">· advisor</span> <span class="c-white">${r2.advisorCalls}</span><span class="c-dim"> calls</span> <span class="c-white">${esc(r2.advisorTokens)}</span><span class="c-dim"> tok</span></div>
        <div class="statusline-row"><span class="c-dim">└─</span> <span class="c-clawd">codex </span> <span class="c-white">5h</span> ${buildBarHtml(r3.p5, 6)} <span class="c-white">${String(r3.p5).padStart(3, " ")}%</span> <span class="c-dim">${esc(r3.t5)}</span> <span class="c-dim">·</span> <span class="c-white">7d</span> ${buildBarHtml(r3.p7, 6)} <span class="c-white">${String(r3.p7).padStart(3, " ")}%</span> <span class="c-dim">${esc(r3.t7)}</span></div>
      `;
    } else if (sl.type === "agy") {
      logoHtml = renderAgySvg(state.active);
      const r1 = sl.row1;
      const r2 = sl.row2;
      const r3 = sl.row3;
      const r4 = sl.row4;
      const ahead = r1.ahead ? ` <span class="c-yellow">↑${r1.ahead}f</span>` : "";
      const hasDirty = r1.branch.endsWith("*");
      const branchClean = hasDirty ? r1.branch.slice(0, -1) : r1.branch;
      const prColor = r4.state === "merged" ? "c-magenta" : "c-teal";

      rowsHtml = `
        <div class="statusline-row"><span class="c-blue">${esc(r1.model)}</span> <span class="c-yellow">${esc(r1.effort)}</span> <span class="c-dim">│</span> <span class="c-cyan">${esc(r1.dir)}</span> <span class="c-green">(${esc(branchClean)}${hasDirty ? `<span class="c-red">*</span>` : ""}${ahead})</span> <span class="c-dim">│</span> <span class="c-white">context</span> ${buildBarHtml(r1.ctxPct, 6)} <span class="c-white">${r1.ctxPct}%</span> <span class="c-dim">│ ⏱</span> <span class="c-white">${esc(r1.duration)}</span></div>
        <div class="statusline-row"><span class="c-dim">├─</span> <span class="c-gem-blue">gemini</span> <span class="c-white">5h</span> ${buildBarHtml(r2.p5, 6)} <span class="c-white">${String(r2.p5).padStart(3, " ")}%</span> <span class="c-dim">${esc(r2.t5)}</span> <span class="c-dim">·</span> <span class="c-white">7d</span> ${buildBarHtml(r2.p7, 6)} <span class="c-white">${String(r2.p7).padStart(3, " ")}%</span> <span class="c-dim">${esc(r2.t7)}</span></div>
        <div class="statusline-row"><span class="c-dim">└─</span> <span class="c-gem-purple">3p    </span> <span class="c-white">5h</span> ${buildBarHtml(r3.p5, 6)} <span class="c-white">${String(r3.p5).padStart(3, " ")}%</span> <span class="c-dim">${esc(r3.t5)}</span> <span class="c-dim">·</span> <span class="c-white">7d</span> ${buildBarHtml(r3.p7, 6)} <span class="c-white">${String(r3.p7).padStart(3, " ")}%</span> <span class="c-dim">${esc(r3.t7)}</span></div>
        <div class="statusline-row"><span class="${prColor}">${esc(r4.pr)} ${esc(r4.state)} · ${esc(r4.title)}</span></div>
      `;
    } else if (sl.type === "custom-soksak") {
      logoHtml = renderCustomSvg(sl.type, state.active);
      rowsHtml = `
        <div class="statusline-row"><span class="c-teal">${esc(sl.row1.model)}</span> <span class="c-green">${esc(sl.row1.engine)}</span> <span class="c-dim">│</span> <span class="c-white">latency</span> ${buildBarHtml(sl.row1.rtfPct, 6)} <span class="c-white">${esc(sl.row1.rtfLabel)}</span> <span class="c-dim">│</span> <span class="c-cyan">${esc(sl.row1.target)}</span></div>
        <div class="statusline-row"><span class="c-dim">├─</span> <span class="c-teal">${esc(sl.row2.label)}</span> <span class="c-white">voice</span> ${buildBarHtml(sl.row2.p5, 6, "health")} <span class="c-dim">${esc(sl.row2.t5)}</span> <span class="c-dim">·</span> <span class="c-white">floor</span> ${buildBarHtml(sl.row2.p7, 6)} <span class="c-dim">${esc(sl.row2.t7)}</span></div>
        <div class="statusline-row"><span class="c-dim">└─</span> <span class="c-teal">${esc(sl.row3.label)}</span> <span class="c-green">${esc(sl.row3.host)}</span> <span class="c-dim">·</span> <span class="c-yellow">${esc(sl.row3.autoEnter)}</span> <span class="c-dim">·</span> <span class="c-white">${esc(sl.row3.vocab)}</span></div>
      `;
    } else if (sl.type === "custom-gemini") {
      logoHtml = renderCustomSvg(sl.type, state.active);
      rowsHtml = `
        <div class="statusline-row"><span class="c-gem-blue">${esc(sl.row1.model)}</span> <span class="c-cyan">${esc(sl.row1.proto)}</span> <span class="c-dim">│</span> <span class="c-white">rtt</span> ${buildBarHtml(sl.row1.rttPct, 6)} <span class="c-white">${esc(sl.row1.rttLabel)}</span> <span class="c-dim">│</span> <span class="c-green">${esc(sl.row1.host)}</span></div>
        <div class="statusline-row"><span class="c-dim">├─</span> <span class="c-gem-blue">${esc(sl.row2.label)}</span>  <span class="c-white">sync</span> ${buildBarHtml(sl.row2.p5, 6, "health")} <span class="c-green">${esc(sl.row2.t5)}</span> <span class="c-dim">·</span> <span class="c-white">mounts</span> ${buildBarHtml(sl.row2.p7, 6)} <span class="c-white">${esc(sl.row2.t7)}</span></div>
        <div class="statusline-row"><span class="c-dim">└─</span> <span class="c-gem-purple">${esc(sl.row3.label)}</span> <span class="c-white">${esc(sl.row3.compositor)}</span> <span class="c-dim">·</span> <span class="c-teal">${esc(sl.row3.mcp)}</span></div>
      `;
    } else if (sl.type === "custom-ts") {
      logoHtml = renderCustomSvg(sl.type, state.active);
      rowsHtml = `
        <div class="statusline-row"><span class="c-teal">${esc(sl.row1.model)}</span> <span class="c-green">${esc(sl.row1.mode)}</span> <span class="c-dim">│</span> <span class="c-white">ttl</span> ${buildBarHtml(sl.row1.ttlPct, 6)} <span class="c-white">${esc(sl.row1.ttlLabel)}</span> <span class="c-dim">│</span> <span class="c-red">${esc(sl.row1.funnel)}</span></div>
        <div class="statusline-row"><span class="c-dim">├─</span> <span class="c-teal">${esc(sl.row2.label)}</span> <span class="c-white">temp</span> ${buildBarHtml(sl.row2.p5, 6)} <span class="c-white">${esc(sl.row2.t5)}</span> <span class="c-dim">·</span> <span class="c-white">keep</span> ${buildBarHtml(sl.row2.p7, 6, "health")} <span class="c-green">${esc(sl.row2.t7)}</span></div>
        <div class="statusline-row"><span class="c-dim">└─</span> <span class="c-teal">${esc(sl.row3.label)}</span> <span class="c-green">${esc(sl.row3.boot)}</span> <span class="c-dim">·</span> <span class="c-dim">${esc(sl.row3.state)}</span></div>
      `;
    } else {
      logoHtml = renderCustomSvg("custom-herdr", state.active);
      rowsHtml = `
        <div class="statusline-row"><span class="c-blue">${esc(sl.row1.model)}</span> <span class="c-yellow">${esc(sl.row1.tag)}</span> <span class="c-dim">│</span> <span class="c-cyan">${esc(sl.row1.dir)}</span> <span class="c-green">(${esc(sl.row1.branch)})</span> <span class="c-dim">│</span> <span class="c-white">context</span> ${buildBarHtml(sl.row1.ctxPct, 6)} <span class="c-white">${sl.row1.ctxPct}%</span> <span class="c-dim">│</span> <span class="c-teal">${esc(sl.row1.extra)}</span></div>
        <div class="statusline-row"><span class="c-dim">├─</span> <span class="c-clawd">${esc(sl.row2.label)}</span> <span class="c-white">5h</span> ${buildBarHtml(sl.row2.p5, 6)} <span class="c-white">${String(sl.row2.p5).padStart(3, " ")}%</span> <span class="c-dim">${esc(sl.row2.t5)}</span> <span class="c-dim">·</span> <span class="c-white">7d</span> ${buildBarHtml(sl.row2.p7, 6)} <span class="c-white">${String(sl.row2.p7).padStart(3, " ")}%</span> <span class="c-dim">${esc(sl.row2.t7)} · ${esc(sl.row2.extra)}</span></div>
        <div class="statusline-row"><span class="c-dim">└─</span> <span class="c-gem-blue">${esc(sl.row3.label)}</span> <span class="c-white">5h</span> ${buildBarHtml(sl.row3.p5, 6)} <span class="c-white">${String(sl.row3.p5).padStart(3, " ")}%</span> <span class="c-dim">${esc(sl.row3.t5)}</span> <span class="c-dim">·</span> <span class="c-white">7d</span> ${buildBarHtml(sl.row3.p7, 6)} <span class="c-white">${String(sl.row3.p7).padStart(3, " ")}%</span> <span class="c-dim">${esc(sl.row3.t7)} · ${esc(sl.row3.extra)}</span></div>
      `;
    }

    els.statuslineLogoSlot.innerHTML = logoHtml;
    els.statuslineRows.innerHTML = rowsHtml;
  }

  function renderTopControls() {
    els.activeToggleBtn.setAttribute("aria-pressed", state.active ? "true" : "false");
    els.stateToggleLabel.textContent = state.active ? "working" : "idle";
    els.langToggleBtn.textContent = state.lang.toUpperCase();
  }

  function setSidebarOpen(open) {
    state.sidebarOpen = open;
    els.sidebar.classList.toggle("is-open", open);
    els.sidebarBackdrop.hidden = !open;
    els.mobileMenuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }

  function selectItem(id, updateHash = true) {
    if (!ALL_ITEMS.some((it) => it.id === id)) return;
    state.selectedId = id;
    if (updateHash && window.location.hash !== `#${id}`) {
      history.replaceState(null, "", `#${id}`);
    }
    setSidebarOpen(false);
    render();
  }

  function setPromptFeedback(msg) {
    els.promptFeedback.textContent = msg;
    if (!msg) return;
    window.setTimeout(() => {
      if (els.promptFeedback.textContent === msg) {
        els.promptFeedback.textContent = "";
      }
    }, 3200);
  }

  function handleCommand(raw) {
    const cmd = raw.trim();
    if (!cmd) return;
    const parts = cmd.split(/\s+/);
    const head = parts[0].toLowerCase();
    const arg = parts.slice(1).join(" ").toLowerCase();

    if (head === "help" || head === "?") {
      setPromptFeedback("cmds: open <name>, profile, toggle, ko/en, github, site");
      return;
    }
    if (head === "ls") {
      setPromptFeedback(PROJECTS.map((p) => p.id).join(" · "));
      return;
    }
    if (head === "profile" || head === "home" || head === "~") {
      selectItem("profile");
      setPromptFeedback("switched -> profile");
      return;
    }
    if (head === "toggle" || head === "anim") {
      state.active = !state.active;
      render();
      setPromptFeedback(`status: ${state.active ? "working" : "idle"}`);
      return;
    }
    if (head === "ko" || head === "en") {
      state.lang = head;
      render();
      setPromptFeedback(`lang: ${head.toUpperCase()}`);
      return;
    }
    if (head === "github") {
      window.open(getSelectedItem().repoUrl, "_blank", "noopener,noreferrer");
      setPromptFeedback("opened GitHub ↗");
      return;
    }
    if (head === "site") {
      const target = getSelectedItem().siteUrl || getSelectedItem().repoUrl;
      window.open(target, "_blank", "noopener,noreferrer");
      setPromptFeedback("opened site ↗");
      return;
    }
    if (head === "open" || head === "cd") {
      const match = ALL_ITEMS.find(
        (it) => it.id.toLowerCase() === arg || it.name.toLowerCase().includes(arg)
      );
      if (match) {
        selectItem(match.id);
        setPromptFeedback(`opened ${match.name}`);
      } else {
        setPromptFeedback(`unknown space: ${arg}`);
      }
      return;
    }
    const direct = ALL_ITEMS.find((it) => it.id.toLowerCase() === head);
    if (direct) {
      selectItem(direct.id);
      setPromptFeedback(`opened ${direct.name}`);
      return;
    }
    setPromptFeedback(`unknown cmd '${head}' (try 'help')`);
  }

  function render() {
    const item = getSelectedItem();
    renderTopControls();
    renderTabs();
    renderSidebar();
    renderPaneBorder(item);
    renderTerminalBody(item);
    renderStatusline(item);
  }

  function syncFromHash() {
    const hash = window.location.hash.replace(/^#/, "").trim();
    if (hash && ALL_ITEMS.some((it) => it.id === hash)) {
      state.selectedId = hash;
    }
  }

  document.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;

    const spaceBtn = target.closest("[data-select-id]");
    if (spaceBtn) {
      selectItem(spaceBtn.getAttribute("data-select-id"));
      return;
    }

    const tabBtn = target.closest("[data-tab]");
    if (tabBtn) {
      state.tab = tabBtn.getAttribute("data-tab") || "overview";
      render();
      return;
    }

    const copyBtn = target.closest("[data-copy]");
    if (copyBtn) {
      const text = copyBtn.getAttribute("data-copy") || "";
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          copyBtn.textContent = "✓ copied";
          window.setTimeout(() => {
            copyBtn.textContent = "⧉ copy command";
          }, 1600);
        });
      }
      return;
    }
  });

  els.brandHomeBtn.addEventListener("click", () => selectItem("profile"));
  els.mobileMenuBtn.addEventListener("click", () => setSidebarOpen(!state.sidebarOpen));
  els.sidebarBackdrop.addEventListener("click", () => setSidebarOpen(false));

  els.activeToggleBtn.addEventListener("click", () => {
    state.active = !state.active;
    render();
  });

  els.langToggleBtn.addEventListener("click", () => {
    state.lang = state.lang === "ko" ? "en" : "ko";
    render();
  });

  els.spaceFilter.addEventListener("input", (e) => {
    state.filter = e.target.value || "";
    renderSidebar();
  });

  els.terminalPromptForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = els.terminalCmdInput.value;
    els.terminalCmdInput.value = "";
    handleCommand(val);
  });

  document.addEventListener("keydown", (e) => {
    const activeEl = document.activeElement;
    const isInput =
      activeEl instanceof HTMLInputElement || activeEl instanceof HTMLTextAreaElement;

    if (e.key === "Escape") {
      if (isInput) activeEl.blur();
      setSidebarOpen(false);
      return;
    }

    if (isInput) return;

    if (e.key === "/") {
      e.preventDefault();
      if (window.innerWidth <= 820) setSidebarOpen(true);
      els.spaceFilter.focus();
      return;
    }

    if (/^[1-6]$/.test(e.key)) {
      const proj = PROJECTS[Number(e.key) - 1];
      if (proj) selectItem(proj.id);
      return;
    }

    if (e.key === "0" || e.key === "~") {
      selectItem("profile");
      return;
    }

    if (e.key === "j" || e.key === "ArrowDown") {
      e.preventDefault();
      const idx = ALL_ITEMS.findIndex((it) => it.id === state.selectedId);
      const next = ALL_ITEMS[(idx + 1) % ALL_ITEMS.length];
      if (next) selectItem(next.id);
      return;
    }

    if (e.key === "k" || e.key === "ArrowUp") {
      e.preventDefault();
      const idx = ALL_ITEMS.findIndex((it) => it.id === state.selectedId);
      const prev = ALL_ITEMS[(idx - 1 + ALL_ITEMS.length) % ALL_ITEMS.length];
      if (prev) selectItem(prev.id);
    }
  });

  window.addEventListener("hashchange", () => {
    syncFromHash();
    render();
  });

  syncFromHash();
  render();
})();
