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
          ko: "Claude Code(cc-desktop-mod)와 Antigravity CLI(agy-cli-patch)의 출력 렌더링, 상태줄, 사이드 패인을 직접 개조해 장시간 세션 가독성을 극대화합니다.",
          en: "Customizes Claude Code and Antigravity CLI output rendering, statuslines, and side panes for long-running terminal workflows.",
        },
      },
      {
        title: { ko: "안전 게이트 & 모델 오케스트레이션", en: "Safety Gates & Model Routing" },
        desc: {
          ko: "Gemini Decisions API(agy-decision-lab)로 파괴적 셸 명령을 사전 차단하고 서브에이전트·스웜 모델을 작업 복잡도에 따라 동적으로 라우팅합니다.",
          en: "Gates destructive commands via Gemini Decisions API and dynamically routes subagent/swarm models by task complexity.",
        },
      },
      {
        title: { ko: "크로스 디바이스 연결 & 프라이버시", en: "Cross-Device Bridge & Privacy" },
        desc: {
          ko: "Tailscale 기반 임시 포트 게이트(ts-gate), Linux 원격 데몬(gemini-remote-linux), 온디바이스 음성 받아쓰기(soksak)로 안전한 개인 개발 환경을 구축합니다.",
          en: "Connects Android, Linux desktops, and tailnet services privately via ts-gate, gemini-remote-linux, and on-device soksak.",
        },
      },
    ],
    installCmd: "git clone https://github.com/KyongSik-Yoon/KyongSik-Yoon.git",
    cliBlockTitle: "workspace-index.sh",
    cliSnippet: `$ ls -1 ~/dev/git-repo | grep -E "cc-desktop|soksak|agy-|gemini-remote|ts-gate"
cc-desktop-mod      # Claude Code 데스크톱 스타일 플러그인 스위트
soksak              # Android 온디바이스 한국어 + 개발용어 음성 받아쓰기
agy-cli-patch       # Antigravity CLI(agy) 무의존성 동적 바이너리 패처
agy-decision-lab    # Gemini Decisions API 안전 게이트·스웜 라우터·MCP
gemini-remote-linux # Linux PC ↔ Gemini 모바일/웹 원격 제어 Go 데몬
ts-gate             # Tailnet 전용 일시 포트 게이트 & 자동 TTL 매니저`,
    archNodes: [
      "Android (soksak)",
      "Tailscale Mesh (ts-gate)",
      "Herdr Mux + Collie",
      "Claude / Antigravity CLI",
      "Decision Gate & Plugins",
    ],
    statusline: {
      type: "custom-herdr",
      row1: {
        model: "herdr[v0.9.5]",
        tag: "mux",
        ctxPct: 38,
        dir: "~/KyongSik-Yoon",
        branch: "main",
        extra: "6 spaces active",
      },
      row2: { label: "claude", p5: 18, t5: "3h12m", p7: 45, t7: "2d0h", extra: "cc-desktop-mod" },
      row3: { label: "gemini", p5: 24, t5: "2h45m", p7: 60, t7: "3d4h", extra: "agy-cli-patch · decision-lab" },
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
        ko: "Claude Code 데스크톱 UX 플러그인 스위트",
        en: "Claude Desktop UI mod & side-pane suite for Claude Code",
      },
      summary: {
        ko: "Claude Code 터미널 UI를 Claude 데스크톱 앱의 Code 탭 감각(프롬프트 말풍선, 상단 Progress Band, 접히는 도구 호출, 마크다운 테이블·Mermaid 렌더링, 사이드 패인)으로 탈바꿈시키는 TypeScript 플러그인 마켓플레이스입니다.",
        en: "Transforms the Claude Code terminal UI into a Claude Desktop-inspired workspace with prompt bubbles, a live Progress Band, folded tool runs, native Mermaid/table rendering, and interactive side panes.",
      },
      stack: ["TypeScript", "Node.js", "Claude Code Plugin API", "MIT"],
      features: [
        {
          title: { ko: "데스크톱 말풍선 & Progress Band", en: "Prompt Bubbles & Progress Band" },
          desc: {
            ko: "사용자 입력을 액센트 말풍선으로 구분하고, 에이전트 실행 중에는 현재 스텝·컨텍스트 게이지(◑ 42%)·Git 브랜치·백그라운드 태스크 칩을 상단 밴드에 고정 표시합니다.",
            en: "Styles prompts as accented bubbles and pins live step state, context percentage, branch, and background jobs in a compact Progress Band.",
          },
        },
        {
          title: { ko: "도구 호출 접기 & 리치 렌더링", en: "Folded Tool Calls & Rich Blocks" },
          desc: {
            ko: "장황한 도구 로그를 'Ran 2 commands, edited a file ›' 한 줄로 접어두고, 코드 복사 버튼(⧉ copy), 유니코드 박스 Mermaid 다이어그램, Alert 카드를 네이티브로 그립니다.",
            en: "Folds noisy tool invocations into single summary rows while rendering copyable code blocks, Mermaid box diagrams, and GitHub-style alerts.",
          },
        },
        {
          title: { ko: "전용 사이드 패인 생태계", en: "Integrated Side-Pane Ecosystem" },
          desc: {
            ko: "/desk-plan(플랜 승인 카드), /desk-review(리뷰·Diff 패인), /desk-asana(태스크 조회/댓글), /desk-slack(DM 패인) 플러그인을 한 번에 제공합니다.",
            en: "Includes /desk-plan, /desk-review, /desk-asana, and /desk-slack side panes tailored for terminal workflows.",
          },
        },
      ],
      installCmd: "/plugin install desk-look --marketplace KyongSik-Yoon/cc-desktop-mod",
      cliBlockTitle: "claude-code :: desk-look session",
      cliSnippet: `/plugin marketplace add KyongSik-Yoon/cc-desktop-mod
/plugin install desk-look@cc-desktop-mod
/plugin install desk-plan@cc-desktop-mod
/plugin install desk-review@cc-desktop-mod`,
      simPreview: {
        prompt: "❯ cc-desktop-mod의 Mermaid 렌더러와 diff 패인 구조 정리해줘",
        fold: "▸ Ran 2 commands, read 4 files ›  (src/render/mermaid.ts, src/panes/diff.ts)",
        answer: [
          "┌────────────────┐      ┌─────────────────┐",
          "│ Claude Hook    │─────▶│ Desk Look Strip │",
          "└────────────────┘      └────────┬────────┘",
          "                                 ▼",
          "                  [Prompt Bubble + Side Diff Pane]",
        ].join("\n"),
        band: "● step 3/3 · main · ctx ◑ 42% · PR !48 open · 0 bg jobs",
      },
      archNodes: [
        "Claude Code PTY / Hooks",
        "desk-look Renderer",
        "Bubble / Fold / Mermaid",
        "Side Pane (Plan · Diff · Asana · Slack)",
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
      cwd: "~/dev/git-repo/openWispr",
      branch: "main",
      agent: "soksak",
      repoUrl: "https://github.com/KyongSik-Yoon/soksak",
      siteUrl: "https://soksak.ksyoon.com/",
      sub: {
        ko: "속삭 — Android 온디바이스 한국어 + 개발용어 음성 받아쓰기",
        en: "Soksak — On-device Korean + dev-jargon Android voice dictation",
      },
      summary: {
        ko: "음성을 서버로 전혀 보내지 않고 기기 내부(whisper.cpp CPU 또는 Qualcomm Hexagon NPU)에서 한국어와 영어 개발 용어를 즉시 받아써 활성 입력창이나 Tailscale을 거쳐 PC 클립보드에 꽂아주는 Android 앱(OpenWispr 포크)입니다.",
        en: "100% offline Android voice dictation forked from OpenWispr. Recognizes mixed Korean and technical English terms via whisper.cpp or Qualcomm NPU, injects text without stealing focus, or forwards to PC over Tailscale.",
      },
      stack: ["Kotlin", "C++", "whisper.cpp", "sherpa-onnx + QNN", "CAM++ / VoxLock"],
      features: [
        {
          title: { ko: "플로팅 버블 & 자동 엔터(⏎)", en: "Floating Bubble & Auto-Enter (⏎)" },
          desc: {
            ko: "접근성 서비스를 이용해 어떤 앱에서도 포커스를 빼앗지 않고 글을 입력하며, 설정에 따라 1~5초 후 Enter까지 자동 전송해 모바일 에이전트 프롬프트를 손대지 않고 보냅니다.",
            en: "Injects dictated text via AccessibilityService without losing focus, with optional 1–5s auto-enter countdown rings for hands-free agent prompts.",
          },
        },
        {
          title: { ko: "CAM++ · VoxLock 내 목소리 분리", en: "CAM++ & VoxLock Speaker Isolation" },
          desc: {
            ko: "내 목소리를 등록하면 쉬는 틈의 TV·주변 대화 소음을 걸러내고, 시끄러운 환경에서는 NPU 기반 VoxLock으로 겹친 음성 중 내 발화만 분리해 냅니다.",
            en: "Registers speaker embeddings to reject background TV/voices and runs VoxLock NPU separation in noisy environments.",
          },
        },
        {
          title: { ko: "Qualcomm NPU & Tailscale PC 직송", en: "Hexagon NPU & Tailscale PC Daemon" },
          desc: {
            ko: "Snapdragon 8 Elite / Gen 5 QNN 번들로 Large v3 Turbo를 초고속 구동하며, 받아쓴 문장을 Tailscale 망을 통해 Linux 데스크톱 클립보드(soksak-daemon)로 바로 쏠 수 있습니다.",
            en: "Runs Whisper Large v3 Turbo on Snapdragon 8 Elite QNN NPU and optionally relays transcripts to soksak-daemon over Tailscale.",
          },
        },
      ],
      installCmd: "cd android && ./gradlew :app:assembleDebug :app:testDebugUnitTest",
      cliBlockTitle: "soksak-daemon :: android → linux tailnet relay",
      cliSnippet: `$ soksak-daemon status
● daemon listening on tailnet 100.64.x.y:48720 (TLS peer verified)
  model      : whisper-large-v3-turbo (QNN SM8850 NPU)
  speaker-id : CAM++ VoxLock armed (threshold 0.72)
  vocab-pack : korean-dev-terms + aliases (412 entries)

[14:22:08] rx "지금 herdr 사이드바에서 statusline 패치 적용해줘" -> wl-copy + paste (118ms)`,
      archNodes: [
        "Mic AudioRecord",
        "CAM++ / VoxLock Filter",
        "whisper.cpp / QNN NPU",
        "Dev Alias Correction",
        "Android Input / Tailnet PC",
      ],
      statusline: {
        type: "custom-soksak",
        row1: {
          model: "whisper-v3-turbo[qnn-npu]",
          engine: "SM8850",
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
          host: "sam@omarchy:48720",
          autoEnter: "auto-⏎ 2.0s",
          vocab: "412 dev aliases",
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
        ko: "Antigravity CLI(agy) 무의존성 동적 바이너리 패처",
        en: "Modular zero-dependency dynamic binary patcher for Antigravity CLI",
      },
      summary: {
        ko: "Antigravity CLI(agy) Go/네이티브 바이너리를 실행 파일 업데이트마다 깨지지 않게 .gopclntab 심볼과 기계어 오프코드 시그니처 스캔으로 분석하여, 타자기 딜레이 제거·일괄 렌더링·CJK 볼드 깨짐·단일 물결 취소선·컴팩션 임계치를 핫패치하는 Rust 도구입니다.",
        en: "Zero-dependency Rust binary patcher for Antigravity CLI (agy). Scans ELF64/Mach-O .gopclntab symbols and opcode signatures to patch textDrip delay, streaming batch jitter, CJK bold parsing, single-tilde strike, and compaction thresholds.",
      },
      stack: ["Rust (std only)", "ELF64 / Mach-O 64", "x86_64 & ARM64", "Zero Deps"],
      features: [
        {
          title: { ko: "고정 오프셋 없는 동적 시그니처 스캔", en: "Dynamic Signature Scanning" },
          desc: {
            ko: "외부 크레이트 의존성 없이 mmap으로 Go 심볼 테이블과 인스트럭션 패턴을 탐색해 버전이 올라가도 정확히 패치 지점을 찾습니다.",
            en: "Parses .gopclntab and instruction signatures via pure std Rust mmap with zero third-party crate dependencies.",
          },
        },
        {
          title: { ko: "nodrip · batch · compact 성능 튜닝", en: "nodrip · batch · compact Tuning" },
          desc: {
            ko: "16ms/12B 타자기 드립 딜레이를 제거(nodrip)하고 턴 완료 시 마크다운을 일괄 출력(batch)하며, 256k 기본 컴팩션 임계치를 180k 등 원하는 단가 경계로 조정합니다.",
            en: "Disables 16ms typewriter drip, batches turn markdown output cleanly, and retargets auto-compaction thresholds.",
          },
        },
        {
          title: { ko: "한국어 마크다운 파서 오류 수정", en: "CJK Markdown Parser Fixes" },
          desc: {
            ko: '**"강조"**에 처럼 볼드 직후 한글 조사가 붙으면 파싱이 풀리는 현상(cjk-bold)과 ~10ms 같은 단일 틸드가 취소선으로 깨지는 문제(tilde-strike)를 해결합니다.',
            en: "Fixes CommonMark flanking failures when Korean particles follow **bold** spans and stops single ~ ranges from turning into strikethrough.",
          },
        },
      ],
      installCmd: "agy-cli-patch --patch nodrip,batch,heading,cjk-bold,tilde-strike",
      cliBlockTitle: "agy-cli-patch --list && --patch",
      cliSnippet: `$ agy-cli-patch --patch nodrip,batch,heading,cjk-bold,tilde-strike
[scan] /usr/bin/agy (ELF64 x86_64, .gopclntab verified)
  ✓ nodrip        : textDrip interval 16ms -> 0ms (patched 2 sites)
  ✓ batch         : stream render flush -> turn-complete batch
  ✓ heading       : hide raw '##' prefix in styled headings
  ✓ cjk-bold      : allow Korean/CJK particle boundary after **...**
  ✓ tilde-strike  : require ~~double tilde~~ for strikethrough
[done] backup saved at ~/.local/share/agy-cli-patch/agy.orig`,
      archNodes: [
        "mmap(agy binary)",
        "Parse ELF64 / Mach-O .gopclntab",
        "Match x86_64/ARM64 Opcode Sig",
        "In-place Byte Patch",
        "Re-sign & Verify",
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
        row4: { pr: "#12", state: "merged", title: "v0.2.4 · compact 임계값 플래그 및 Mach-O codesign 대응" },
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
        ko: "Gemini Decisions API 안전 게이트·스웜 라우터·MCP 서버",
        en: "Gemini Decisions API safety hooks, dynamic subagent router & Rust MCP",
      },
      summary: {
        ko: "Google Gemini Decisions 전용 모델(gemini-decision-1)을 Antigravity CLI에 통합해 PreToolUse 위험 명령 검문소, Stop 증분 diff 체크리스트 심사, 서브에이전트/스웜 모델 동적 라우팅, 초고속 Rust MCP 도구를 제공하는 하네스입니다.",
        en: "Integrates gemini-decision-1 into Antigravity CLI with zero-latency PreToolUse safety gates, Stop diff checklist audits, dynamic subagent/swarm model routing, and a native Rust MCP server.",
      },
      stack: ["Rust", "tokio", "rmcp", "Gemini Decisions API", "stdio MCP"],
      features: [
        {
          title: { ko: "PreToolUse 무소음 안전 게이트", en: "Zero-Noise PreToolUse Safety Gate" },
          desc: {
            ko: "일상적인 조회·빌드 명령은 0ms 패스스루하고, git push --force · rm -rf · 권한 상승 같은 고위험 명령만 감지해 차단(deny)하거나 사용자 확인(force_ask)을 띄웁니다.",
            en: "Passes routine commands instantly at 0ms while intercepting destructive patterns like force-push or rm -rf via gemini-decision-1.",
          },
        },
        {
          title: { ko: "서브에이전트 & 스웜 동적 라우터", en: "Dynamic Subagent & Swarm Router" },
          desc: {
            ko: "메인 모델 프롬프트 캐시를 깨지 않으면서 invoke_subagent 및 swarm add 호출 시점에 작업 난이도를 평가해 Hydrogen / Argon / Carbon 모델과 reasoning_effort를 자동 배정합니다.",
            en: "Classifies subagent and swarm briefs at spawn time to assign optimal model tier and reasoning effort without invalidating parent caches.",
          },
        },
        {
          title: { ko: "Stop diff 심사 & Rust MCP 툴셋", en: "Stop Diff Audit & Rust MCP Tools" },
          desc: {
            ko: "에이전트 턴 종료 시 Git diff를 단일 패스 체크리스트로 검증하고, workspace_git_digest · batch_code_context · scan_code_checklist MCP 도구를 제공합니다.",
            en: "Audits staged/unstaged diffs on turn stop and exposes workspace_git_digest, batch_code_context, and scan_code_checklist over stdio MCP.",
          },
        },
      ],
      installCmd: "agy-decision-hook status && agy-decision-hook subagent-on",
      cliBlockTitle: "agy-decision-hook :: gate & subagent-router",
      cliSnippet: `$ agy-decision-hook test-gate "git push --force origin main"
decision=DENY  model=gemini-decision-1  latency=142ms
reason: protected branch 'main' force-push blocked by PreToolUse policy

$ agy-decision-hook status
pre-tool-gate   : ON  (plugins/decision)
stop-checklist  : ON  (plugins/decision-stop)
subagent-router : ON  (Hydrogen/Argon/Carbon auto-tiering)`,
      archNodes: [
        "CLI PreToolUse / Subagent Hook",
        "agy-decision-hook (Rust)",
        "gemini-decision-1 API",
        "Allow / Deny / Model Override",
        "agy-decision-mcp (stdio)",
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
        row4: { pr: "#27", state: "open", title: "swarm add 작업 샤딩 시 모델 오버라이드 일관성 검증" },
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
        ko: "Linux PC ↔ Gemini 모바일/웹 양방향 원격 데몬 (비공식)",
        en: "Unofficial Gemini Desktop daemon for Linux (Shell, MCP & Wayland Computer Use)",
      },
      summary: {
        ko: "Linux 워크스테이션을 Gemini 모바일·웹 및 비공식 데스크톱 클라이언트와 연결해 로컬 워크스페이스 파일 조작, 셸 실행, MCP 브리지, Wayland/Hyprland GUI Computer Use까지 원격으로 구동하는 Go 데몬입니다.",
        en: "Connects a Linux PC to Gemini Mobile, Web, and unofficial desktop clients over Google's bidirectional protocol for remote workspace files, shell tools, MCP bridges, and Wayland/X11 Computer Use.",
      },
      stack: ["Go 1.27", "Robin/Punctual Protocol", "Wayland / Hyprland", "stdio MCP"],
      features: [
        {
          title: { ko: "양방향 실시간 스트림 & 프레즌스", en: "Bidirectional Stream & Presence" },
          desc: {
            ko: "OAuth 로그인과 장치 등록 후 상주 데몬(serve)이 장시간 폴링·gRPC 스트림으로 연결 상태를 유지하며 모바일/웹 요청을 로컬 작업으로 중계합니다.",
            en: "Maintains device registration, presence heartbeats, and long-lived streams to bridge mobile/web Gemini sessions to local Linux tools.",
          },
        },
        {
          title: { ko: "워크스페이스 샌드박스 & 로컬 도구", en: "Workspace Sandbox & Local Tools" },
          desc: {
            ko: "허용된 폴더만 등록(folders add)해 파일 읽기/쓰기, diff 치환, Grep 검색, 셸 명령을 안전하게 실행합니다.",
            en: "Exposes scoped local directories for file edits, grep searches, and shell execution within explicitly allowed paths.",
          },
        },
        {
          title: { ko: "Wayland/Hyprland GUI Computer Use", en: "Wayland / X11 Computer Use" },
          desc: {
            ko: "grim 화면 캡처, wtype/ydotool 입력, hyprctl 창 제어를 조합해 리눅스 데스크톱 GUI 제어와 내장 Git·Obsidian MCP 연동을 지원합니다.",
            en: "Supports screen capture and GUI automation via grim, wtype, ydotool, hyprctl (or X11 xdotool) plus built-in Git/Obsidian MCP servers.",
          },
        },
      ],
      installCmd: "./gemini-remote login && ./gemini-remote register && ./gemini-remote serve",
      cliBlockTitle: "gemini-remote serve --status",
      cliSnippet: `$ ./gemini-remote serve
[auth]   OAuth credentials verified (device: omarchy-linux-01)
[bridge] folders mounted: ~/dev/git-repo (rw), ~/notes (ro)
[mcp]    attached: git-mcp, obsidian-mcp
[gui]    compositor=Hyprland  capture=grim  input=wtype+ydotool
[stream] connected to Gemini Gateway (Robin/Punctual RTT 41ms)`,
      archNodes: [
        "Gemini Mobile / Web",
        "Cloud Gateway (Robin/Punctual)",
        "gemini-remote (Go Daemon)",
        "Local Shell · File · MCP",
        "Wayland / Hyprland GUI",
      ],
      statusline: {
        type: "custom-gemini",
        row1: {
          model: "gemini-remote[go1.27]",
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
          compositor: "Hyprland + grim + wtype",
          mcp: "2 MCP servers",
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
        ko: "Tailnet 전용 일시 리버스 프록시 게이트 매니저 (무의존성 Rust TUI)",
        en: "Tailnet-only temporary reverse proxy gate manager with interactive TUI",
      },
      summary: {
        ko: "외부 공인 인터넷(tailscale funnel) 노출을 원천 차단하고 Tailscale tailnet 내부(tailscale serve)로만 로컬 포트를 일시 개방한 뒤, TTL 만료(기본 1시간)와 재부팅 시 자동 차단(boot-guard)을 보장하는 무의존성 Rust TUI/CLI 도구입니다.",
        en: "Zero-dependency Rust TUI/CLI for opening temporary tailnet-only ports via tailscale serve. Blocks public funnel exposure, enforces TTL auto-expiry, and sweeps stale openings on boot.",
      },
      stack: ["Rust (std only)", "Tailscale Serve", "systemd-run TTL", "Interactive TUI"],
      features: [
        {
          title: { ko: "Tailnet 전용 & Funnel 원천 차단", en: "Tailnet-Only · Funnel Blocked" },
          desc: {
            ko: "모든 개방 요청은 tailscale serve --bg 만 허용하며, 공인 인터넷 노출(funnel) 경로는 코드 레벨에서 거부합니다.",
            en: "Permits only private tailnet exposure via tailscale serve while strictly disallowing public tailscale funnel routes.",
          },
        },
        {
          title: { ko: "자동 TTL 타이머 & Boot Guard", en: "TTL Auto-Expiry & Boot Guard" },
          desc: {
            ko: "포트 개방 시 systemd-run --user 타이머가 자동 걸려 지정 시간이 지나면 닫히며, ts-gate-boot.service가 재부팅 직후 잔여 일시 포트를 전수 회수합니다.",
            en: "Schedules user systemd timers to auto-close expired ports and runs sweep --boot at startup to close leftover gates.",
          },
        },
        {
          title: { ko: "기존 상시 서비스 보호 & 무의존성 TUI", en: "Always-On Protection & Zero-Dep TUI" },
          desc: {
            ko: "외부 크레이트 없이 raw ANSI 터미널로 인터랙티브 TUI를 구동하며, 기존에 이미 서빙 중인 상시 포트(443/8443 등)와 충돌하지 않도록 보호합니다.",
            en: "Renders an interactive raw-ANSI TUI with zero crates while guarding pre-existing always-on Tailscale serve ports.",
          },
        },
      ],
      installCmd: "ts-gate open 8080 --ttl 2h && ts-gate list",
      cliBlockTitle: "ts-gate list :: tailnet gates",
      cliSnippet: `$ ts-gate open 8080 --ttl 2h
opened tailnet gate https://omarchy.tailnet.ts.net:8080 -> 127.0.0.1:8080 (ttl 2h00m)

$ ts-gate list
PORT   TARGET            MODE           TTL REMAINING   GUARD
8080   127.0.0.1:8080    tailnet-serve  1h 58m 14s      systemd-timer
443    127.0.0.1:8787    always-on      permanent       protected (collie)`,
      archNodes: [
        "ts-gate CLI / Raw ANSI TUI",
        "~/.config/ts-gate/state.json",
        "tailscale serve --bg (No Funnel)",
        "systemd-run TTL Timer",
        "ts-gate-boot.service Sweep",
      ],
      statusline: {
        type: "custom-ts",
        row1: {
          model: "ts-gate[rust-0deps]",
          mode: "tailnet-only",
          ttlPct: 68,
          ttlLabel: "1h58m left",
          funnel: "funnel: BLOCKED",
        },
        row2: {
          label: "gates",
          p5: 34,
          t5: ":8080 → :8080 (2h)",
          p7: 100,
          t7: ":443 collie protected",
        },
        row3: {
          label: "guard",
          boot: "ts-gate-boot.service armed",
          state: "state.json synced",
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

  function buildBarHtml(pct, width = 6) {
    const clamped = Math.max(0, Math.min(100, Math.round(pct)));
    const halfCells = Math.floor((clamped * width * 2 * 2 + 100) / 200);
    const full = Math.floor(halfCells / 2);
    const hasHalf = halfCells % 2 === 1;
    const filled = "━".repeat(full) + (hasHalf ? "╸" : "");
    const used = full + (hasHalf ? 1 : 0);
    const empty = "·".repeat(Math.max(0, width - used));

    let colorClass = "c-blue";
    if (clamped >= 90) colorClass = "c-red";
    else if (clamped >= 70) colorClass = "c-orange";
    else if (clamped >= 50) colorClass = "c-yellow";

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
        <div class="statusline-row"><span class="c-dim">├─</span> <span class="c-teal">${esc(sl.row2.label)}</span> <span class="c-white">voice</span> ${buildBarHtml(sl.row2.p5, 6)} <span class="c-dim">${esc(sl.row2.t5)}</span> <span class="c-dim">·</span> <span class="c-white">floor</span> ${buildBarHtml(sl.row2.p7, 6)} <span class="c-dim">${esc(sl.row2.t7)}</span></div>
        <div class="statusline-row"><span class="c-dim">└─</span> <span class="c-teal">${esc(sl.row3.label)}</span> <span class="c-green">${esc(sl.row3.host)}</span> <span class="c-dim">·</span> <span class="c-yellow">${esc(sl.row3.autoEnter)}</span> <span class="c-dim">·</span> <span class="c-white">${esc(sl.row3.vocab)}</span></div>
      `;
    } else if (sl.type === "custom-gemini") {
      logoHtml = renderCustomSvg(sl.type, state.active);
      rowsHtml = `
        <div class="statusline-row"><span class="c-gem-blue">${esc(sl.row1.model)}</span> <span class="c-cyan">${esc(sl.row1.proto)}</span> <span class="c-dim">│</span> <span class="c-white">rtt</span> ${buildBarHtml(sl.row1.rttPct, 6)} <span class="c-white">${esc(sl.row1.rttLabel)}</span> <span class="c-dim">│</span> <span class="c-green">${esc(sl.row1.host)}</span></div>
        <div class="statusline-row"><span class="c-dim">├─</span> <span class="c-gem-blue">${esc(sl.row2.label)}</span>  <span class="c-white">sync</span> ${buildBarHtml(sl.row2.p5, 6)} <span class="c-green">${esc(sl.row2.t5)}</span> <span class="c-dim">·</span> <span class="c-white">mounts</span> ${buildBarHtml(sl.row2.p7, 6)} <span class="c-white">${esc(sl.row2.t7)}</span></div>
        <div class="statusline-row"><span class="c-dim">└─</span> <span class="c-gem-purple">${esc(sl.row3.label)}</span> <span class="c-white">${esc(sl.row3.compositor)}</span> <span class="c-dim">·</span> <span class="c-teal">${esc(sl.row3.mcp)}</span></div>
      `;
    } else if (sl.type === "custom-ts") {
      logoHtml = renderCustomSvg(sl.type, state.active);
      rowsHtml = `
        <div class="statusline-row"><span class="c-teal">${esc(sl.row1.model)}</span> <span class="c-green">${esc(sl.row1.mode)}</span> <span class="c-dim">│</span> <span class="c-white">ttl</span> ${buildBarHtml(sl.row1.ttlPct, 6)} <span class="c-white">${esc(sl.row1.ttlLabel)}</span> <span class="c-dim">│</span> <span class="c-red">${esc(sl.row1.funnel)}</span></div>
        <div class="statusline-row"><span class="c-dim">├─</span> <span class="c-teal">${esc(sl.row2.label)}</span> <span class="c-white">temp</span> ${buildBarHtml(sl.row2.p5, 6)} <span class="c-white">${esc(sl.row2.t5)}</span> <span class="c-dim">·</span> <span class="c-white">keep</span> ${buildBarHtml(sl.row2.p7, 6)} <span class="c-green">${esc(sl.row2.t7)}</span></div>
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
