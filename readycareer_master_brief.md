# ReadyCareer AI — 박람회 체험판 마스터 지시서 (Antigravity 최종 핸드오프)

> **이 문서가 최상위 기준이다.** 함께 넣는 4개 자료와 역할이 다르며, 충돌 시 **이 문서가 우선**한다.
> - `readycareer_pilot_spec.md` — 데이터모델·기능 상세 (전체 스펙)
> - `readycareer_mockup_flow.md` + `ReadyCareer_AI_1차_목업.html` — **화면 순서·전환·로직의 기준**
> - `readycareer_stitch_screen_mapping.md` — 스티치 디자인 ↔ 화면 매핑
> - `readycareer_supabase_schema.sql` — **그대로 실행할 DB 스키마+RLS+시드**
> - `assessment_config.json` — **실제 진단용 RIASEC 검사 콘텐츠**

**작업 시작 전:** 코드부터 짜지 말고 ① 스코프 요약 ② 태스크 분할 ③ 파일/테이블 목록을 먼저 제시하고 승인받아라.

---

## 1. 세 소스의 역할 분담 (이게 핵심 — 지금 "예쁜데 안 이어짐" 문제의 해법)
스티치는 화면을 낱장으로 그려서 **전환 정보가 없고**, 목업은 흐름은 있지만 비주얼이 거칠다. 그래서 **화면마다 셋을 합쳐** 만든다:

| 담당 | 소스 | 역할 |
|---|---|---|
| **흐름·전환·로직** | 목업 HTML | 화면이 어떤 순서로 어떻게 이어지는지 (뼈대) |
| **비주얼·레이아웃** | 스티치 디자인 | 각 화면이 어떻게 생겼는지 (살) |
| **데이터·인증·RLS·AI** | spec + SQL | 화면 뒤 배선 (신경) |

→ **규칙:** 화면을 만들 땐 반드시 "**스티치 비주얼 + 목업 전환 + SQL 테이블**"을 함께 본다. 스티치 화면만 옮겨 붙이면 전환이 깨지고, 목업만 따르면 비주얼이 스티치와 달라진다.

---

## 2. 이번 파일럿 확정 사항 (모두 반영)
1. **신규 가입자가 현장에서 끝까지 체험** — 박람회 방문자가 즉석 가입 → 검사 → 결과 → 홈 → 마이페이지/로드맵/습관/포트폴리오를 **막힘 없이 한 바퀴**. (아래 §4)
2. **검사 = RIASEC 6유형, 실제 진단** — `assessment_config.json`의 **18문항**으로 진짜 결과가 나온다. 더미 아님.
3. **쉬운 위 / AI 아래** — 사용자에겐 버튼 한두 번의 단순 UX. 로드맵 생성·활동 추천·포트폴리오 정리·리포트는 **뒤에서 AI(서버리스)가 자동 처리**. (§6)
4. **마이페이지 = 누적 대시보드(동기부여 엔진)** — 진단 리포트 이력·완료 퀘스트·실천 습관·뱃지·레벨·성장 추이가 **한자리에 쌓여 보인다**. (§5) — **신규 화면 추가.**
5. **직업 상세 화면 포함** (Detailed Career View). 진로학습코스·역량성장지표·오늘의퀘스트는 **Phase 2로 제외**(만들지 마라).
6. **퀘스트 감각** — 로드맵 별자리·습관 챌린지·활동 기록을 EXP/레벨/뱃지/완료 연출로 **게임처럼**. (§7)
7. **브랜드명 통일** — 전부 **ReadyCareer AI**, 캐릭터 **아리(Ari)**. (스티치의 CareerQuest/CareerLaunch/Career Vault 명칭 제거)
8. **데모-퍼스트 절대 원칙** — 실제 Supabase 연결, 전체 스키마 선행, RLS 선적용, 하드코딩·localStorage 금지, 키 클라 노출 금지. (spec §3~§4 그대로)

---

## 3. 화면별 통합 매핑 (파일럿 범위)
각 행 = **한 화면**. "스티치 비주얼 + 목업 전환 + 데이터/AI"를 묶었다.

| 화면(ID) | 스티치 | 목업 전환(from→to) | 데이터 / AI |
|---|---|---|---|
| `landing` | (없음→목업 참조) | 첫 화면 → code / slogin | app_settings.signup_open 읽어 가입 개방 여부 |
| `code` | 온보딩-초대코드 | landing→code→signup | 데모코드 `DEMO01` 통과, 서버리스로 코드 검증 |
| `signup` | 온보딩-정보입력 | code→signup→consent | Supabase Auth 가입 + profiles insert |
| `consent` | (없음→목업 참조) | signup→consent→quiz | 만14세 미만 보호자 정보 필수 |
| `quiz` | 흥미유형 검사 | consent→quiz→result | `assessment_config.json` 18문항, 답 수집 |
| `result` | 검사 결과 요약(변형들) | quiz→result→(직업상세)→home | RIASEC 채점 저장(assessment_results) + 직업추천(jobs/AI 해석) |
| `career-detail` | 진로 상세 정보 | result에서 직업 탭 → 상세 | jobs.summary 표시 |
| `career-confirm` | 진로 확정-선택완료 | result→career-confirm→home | interested_jobs/career_goals 저장(+20 EXP) |
| `home` | 홈 대시보드 | 4탭 허브 | student_progress(레벨/EXP), career_goals(비전) |
| `mypage` | (신규→§5 지침) | 홈/탭에서 진입 | 누적: 진단이력·완료퀘스트·습관·뱃지·성장추이 |
| `road` | 별자리 로드맵 | 탭 | roadmaps/roadmap_quests + **AI 로드맵 생성** |
| `habit` | 습관&목표 | 탭 | habits/habit_logs (+AI 습관설계) |
| `port` | 포트폴리오/보관함 | 탭 → add | portfolios (공개/비공개) |
| `add` | 활동 기록 폼 | port→add→port | portfolios insert + **AI로 정리하기** + Storage 첨부 |
| `slogin`/`findid`/`findpw` | (없음→목업 참조) | 재방문 경로 | 데모 부차 기능(최소 구현) |
| `tv-guide` | 학생부 기재 가이드 | 교사 콘솔 | **AI 생기부 가이드안**(예시·최종기재는 교사) |
| `tv-dash`/`tv-detail` | (셸 있음, 개별 목업 참조) | 교사 콘솔 | 자기 학교 학생만(RLS) 진도율/상세 |
| `tv-reset`/`tv-codes`/`tv-pre` | (없음→목업 참조) | 슈퍼/학교관리자 | 서버리스+service_role 골격 |

> 하단 탭: **홈 · 별자리로드맵 · 습관&목표 · 포트폴리오** + 마이페이지 진입(홈 상단 프로필/전용 버튼). 스티치의 Explore/Learning 탭 구성은 쓰지 마라(Phase 2 기능).

---

## 4. 신규 가입자 체험 경로 (데모 모드 — 반드시 동작)
박람회 방문자가 **아무 사전 준비 없이** 체험 가능해야 한다.
1. `app_settings.demo_mode=true`, `signup_open=true` (시드에 이미 설정됨).
2. `landing` → "회원가입하고 시작하기" → `code`에 **`DEMO01`** 입력(또는 화면에 코드 미리 노출/자동 채움)하면 통과.
3. `signup`에서 실제 Supabase Auth 계정 생성 + `profiles`(role=student, 데모학교) insert. 트리거가 `student_progress` 자동 생성.
4. `consent` → `quiz`(18문항) → `result`(실제 RIASEC 결과) → `career-confirm` → `home`.
5. 이후 모든 활동이 **그 계정에 실제로 저장**되고 새로고침해도 유지. 마이페이지에 쌓인다.
- 재방문/재현이 잦으니, 데모용 **간편 초기화**(테스트 계정 리셋) 경로는 서버리스로만.

---

## 5. 마이페이지 — 누적 대시보드 (동기부여 엔진)
"내가 이만큼 했네"가 **한눈에** 보여야 한다. 구성:
- **진단 리포트 이력** — `assessment_results` 전부. 재검사하면 카드가 쌓이고 유형 변화를 비교.
- **완료 퀘스트** — `roadmap_quests.status='done'` 모아 타임라인/누적 개수.
- **실천 습관** — `habits` + `habit_logs` 연속일·성공률.
- **뱃지 컬렉션** — `student_badges` (획득/미획득 대비로 다음 목표 자극).
- **레벨·EXP·성장 추이** — `student_progress` + 누적 활동 수. 시간에 따른 성장 곡선/도넛.
- **정서 규칙:** 비어 있어도 "다음에 뭘 하면 채워지는지"를 보여줘 **다음 행동을 유도**. 채워질수록 시각적으로 풍성해지게.

---

## 6. "쉬운 위 / AI 아래" — AI 연결 지점
사용자에겐 **버튼 한 번**, 실제 호출은 전부 **서버리스(`/api/ai/*`)**. (§8 코드)
- **로드맵 생성**(`road`) — 입력: 진로+단기목표 → 출력: 별자리 nodes/edges+퀘스트 JSON → `roadmaps`/`roadmap_quests` 저장.
- **활동 추천**(`port`) — 관심직업 기반 추천 활동 목록.
- **포트폴리오 정리**(`add`) — 대충 쓴 초안 → 활동명/내용/성찰 정리.
- **검사 결과 해석**(`result`) — RIASEC 상위유형 → 개인화 2~3줄(템플릿을 살로).
- **생기부 가이드안**(`tv-guide`) — 선택 활동 → 기재 예시(가이드). 최종 기재는 교사.

---

## 7. 퀘스트 감각 (게임화 연출)
- 활동/퀘스트/습관 완료 시 **EXP 획득 → 레벨업 연출**(토스트, 캐릭터 변화, 뱃지 해금).
- 로드맵은 별자리를 **하나씩 밝혀가는** 진행감. 습관은 **N일차 챌린지** 카운터+응원.
- "공부/기록"이 아니라 **"깨는 재미"**로 느껴지게 카피와 애니메이션을 가볍고 경쾌하게.

---

## 8. 연결 방법 (Supabase + 서버리스 배선)

### 8.1 환경변수 (Vercel)
| 이름 | 위치 | 노출 |
|---|---|---|
| `SUPABASE_URL` | 클라+서버 | 공개 가능(프레임워크 접두어 붙임) |
| `SUPABASE_ANON_KEY` | 클라 | 공개 가능(RLS로 보호) |
| `SUPABASE_SERVICE_ROLE_KEY` | **서버리스 전용** | ❌ 절대 클라 노출 금지 |
| `GEMINI_API_KEY`(또는 사용하는 모델) | **서버리스 전용** | ❌ 절대 클라 노출 금지 |

> 클라 노출용은 Vite면 `VITE_`, Next면 `NEXT_PUBLIC_` 접두어. **service_role/AI 키에는 절대 붙이지 마라.**

### 8.2 클라이언트 Supabase (anon) — `lib/supabase.js`
```js
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,       // Next면 process.env.NEXT_PUBLIC_...
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
// 학생 데이터 CRUD는 여기서 직접. RLS가 본인 행만 허용.
```

### 8.3 서버리스 관리자 Supabase (service_role) — `api/_admin.js`
```js
import { createClient } from '@supabase/supabase-js';
// ⚠️ 서버리스 파일에서만 import. 클라 번들에 들어가면 안 됨.
export const admin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,   // RLS 우회 마스터 키
  { auth: { persistSession: false } }
);
```

### 8.4 AI 프록시 예시 — `api/ai/roadmap.js`
```js
export default async function handler(req, res) {
  try {
    const { goalJob, shortGoals } = req.body;
    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
      body: JSON.stringify({ contents: [{ parts: [{ text:
        `진로 목표 "${goalJob}"와 단기목표 ${JSON.stringify(shortGoals)}를 별자리 로드맵 JSON(nodes,edges,quests[title,exp])으로만 응답. 설명·마크다운 금지.` }] }] })
    });
    const data = await r.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
    res.status(200).json(JSON.parse(text.replace(/```json|```/g,'').trim()));
  } catch (e) { res.status(500).json({ error: String(e) }); }
}
// 클라에서: fetch('/api/ai/roadmap', {method:'POST', body: JSON.stringify({...})})
// 받은 JSON을 roadmaps/roadmap_quests에 저장.
```

### 8.5 관리자 특권 예시 — `api/admin/reset-password.js`
```js
import { admin } from '../_admin.js';
export default async function handler(req, res) {
  // TODO: 호출자가 school_admin/super인지 검증(토큰 확인) 후 진행
  const { userId, tempPassword } = req.body;
  const { error } = await admin.auth.admin.updateUserById(userId, { password: tempPassword });
  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ ok: true }); // 임시비번을 관리자에게만 전달
}
```
> 비번 초기화·계정 생성·초대코드 발급은 **전부 이 방식**(서버리스+service_role). 클라에서 `auth.admin.*` 호출 금지.

### 8.6 순서
1. Supabase SQL Editor에 `readycareer_supabase_schema.sql` 실행(스키마+RLS+시드).
2. Storage에서 `portfolio` 버킷 생성(첨부용) + 폴더 정책(§SQL 15 참고).
3. Vercel 환경변수 4종 확인(위 표). service_role/AI 키는 서버 전용.
4. 위 연결 모듈로 배선 → 화면 개발.

---

## 9. 빌드 순서
1. SQL 실행 + 연결 모듈(§8) 세팅.
2. 인증·역할 라우팅 + **신규가입 데모 경로**(§4).
3. 학생 코어: landing→code→signup→consent→quiz(18문항)→result→career-confirm→home.
4. 4탭 + 마이페이지 + 게임화(EXP/레벨/뱃지).
5. AI 서버리스(로드맵→포트폴리오정리→결과해석 순).
6. 교사 tv-guide(생기부) + tv-dash/detail(RLS 시연).
7. 슈퍼 가입토글·초대코드(+service_role 골격).
8. 브랜드/톤 통일 + 데모 리허설.

## 10. 완료 기준
- 신규 방문자가 **가입→검사→결과→홈→마이페이지/4탭**을 에러 없이 끝까지, 새로고침해도 유지.
- 검사가 **실제 RIASEC 결과**를 내고 마이페이지에 **누적**된다.
- AI 최소 1개(로드맵/정리) 실동작.
- 교사가 자기 학교 학생만 조회 + 생기부 가이드안 추출.
- AI/service_role 키가 클라 번들에 **없다**.

## 11. 작업 방식
- 계획 먼저 승인. 태스크는 잘게. 각 단계 한 줄 보고.
- 스키마·RLS·키 취급은 추측 금지·질문.
- Phase 2 기능(학습코스·역량성장·오늘의퀘스트)은 **만들지 마라**. 스키마 자리만.
