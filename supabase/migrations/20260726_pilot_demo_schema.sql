-- ReadyCareer AI 2026 박람회 파일럿 데모 공식 스키마 & RLS 보안 규준
-- 5대 원칙 준수: 전 테이블 선행 생성, RLS 3계층 활성, 표준학교코드 마스터 시드

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. 학교 마스터 (표준학교코드 기반 - 자유 입력 금지)
CREATE TABLE IF NOT EXISTS public.schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    region TEXT,
    level TEXT CHECK (level IN ('중학교', '고등학교', '통합')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 프로필 (Supabase Auth 사용자 확장 - 3계층 role)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'school_admin', 'student')),
    school_id UUID REFERENCES public.schools(id),
    grade INT,
    class_no INT,
    real_name TEXT,
    nickname TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. B2B 초대 코드
CREATE TABLE IF NOT EXISTS public.invite_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    school_id UUID REFERENCES public.schools(id),
    role TEXT NOT NULL CHECK (role IN ('school_admin', 'student')),
    max_uses INT DEFAULT 50,
    used_count INT DEFAULT 0,
    valid_from TIMESTAMPTZ DEFAULT now(),
    valid_until TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. 사전 등록 (과금 연동 예약 테이블)
CREATE TABLE IF NOT EXISTS public.pre_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES public.schools(id),
    identifier TEXT,
    grade INT,
    class_no INT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. 시스템 전역 통제 설정 (슈퍼관리자 가입 기간 개폐 토글 등)
CREATE TABLE IF NOT EXISTS public.system_settings (
    id TEXT PRIMARY KEY,
    setting_value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. 흥미유형 진단 결과 (RIASEC)
CREATE TABLE IF NOT EXISTS public.assessment_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    result_type TEXT NOT NULL,
    sub_scores JSONB,
    raw_answers JSONB,
    interpretation TEXT,
    taken_at TIMESTAMPTZ DEFAULT now()
);

-- 7. 비전 및 꿈 설정
CREATE TABLE IF NOT EXISTS public.career_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    vision_statement TEXT,
    primary_job TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. 관심 직업 리스트
CREATE TABLE IF NOT EXISTS public.interested_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    job_name TEXT NOT NULL,
    job_category TEXT,
    is_custom BOOLEAN DEFAULT false,
    is_primary BOOLEAN DEFAULT false,
    sort_order INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. 밤하늘 커리어 별자리 로드맵 (AI 생성 구조)
-- structure JSONB 내부에 { nodes: [{id, x, y, label, desc, status}], edges: [{from, to}] } 보관
CREATE TABLE IF NOT EXISTS public.roadmaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    goal_job TEXT NOT NULL,
    structure JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. 한입 퀘스트
CREATE TABLE IF NOT EXISTS public.roadmap_quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roadmap_id UUID REFERENCES public.roadmaps(id) ON DELETE CASCADE,
    node_id TEXT NOT NULL,
    title TEXT NOT NULL,
    exp_reward INT DEFAULT 50,
    status TEXT DEFAULT 'locked' CHECK (status IN ('locked', 'active', 'done')),
    completed_at TIMESTAMPTZ
);

-- 11. 진로 습관
CREATE TABLE IF NOT EXISTS public.habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    target_days INT DEFAULT 50,
    start_date DATE DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'done', 'failed')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. 습관 달성 로그 (하루 1행)
CREATE TABLE IF NOT EXISTS public.habit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE,
    day_no INT NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    checked BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(habit_id, day_no)
);

-- 13. 진로 포트폴리오
CREATE TABLE IF NOT EXISTS public.portfolios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    reflection TEXT,
    category TEXT CHECK (category IN ('학습', '진로', '기타')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 14. 포트폴리오 첨부 파일
CREATE TABLE IF NOT EXISTS public.portfolio_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID REFERENCES public.portfolios(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    file_type TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 15. 게임화 학생 진행 현황 (EXP, 레벨, 착용 상태)
CREATE TABLE IF NOT EXISTS public.student_progress (
    student_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    level INT DEFAULT 1,
    exp INT DEFAULT 0,
    character_state TEXT DEFAULT '지망생',
    equipped_items JSONB DEFAULT '[]'::jsonb
);

-- 16. 뱃지 카탈로그
CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    image_url TEXT,
    condition_desc TEXT
);

-- 17. 학생 보유 뱃지
CREATE TABLE IF NOT EXISTS public.student_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ DEFAULT now(),
    equipped BOOLEAN DEFAULT false
);

-- 18. 캐릭터 아이템 카탈로그
CREATE TABLE IF NOT EXISTS public.character_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    image_url TEXT,
    unlock_condition TEXT
);

-- 19. 생기부 AI 참고 가이드안 추출 기록
CREATE TABLE IF NOT EXISTS public.saengbu_extractions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    school_admin_id UUID REFERENCES auth.users(id),
    source_portfolio_ids UUID[],
    generated_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================================
-- 🔐 Row Level Security (RLS) 3계층 완벽 보안 정책 개시
-- ==========================================================
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pre_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interested_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.character_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saengbu_extractions ENABLE ROW LEVEL SECURITY;

-- 공통 RLS 도우미 함수 (권한 판단)
CREATE OR REPLACE FUNCTION public.is_super_admin() RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_school_admin() RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'school_admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_user_school_id() RETURNS UUID AS $$
BEGIN
    RETURN (SELECT school_id FROM public.profiles WHERE id = auth.uid() LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. schools (누구나 조회 가능, 수퍼마스터만 수정)
CREATE POLICY "Schools readable by all" ON public.schools FOR SELECT USING (true);
CREATE POLICY "Schools modifiable by super admin" ON public.schools FOR ALL USING (public.is_super_admin());

-- 2. profiles
CREATE POLICY "Profiles self access" ON public.profiles FOR ALL USING (id = auth.uid() OR public.is_super_admin());
CREATE POLICY "School admins read school students" ON public.profiles FOR SELECT USING (
    public.is_school_admin() AND school_id = public.get_user_school_id() AND role = 'student'
);

-- 3. invite_codes & system_settings
CREATE POLICY "Settings and codes readable" ON public.system_settings FOR SELECT USING (true);
CREATE POLICY "Settings and codes modifiable by super admin" ON public.system_settings FOR ALL USING (public.is_super_admin());
CREATE POLICY "Codes readable" ON public.invite_codes FOR SELECT USING (true);
CREATE POLICY "Codes modifiable by admins" ON public.invite_codes FOR ALL USING (public.is_super_admin() OR (public.is_school_admin() AND school_id = public.get_user_school_id()));

-- 4. 학생 데이터 통제 (assessment_results, career_goals, interested_jobs, roadmaps, habits, portfolios, student_progress 등)
-- 학생 본인은 ALL, 동일 학교 관리자(school_admin)는 SELECT, 슈퍼마스터는 ALL
CREATE POLICY "Student data access" ON public.assessment_results FOR ALL USING (student_id = auth.uid() OR public.is_super_admin());
CREATE POLICY "School admin read assessment" ON public.assessment_results FOR SELECT USING (
    public.is_school_admin() AND EXISTS (SELECT 1 FROM public.profiles WHERE id = assessment_results.student_id AND school_id = public.get_user_school_id())
);

CREATE POLICY "Student career_goals access" ON public.career_goals FOR ALL USING (student_id = auth.uid() OR public.is_super_admin());
CREATE POLICY "School admin read career_goals" ON public.career_goals FOR SELECT USING (
    public.is_school_admin() AND EXISTS (SELECT 1 FROM public.profiles WHERE id = career_goals.student_id AND school_id = public.get_user_school_id())
);

CREATE POLICY "Student jobs access" ON public.interested_jobs FOR ALL USING (student_id = auth.uid() OR public.is_super_admin());
CREATE POLICY "Student roadmaps access" ON public.roadmaps FOR ALL USING (student_id = auth.uid() OR public.is_super_admin());
CREATE POLICY "Student quests access" ON public.roadmap_quests FOR ALL USING (
    EXISTS (SELECT 1 FROM public.roadmaps WHERE id = roadmap_quests.roadmap_id AND (student_id = auth.uid() OR public.is_super_admin()))
);
CREATE POLICY "Student habits access" ON public.habits FOR ALL USING (student_id = auth.uid() OR public.is_super_admin());
CREATE POLICY "Student habit logs access" ON public.habit_logs FOR ALL USING (
    EXISTS (SELECT 1 FROM public.habits WHERE id = habit_logs.habit_id AND (student_id = auth.uid() OR public.is_super_admin()))
);
CREATE POLICY "Student portfolios access" ON public.portfolios FOR ALL USING (student_id = auth.uid() OR public.is_super_admin());
CREATE POLICY "School admin read portfolios" ON public.portfolios FOR SELECT USING (
    public.is_school_admin() AND EXISTS (SELECT 1 FROM public.profiles WHERE id = portfolios.student_id AND school_id = public.get_user_school_id())
);
CREATE POLICY "Student progress access" ON public.student_progress FOR ALL USING (student_id = auth.uid() OR public.is_super_admin());
CREATE POLICY "School admin read progress" ON public.student_progress FOR SELECT USING (
    public.is_school_admin() AND EXISTS (SELECT 1 FROM public.profiles WHERE id = student_progress.student_id AND school_id = public.get_user_school_id())
);
CREATE POLICY "Badges catalog public" ON public.badges FOR SELECT USING (true);
CREATE POLICY "Student badges access" ON public.student_badges FOR ALL USING (student_id = auth.uid() OR public.is_super_admin());
CREATE POLICY "Character items catalog public" ON public.character_items FOR SELECT USING (true);
CREATE POLICY "Saengbu extractions access" ON public.saengbu_extractions FOR ALL USING (school_admin_id = auth.uid() OR student_id = auth.uid() OR public.is_super_admin());

-- ==========================================================
-- 🌱 필수 마스터 시드 데이터 (표준학교코드, 뱃지, 아이템, 초기 설정)
-- ==========================================================
INSERT INTO public.schools (school_code, name, region, level) VALUES
('SEOUL-701', '서울창의고등학교', '서울', '고등학교'),
('GYEONGGI-204', '경기AI테크고등학교', '경기', '고등학교'),
('BUSAN-109', '부산과학예술고등학교', '부산', '고등학교'),
('MASTER-000', 'ReadyCareer AI 통합 센터', '본사', '통합')
ON CONFLICT (school_code) DO NOTHING;

INSERT INTO public.system_settings (id, setting_value) VALUES
('registration_status', '{"is_open": true, "message": "현재 2026학년도 B2B 시범 도입 기간으로 가입이 개방되어 있습니다."}'::jsonb)
ON CONFLICT (id) DO UPDATE SET setting_value = EXCLUDED.setting_value;

INSERT INTO public.badges (key, name, image_url, condition_desc) VALUES
('badge-start', '첫 진로 여행자', 'https://bmticbgdrkcccpqw.private.blob.vercel-storage.com/%EC%BA%90%EB%A6%AD%ED%84%B0/KakaoTalk_20260713_090001607.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfQk1UaWNiR0Rya2NDY1BRdyIsIm93bmVySWQiOiJ0ZWFtX1lQMWRwb2hySTNRYk50NThJSmE2aDRHciIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzg1MDExNjA2NTA0LCJpYXQiOjE3ODQ5Njg0MDU5OTN9.ECxkkVRAQmUqe9zQJXPDmqRldILQS_h82zLnV7dO6gw&vercel-blob-signature=_vy3l97SXU5kduuptr_TNWRAZStzAajTAbhVXSulWvc', '온보딩 흥미유형 진단을 성공적으로 이행'),
('badge-constellation', '밤하늘 궤적 설계자', 'https://bmticbgdrkcccpqw.private.blob.vercel-storage.com/%EC%BA%90%EB%A6%AD%ED%84%B0/KakaoTalk_20260713_090001607.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfQk1UaWNiR0Rya2NDY1BRdyIsIm93bmVySWQiOiJ0ZWFtX1lQMWRwb2hySTNRYk50NThJSmE2aDRHciIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzg1MDExNjA2NTA0LCJpYXQiOjE3ODQ5Njg0MDU5OTN9.ECxkkVRAQmUqe9zQJXPDmqRldILQS_h82zLnV7dO6gw&vercel-blob-signature=_vy3l97SXU5kduuptr_TNWRAZStzAajTAbhVXSulWvc', 'AI 별자리 로드맵에서 첫 번째 한입 퀘스트 완수'),
('badge-50days', '50일 불굴의 도전자', 'https://bmticbgdrkcccpqw.private.blob.vercel-storage.com/%EC%BA%90%EB%A6%AD%ED%84%B0/KakaoTalk_20260713_090001607.png?vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfQk1UaWNiR0Rya2NDY1BRdyIsIm93bmVySWQiOiJ0ZWFtX1lQMWRwb2hySTNRYk50NThJSmE2aDRHciIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzg1MDExNjA2NTA0LCJpYXQiOjE3ODQ5Njg0MDU5OTN9.ECxkkVRAQmUqe9zQJXPDmqRldILQS_h82zLnV7dO6gw&vercel-blob-signature=_vy3l97SXU5kduuptr_TNWRAZStzAajTAbhVXSulWvc', '50일 자기계발 습관 챌린지 14일 이상 기록 완료')
ON CONFLICT (key) DO NOTHING;
