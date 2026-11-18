/* Content for every space: copy, statusline samples and media. The engine lives in app.js. */
(() => {
  "use strict";

  const CLAWD_BODY_PATH =
    "M8 11H34V19H38V23H34V31H31.5V27H30V31H27.5V27H14.5V31H12V27H10.5V31H8V23H4V19H8Z";
  const AGY_ARCH_PATH =
    "M89.6992 93.695C94.3659 97.195 101.366 94.8617 94.9492 88.445C75.6992 69.7783 79.7825 18.445 55.8659 18.445C31.9492 18.445 36.0325 69.7783 16.7825 88.445C9.78251 95.445 17.3658 97.195 22.0325 93.695C40.1159 81.445 38.9492 59.8617 55.8659 59.8617C72.7825 59.8617 71.6159 81.445 89.6992 93.695Z";

  const TABS = [
    { id: "readme", num: "1", ko: "readme", en: "readme" },
    { id: "demo", num: "2", ko: "demo", en: "demo" },
    { id: "media", num: "3", ko: "media", en: "media" },
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
    featured: "agent-world",
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
          ko: "herdr v0.9.5 멀티플렉서 환경 위에서 Claude Code(cc-desktop-mod v0.81.2)와 Antigravity CLI(agy-cli-patch v0.2.4)의 출력 렌더링, 상태줄, 사이드 패인을 직접 개조하고, 떠 있는 에이전트들은 3D 마을(agent-world v0.1.0)에서 한눈에 봅니다.",
          en: "Customizes Claude Code (cc-desktop-mod v0.81.2) and Antigravity CLI (agy-cli-patch v0.2.4) rendering, statuslines, and side panes inside herdr v0.9.5, and watches the running agents as a 3D village (agent-world v0.1.0).",
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
    cliSnippet: `$ ls -1 ~/dev/git-repo | grep -E "agent-world|cc-desktop|soksak|agy-|gemini-remote|ts-gate"
agent-world         # v0.1.0 · 코딩 에이전트들이 사는 3D 마을 (herdr 플러그인)
cc-desktop-mod      # v0.81.2 · Claude Code 데스크톱 스타일 플러그인 스위트
soksak              # Android 온디바이스 한국어/개발용어 받아쓰기 + Rust PC 데몬
agy-cli-patch       # v0.2.4 · Antigravity CLI(agy) 9종 무의존성 동적 바이너리 패처
agy-decision-lab    # Gemini Decisions API 안전 게이트·스웜 라우터·5종 MCP
gemini-remote-linux # Go 1.27.3 · Linux PC ↔ Gemini 모바일/웹/데스크톱 원격 데몬
ts-gate             # v0.1.0 · Linux/macOS Tailnet 전용 일시 포트 게이트 TUI/CLI`,
    archNodes: [
      "Android (soksak)",
      "Tailscale Mesh (ts-gate)",
      "Herdr v0.9.5 + Collie · Agent World",
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
        extra: "7 spaces active",
      },
      row2: { label: "claude", p5: 18, t5: "3h12m", p7: 45, t7: "2d0h", extra: "cc-desktop-mod v0.81.2" },
      row3: { label: "gemini", p5: 24, t5: "2h45m", p7: 60, t7: "3d4h", extra: "agy-cli-patch v0.2.4 · decision-lab" },
    },
  };

  // The first project is the space the page opens on (app.js selects PROJECTS[0]).
  const PROJECTS = [
    {
      id: "agent-world",
      slug: "agent-world",
      kind: "custom-world",
      name: "agent-world",
      isNew: true,
      cover: true,
      badge: "village",
      badgeClass: "badge-custom",
      cwd: "~/dev/git-repo/agent-world",
      branch: "main",
      agent: "agent-world",
      repoUrl: "https://github.com/KyongSik-Yoon/agent-world",
      siteUrl: "https://agent-world.ksyoon.com/",
      sub: {
        ko: "v0.1.0 · 코딩 에이전트들이 사는 3D 마을 (herdr 플러그인)",
        en: "v0.1.0 · A 3D village for your coding agents (herdr plugin)",
      },
      summary: {
        ko: "herdr 에 띄워 둔 코딩 에이전트를 3D 마을로 보여 주는 로컬 대시보드입니다. 에이전트 하나가 캐릭터 하나이고, 캐릭터가 서 있는 곳을 보면 상태를 알 수 있습니다. herdr 창으로 돌아가지 않고 브라우저에서 바로 지시를 보내고, 질문에 답하고, 새 워크스페이스(집)를 만듭니다.",
        en: "A local dashboard that shows the coding agents running in herdr as a 3D village. One agent is one character, and where it stands tells you its state. Prompt agents, answer their questions and build new workspaces (houses) from the browser, without going back to the herdr window.",
      },
      stack: ["TypeScript", "v0.1.0", "Bun", "three.js", "herdr >=0.9.5", "MIT"],
      features: [
        {
          title: { ko: "서 있는 곳이 상태", en: "Where they stand is their state" },
          desc: {
            ko: "작업 중이면 집터 마당, 끝나면 가운데 광장(초록 빛기둥), 확인이 필요하면 대문 앞(빨간 빛기둥), 대기 중이면 집 옆에서 좁니다. 탭을 넘겨 볼 필요 없이 N 을 누르면 확인할 캐릭터로 차례로 이동합니다.",
            en: "Working agents stay in their yard, finished ones walk to the plaza (green beam), agents that need you jump at the gate (red beam), and idle ones doze by the house. Press N to jump to the next one that needs a look.",
          },
        },
        {
          title: { ko: "지시·답변·터미널을 그 자리에서", en: "Prompt, answer and open the terminal in place" },
          desc: {
            ko: "캐릭터를 누르면 모델·effort·컨텍스트·마지막 지시와 응답이 한 창에 나옵니다. 입력창으로 지시와 이미지를 보내고, 권한 대화상자에는 적힌 키 그대로 답하고, ` 로 그 pane 의 화면을 크게 엽니다.",
            en: "Click a character to see its model, effort, context and last prompt and reply in one panel. Send prompts and images, answer permission dialogs with the keys they show, and press ` to open that pane's terminal.",
          },
        },
        {
          title: { ko: "집 짓기 · 휴대폰 · 알림", en: "Build houses, carry on from your phone" },
          desc: {
            ko: "＋ 집 짓기에서 폴더·워크트리·에이전트·모델·effort·첫 지시를 한 번에 정합니다. tailnet 안에서 휴대폰으로 이어 쓰고, 종 단추를 켜 두면 에이전트가 끝났거나 확인을 기다릴 때 Web Push 로 알려 줍니다.",
            en: "Build a house to pick the folder, worktree, agent, model, effort and first prompt in one go. Carry on from your phone inside the tailnet, and turn on the bell to get Web Push when an agent finishes or needs you.",
          },
        },
      ],
      installCmd: "herdr plugin install KyongSik-Yoon/agent-world",
      cliBlockTitle: "herdr plugin :: agent-world v0.1.0",
      cliSnippet: `$ herdr plugin install KyongSik-Yoon/agent-world

$ bun start   # 플러그인 없이 직접 실행
Agent World → http://127.0.0.1:4780/#k=<열쇠>

$ AGENT_WORLD_TRUST_HOSTS=<host>.<tailnet>.ts.net:4780 bun start
Agent World → http://127.0.0.1:4780/#k=<열쇠>
  tailnet 에서도 받음(이 PC 의 계정만) → https://<host>.<tailnet>.ts.net:4780/#k=<열쇠>
$ tailscale serve --bg --https=4780 http://127.0.0.1:4780`,
      archNodes: [
        "herdr socket (session.snapshot)",
        "Harness logs: Claude Code · Codex · Antigravity",
        "Bun server → SSE snapshot",
        "three.js village + HUD",
        "agent.prompt · pane.send_input",
      ],
      statusline: {
        type: "custom-world",
        row1: {
          model: "agent-world[v0.1.0]",
          mode: "herdr plugin",
          workPct: 44,
          workLabel: "4/9 agents",
          host: "127.0.0.1:4780",
        },
        row2: { label: "plaza", blocked: "1 needs you", done: "2 done", working: "4 working", idle: "2 idle" },
        row3: { label: "reads", source: "herdr socket + harness logs", hooks: "no hooks", net: "tailnet only" },
      },
    },
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

  const ASSET = "./assets";
  const RAW = "https://raw.githubusercontent.com/KyongSik-Yoon/KyongSik-Yoon/main";

  // How each demo scene was made, shown under the screen.
  const NOTE = {
    replay: {
      ko: "README 예시를 타이핑으로 다시 재생한 화면입니다.",
      en: "A typed replay of the README example.",
    },
    real: {
      ko: "도구가 실제로 낸 출력입니다 (tmux 캡처).",
      en: "Real output from the tool (tmux capture).",
    },
    video: {
      ko: "실제 화면 녹화 · 52초 · 소리 없음",
      en: "Real screen recording · 52s · no sound",
    },
  };

  const sitePreview = (id, url) => ({
    kind: "image",
    src: ASSET + "/sites/" + id + ".webp",
    w: 1280,
    h: 800,
    href: url,
    caption: { ko: "프로젝트 홈페이지 첫 화면 — " + url.replace(/^https?:\/\//, ""), en: "Project homepage — " + url.replace(/^https?:\/\//, "") },
  });

  const EXTRAS = {
    profile: {
      scenes: [{ id: "index", kind: "cast", title: "workspace-index.sh", note: NOTE.replay }],
      media: [
        {
          kind: "image",
          src: RAW + "/cards/ai-usage-full.svg",
          w: 846,
          h: 225,
          caption: { ko: "AI 코딩 사용량 카드 — 저장소에서 자동 갱신", en: "AI coding usage card — refreshed from the repo" },
        },
        {
          kind: "image",
          src: RAW + "/cards/ai-usage-combo.svg",
          w: 846,
          h: 195,
          caption: { ko: "사용량 + 일별 잔디", en: "Usage with the daily grass" },
        },
        {
          kind: "image",
          src: RAW + "/cards/ai-usage-half-grass.svg",
          w: 423,
          h: 335,
          caption: { ko: "세로형 카드", en: "Tall card" },
        },
        {
          kind: "image",
          src: RAW + "/cards/ai-usage-grass.svg",
          w: 423,
          h: 195,
          caption: { ko: "일별 잔디", en: "Daily grass" },
        },
      ],
    },
    "agent-world": {
      scenes: [{ id: "install", kind: "cast", title: "herdr plugin install", note: NOTE.replay }],
      media: [
        {
          kind: "image",
          src: ASSET + "/agent-world/overview.webp",
          w: 1920,
          h: 1147,
          caption: {
            ko: "섬 위의 집 네 채와 에이전트 아홉. 일을 끝낸 캐릭터는 광장의 초록 빛기둥 아래 서 있고, 목록은 확인 필요·완료·작업 중·대기로 묶입니다 (가상 프로젝트를 흉내 낸 시험용 세션)",
            en: "Four houses and nine agents on the island. Finished characters stand under green beams in the plaza; the list groups them by needs you, done, working and idle (a mock session)",
          },
        },
        {
          kind: "image",
          src: ASSET + "/agent-world/detail.webp",
          w: 1920,
          h: 1147,
          caption: {
            ko: "캐릭터를 누르면 뜨는 상태 창: 모델, effort, 컨텍스트, 브랜치, 마지막 지시·응답과 입력창",
            en: "The panel behind a character: model, effort, context, branch, the last prompt and reply, and the input box",
          },
        },
        {
          kind: "image",
          src: ASSET + "/agent-world/blocked.webp",
          w: 1920,
          h: 1147,
          caption: {
            ko: "확인 필요: 캐릭터가 대문 앞에 나와 있고, 에이전트가 띄운 권한 대화상자가 상태 창에 그대로 보입니다",
            en: "Needs you: the character waits at the gate and the agent's permission dialog shows as-is in the panel",
          },
        },
        {
          kind: "image",
          src: ASSET + "/agent-world/terminal.webp",
          w: 1920,
          h: 1147,
          caption: {
            ko: "크게 연 터미널: 에이전트의 화면이 색까지 그대로 보이고 키 입력은 pane 으로 바로 갑니다",
            en: "The terminal, opened large: the agent's screen in full colour, with keys going straight to the pane",
          },
        },
        {
          kind: "image",
          src: ASSET + "/agent-world/night.webp",
          w: 1920,
          h: 1147,
          caption: { ko: "밤 테마의 월드", en: "The world in the night theme" },
        },
        {
          kind: "image",
          src: ASSET + "/agent-world/build.webp",
          w: 760,
          h: 1092,
          caption: {
            ko: "집 짓기: 폴더, 이름, 워크트리, 들일 에이전트와 모델·effort, 첫 지시",
            en: "Building a house: folder, name, worktree, the agent with its model and effort, and the first prompt",
          },
        },
        {
          kind: "image",
          src: ASSET + "/agent-world/phone.webp",
          w: 780,
          h: 1688,
          caption: { ko: "휴대폰 폭의 월드 화면", en: "The world at phone width" },
        },
        {
          kind: "image",
          src: ASSET + "/agent-world/phone-detail.webp",
          w: 780,
          h: 1688,
          caption: {
            ko: "휴대폰에서 연 확인 필요 상태 창: 대화상자 아래에 빠른 키 버튼",
            en: "A needs-you panel on the phone: quick key buttons under the dialog",
          },
        },
        sitePreview("agent-world", "https://agent-world.ksyoon.com/"),
      ],
    },
    "cc-desktop-mod": {
      scenes: [
        {
          id: "demo",
          kind: "video",
          title: "demo.mp4",
          src: ASSET + "/cc-desktop-mod/demo.mp4",
          poster: ASSET + "/cc-desktop-mod/demo-poster.webp",
          w: 1600,
          h: 872,
          note: NOTE.video,
        },
        { id: "install", kind: "cast", title: "/plugin install", prompt: "❯", note: NOTE.replay },
      ],
      media: [
        {
          kind: "image",
          src: ASSET + "/cc-desktop-mod/screenshot.webp",
          w: 1400,
          h: 1865,
          caption: {
            ko: "프롬프트 띠, 접힌 도구 호출, 마크다운 표, mermaid 순서도, Note 상자, 고친 파일 카드",
            en: "A prompt band, folded tool calls, a markdown table, a mermaid flowchart, a note box and the edited-files card",
          },
        },
        {
          kind: "image",
          src: ASSET + "/cc-desktop-mod/band.webp",
          w: 1600,
          h: 105,
          caption: {
            ko: "입력창 위 진행 띠: 지금 단계, 도는 명령과 시간·CPU, 저장소·브랜치·바뀐 줄 수",
            en: "The progress band above the prompt: the current step, the running command with its time and CPU, repo, branch and changed lines",
          },
        },
        {
          kind: "image",
          src: ASSET + "/cc-desktop-mod/comments.webp",
          w: 1600,
          h: 1306,
          caption: {
            ko: "diff 패널의 줄 댓글: 19–20줄에 남긴 댓글과 12줄에 열린 댓글 칸",
            en: "Line comments in the diff pane: a kept comment on lines 19–20 and an open comment field on line 12",
          },
        },
        {
          kind: "image",
          src: ASSET + "/cc-desktop-mod/diff.webp",
          w: 1600,
          h: 1596,
          caption: {
            ko: "/desk-diff — 커밋 안 한 변경을 데스크톱 diff 패널처럼",
            en: "/desk-diff — uncommitted changes drawn like the desktop diff pane",
          },
        },
        {
          kind: "image",
          src: ASSET + "/cc-desktop-mod/preview.webp",
          w: 1223,
          h: 1591,
          caption: {
            ko: "마크다운 미리보기 패널: front matter 상자, 경고 상자, 표, mermaid 순서도",
            en: "The Markdown preview pane: a front matter box, a warning box, a table and a mermaid flowchart",
          },
        },
        {
          kind: "image",
          src: ASSET + "/cc-desktop-mod/ask.webp",
          w: 1600,
          h: 505,
          caption: {
            ko: "입력창 위 질문 카드: 번호 선택지, Other, 기본 창",
            en: "A question card above the prompt: numbered options, Other, and the default dialog",
          },
        },
        {
          kind: "image",
          src: ASSET + "/cc-desktop-mod/tasks.webp",
          w: 1224,
          h: 925,
          caption: {
            ko: "백그라운드 작업 패널: 실행 중인 에이전트·모니터·셸과 끝남 아래의 셸",
            en: "The background tasks pane: a running agent, monitor and shell, and a finished shell under Done",
          },
        },
        {
          kind: "image",
          src: ASSET + "/cc-desktop-mod/context.webp",
          w: 1224,
          h: 1406,
          caption: {
            ko: "컨텍스트 패널: 분류 색 막대, 실린 것, 이 세션의 그래프, 캐시, 비용, 사용 한도",
            en: "The context pane: a context bar in category colors, what is loaded, a graph of this session, cache, cost and usage limits",
          },
        },
        sitePreview("cc-desktop-mod", "https://kyongsik-yoon.github.io/cc-desktop-mod/"),
      ],
    },
    soksak: {
      scenes: [{ id: "pair", kind: "cast", title: "soksak-daemon pair", note: NOTE.replay }],
      media: [sitePreview("soksak", "https://soksak.ksyoon.com/")],
    },
    "agy-cli-patch": {
      scenes: [
        { id: "patch", kind: "cast", title: "-p all --compact 180k", note: NOTE.replay },
        { id: "notes", kind: "cast", title: "--notes", cmd: "agy-cli-patch --notes", capture: "agyNotes", note: NOTE.real },
        { id: "list", kind: "cast", title: "--list", cmd: "agy-cli-patch --list", capture: "agyList", note: NOTE.real },
      ],
      media: [
        {
          kind: "screen",
          capture: "agyTui",
          cols: 96,
          title: "agy-cli-patch",
          caption: {
            ko: "대화형 TUI 1단계 「패치 선택」 — 실제 화면 캡처",
            en: "Interactive TUI, step 1 “pick patches” — a real capture",
          },
        },
        sitePreview("agy-cli-patch", "https://agy-cli-patch.ksyoon.com/"),
      ],
    },
    "agy-decision-lab": {
      scenes: [{ id: "hook", kind: "cast", title: "agy-decision-hook", note: NOTE.replay }],
      media: [
        {
          kind: "logos",
          items: [
            { src: ASSET + "/agy-decision-lab/decision.svg", name: "decision", sub: "PreToolUse gate" },
            { src: ASSET + "/agy-decision-lab/decision-stop.svg", name: "decision-stop", sub: "Stop checklist" },
            { src: ASSET + "/agy-decision-lab/decision-subagent.svg", name: "decision-subagent", sub: "model router" },
          ],
          caption: { ko: "네이티브 플러그인 3종", en: "The three native plugins" },
        },
      ],
    },
    "gemini-remote-linux": {
      scenes: [{ id: "serve", kind: "cast", title: "register & serve", note: NOTE.replay }],
      media: [],
    },
    "ts-gate": {
      scenes: [
        { id: "open", kind: "cast", title: "add · quick · list", note: NOTE.replay },
        { id: "help", kind: "cast", title: "--help", cmd: "ts-gate --help", capture: "tsHelp", note: NOTE.real },
      ],
      media: [
        {
          kind: "screen",
          capture: "tsTui",
          cols: 84,
          title: "ts-gate",
          caption: {
            ko: "대화형 TUI 목록 화면 — 실제 화면 캡처 (예시 엔드포인트, 호스트명과 외부 포트 목록은 바꿔 넣음)",
            en: "The TUI list screen — a real capture (sample endpoints; hostname and external port list replaced)",
          },
        },
        {
          kind: "screen",
          capture: "tsTuiTtl",
          cols: 84,
          title: "ts-gate · t",
          caption: {
            ko: "개방 시간 선택 화면 — 실제 화면 캡처",
            en: "The open-time picker — a real capture",
          },
        },
      ],
    },
  };

  for (const item of [PROFILE_ENTRY, ...PROJECTS]) Object.assign(item, EXTRAS[item.id]);

  window.HERDR_DATA = { TABS, PROFILE_ENTRY, PROJECTS, CLAWD_BODY_PATH, AGY_ARCH_PATH };
})();
