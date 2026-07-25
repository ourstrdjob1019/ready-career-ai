# ReadyCareer AI - Design DNA (단일 진실 소스)

본 문서는 Stitch MCP에서 내보낸 "Integrated Brand Character Showcase (ReadyCareer AI)" 프로젝트의 실제 디자인 사양을 100% 반영한 단일 진실 소스(Single Source of Truth)입니다. 애플리케이션 내의 모든 색상, 타이포그래피, 간격, 형태, 마스코트 표현은 본 문서에 규격화된 토큰만을 참조하여 구현해야 합니다.

---

## 1. Brand & Aesthetic Personality
- **브랜드 정체성**: ReadyCareer AI는 중·고등학생이 진로를 탐색하고 교사가 학생부를 손쉽게 기재할 수 있도록 돕는 AI 서비스입니다. 학술적인 명확성(Lucid & Academic-adjacent)과 친근하고 경쾌한 직관성을 동시에 제공합니다.
- **디자인 스타일**: **Modern Corporate + Soft Minimalism**. 
  - 차가운 흰색 바탕 대신 눈의 피로를 덜어주는 부드러운 라벤더 배경(`Soft Lavender #F2EFFC`, `#FBF8FF`)을 사용하여 온화하고 다정한 느낌을 줍니다.
  - 고대비 타이포그래피 계층과 "Canvas 위의 Card (Card-on-Canvas)" 레이아웃을 통해 콘텐츠 독해력을 극대화합니다.
  - 젊은 세대와 사용자 참여를 끌어내기 위해 큼직한 버튼(Oversized Touch Target), 20~28px 이상의 대담한 라운딩 코너, 촉각적인 깊이감(Tactile Ambient Shadow)을 채택합니다.

---

## 2. Color Tokens (컬러 팔레트)

모든 스타일링은 Tailwind Config 및 CSS 변수 토큰으로 참조되며, 하드코딩이 금지됩니다.

### Prime & Accents
| 토큰명 | Hex Code | 용도 및 설명 |
| :--- | :--- | :--- |
| **`primary`** | `#7B5CF0` | 메인 브랜드 컬러(Violet). 미래의 자아(Future-self)와 포부를 상징. 주요 CTA, 진행률, 활성 상태. (경우에 따라 base purple `#6240D5` 혼용) |
| **`accent-teal`** / **`secondary`** | `#1DAAB4` | 2차 브랜드 컬러(Teal/Cyan). '성공' 상태, 진로 카테고리 활성 칩, 마스코트 'Ari'의 도움말 말풍선 구분에 사용. (secondary container: `#7AF1FC`) |
| **`gradient-hero-start`** | `#8E70F7` | Hero 카드(현재 진로 로드맵 등) 중요 정보를 나타내는 웅장한 듀오톤 그라데이션 시작색. |
| **`gradient-hero-end`** | `#6B45E4` | Hero 카드 그라데이션 종료색. |

### Surface & Canvas
| 토큰명 | Hex Code | 용도 및 설명 |
| :--- | :--- | :--- |
| **`background`** / **`point`** | `#FBF8FF` / `#F2EFFC` | 앱의 기본 배경(Surface wash). 차가운 회색을 피하고 미세한 보랏빛 틴트를 적용. |
| **`surface-container-lowest`** | `#FFFFFF` | 상호작용 가능한 최상위 카드 및 중요 입력 요소 (순백색). |
| **`surface-container-low`** | `#F4F2FA` | 2차 카드 및 리스트 아이템, 입력창(Input Field) 바탕 주색 (`#F7F5FD`). |
| **`surface-container`** | `#EFEDF5` | 구조적 영역 분리 및 비활성 UI 칩 배경. |
| **`surface-variant`** | `#E3E1E9` | 테두리, 구분 경계(Ghost border), 보조 UI 박스. |

### Text & States
| 토큰명 | Hex Code | 용도 |
| :--- | :--- | :--- |
| **`text-primary`** / **`on-surface`** | `#1A1626` / `#1A1B21` | 메인 본문 및 제목 글색 (완성도 높은 딥 차콜). |
| **`text-muted`** / **`on-surface-variant`**| `#6E6A80` / `#484554` | 2차 텍스트, 설명글, 날짜 등 보조 정보. |
| **`error`** | `#BA1A1A` | 에러 경고 메시지 및 파괴적 상태. |

---

## 3. Typography (타이포그래피 및 글꼴 스케일)

글꼴 조합: 헤드라인과 권한성 있는 UI에는 **Hanken Grotesk**, 친근하고 긴 문장의 진로 조언 본문에는 **Be Vietnam Pro**를 혼합 사용합니다.

### Typography Scale Table
| 계층 (Token) | 글꼴 (Font Family) | 크기 (Font Size) | 행간 (Line Height) | 두께 (Weight) | 자간 (Letter Spacing) | 용도 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`display-lg`** / **`headline-xl`** | Hanken Grotesk | 32px ~ 48px | 40px ~ 56px | ExtraBold (800) | `-0.04em` | 온보딩 Hero 타이틀, 중요 달성 지표 |
| **`headline-lg`** | Hanken Grotesk | 24px (Mo: 22~28px)| 32px ~ 36px | Bold (700) | `-0.02em` | 화면 및 섹션별 메인 타이틀 |
| **`headline-md`** / **`title-md`** | Hanken Grotesk | 20px | 28px | SemiBold/Bold (600/700) | Default | 카드 제목, 내비게이션 바 로고 타이틀 |
| **`body-lg`** | Be Vietnam Pro | 18px | 28px | Regular (400) | Default | 중요 안내 본문, 직업 상세 추천 설명 |
| **`body-md`** | Be Vietnam Pro | 16px | 24px | Regular (400) | Default | 기본 리스트 설명글, UI 본문, 폼 필드 입력글 |
| **`label-lg`** | Hanken Grotesk | 14px | 20px | SemiBold (600) | `+0.02em` | 버튼 텍스트, 태그 칩 메인 라벨 |
| **`label-sm`** | Hanken Grotesk | 12px | 16px | Medium/SemiBold (500/600)| `+0.05em` | 날짜 메타데이터, 하단 Nav 캡션, 배지 번호 |

---

## 4. Elevation, Shapes & Spacing

### Shapes & Radii (코너 라운드 규격)
- **Extra Large Radii (20px ~ 28px / 32px max)**: 
  - 기본 Activity Card, Input Box, Hero Container의 테두리에 적용하여 현대적인 소비자 제품 느낌 부여.
- **Full Rounding (`rounded-full` / `9999px`)**:
  - 버튼(Button), 활성화 칩(Chip), 프로그레스 바(Progress Bar), 알림 및 아이콘 버튼은 완전한 필(Pill) 형상 유지.
- **중첩 법칙**: 바깥쪽 컨테이너가 32px일 때 내부 컨테이너는 4~8px 작은 24px~20px의 라운드를 부여하여 시각적 조화 유지.

### Elevation & Tonal Layering (그림자 및 깊이감)
- 전통적 검고 어두운 그림자 금지. **Ambient Violet Tint Shadows** 만 허용.
- **`shadow-3d-base`**: `0px 4px 20px rgba(123, 92, 240, 0.05), 0px 2px 4px rgba(123, 92, 240, 0.02)`
- **`shadow-3d-ambient`**: `0px 20px 40px rgba(123, 92, 240, 0.08)` (카드 기본 및 Floating UI)
- **`shadow-3d-hover`**: `0px 30px 50px rgba(123, 92, 240, 0.15), 0px 4px 8px rgba(123, 92, 240, 0.05)` (호버 및 유선 반응)
- **Glassmorphism (글래스모피즘)**: 하단 모바일 내비게이션 바 및 상단 알림창 등은 반투명 `bg-white/70`, `backdrop-blur-xl (20px)` 과 연한 `1.5px solid rgba(255, 255, 255, 0.4)` 테두리 활용.

### Spacing Rhythm
- **4px Baseline System**:
  - `stack-sm (8px)`: 타이틀과 소유 설명글 간격
  - `stack-md (16px)`: 카드 내 아이템, 필드 간 격차
  - `stack-lg (32px)`: 섹션별 격차
  - `margin-mobile (20px)`: 모바일 좌우 안전 여백
  - `margin-desktop (40px)` / `gutter (16px~24px)`: 데스크톱 2~3컬럼 반응형 레이아웃 좌우 여백 및 카드 사이 gap

---

## 5. Mascot "Ari" (강아지 캐릭터) 활용 준칙
- **캐릭터 개별 정의**: 하늘색(Teal/Cyan 톤이 감미된) 강아지 마스코트 AI 파트너 'Ari'. 진로 탐색을 흥미로운 여정으로 이끄는 감정적 중심축.
- **사용 위치 및 롤**:
  1. **헤더 프로필 (300x300 아바타)**: 상단 App Bar 좌측 브랜드명 옆에 항상 위치.
  2. **복합 폼 우측 상단 / 도움말 트리거**: 학생부 기재 가이드 및 흥미유형 검사의 질문이나 가이드를 안내할 때 틸 컬러(`#1DAAB4`) 말풍선과 함께 표출.
  3. **별자리 로드맵 달성 & 온보딩 완료 축하**: 퀘스트 달성 시 15도 회전된 입체적인 스티커(Sticker) 형태로 기쁨을 표출하며 등장.

---

## 6. Components Core Specification
- **Buttons**:
  - **Primary**: Solid Violet (`#7B5CF0`), 텍스트 White, 52~56px 터치 타겟, Hover/Active 시 98% 스케일다운(`active:scale-95`).
  - **Secondary / Outline**: Teal Border 또는 Light Lavender Fill (`#EFEDF5`), Violet 또는 Teal 텍스트.
- **Input Fields**:
  - 56px 높이, 배경색 `#F7F5FD` (테두리 없음). 
  - **Focus State**: 배경색 유지하면서 `2px solid #7B5CF0 (Violet)` 내부 스트로크 표출.
- **Progress Bars**:
  - 오버사이즈(12px 높이), 양옆 풀 라운딩. 트랙은 15% opacity의 Violet/Teal, 인디케이터는 100% Solid Color 또는 Hero Gradient.
- **Chips (태그/필터)**:
  - 활성 상태: Primary Violet 또는 Secondary Teal, 텍스트 White, 3D Ambient Shadow 적용.
  - 비활성 상태: Light Lavender Surface, 텍스트 Muted Gray.
