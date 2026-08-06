-- 20260806_character_assets_schema.sql
-- ReadyCareer AI : 24개 RIASEC 직업 마스코트 캐릭터 이미지 및 레벨 명칭 마스터 테이블 & Storage 버킷 생성 스크립트
-- Supabase Dashboard -> SQL Editor 에서 본 구문을 실행(Run)해 주시면 즉시 테이블 및 스토리지가 개설됩니다.

-- 1. 마스터 테이블 생성
CREATE TABLE IF NOT EXISTS public.job_character_assets (
    id SERIAL PRIMARY KEY,
    job_name TEXT NOT NULL UNIQUE,          -- 직업명 (예: 반도체엔지니어, 파티시에)
    riasec_category TEXT NOT NULL,          -- 유형 (예: 현실형(R), 예술형(A))
    riasec_code VARCHAR(1) NOT NULL,        -- RIASEC 단일 문자 (예: R, A, I, S, E, C)
    lv1_name TEXT,                          -- Lv.1 캐릭터 명칭/파일명
    lv1_image_url TEXT,                     -- Lv.1 스토리지 공용 URL
    lv2_name TEXT,                          -- Lv.2 캐릭터 명칭/파일명
    lv2_image_url TEXT,
    lv3_name TEXT,                          -- Lv.3 캐릭터 명칭/파일명
    lv3_image_url TEXT,
    lv4_name TEXT,                          -- Lv.4 캐릭터 명칭/파일명
    lv4_image_url TEXT,
    lv5_name TEXT,                          -- Lv.5 캐릭터 명칭/파일명
    lv5_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Row Level Security(RLS) 활성화 및 시연/업로드용 정책 허용
ALTER TABLE public.job_character_assets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on job_character_assets" ON public.job_character_assets;
CREATE POLICY "Allow public read access on job_character_assets" 
    ON public.job_character_assets FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Allow public all access on job_character_assets" ON public.job_character_assets;
CREATE POLICY "Allow public all access on job_character_assets" 
    ON public.job_character_assets FOR ALL
    USING (true) WITH CHECK (true);

-- 3. Supabase Storage 버킷 ('character-assets') 개설 및 공개(Public) 권한 부여
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
    'character-assets', 
    'character-assets', 
    true, 
    10485760, -- 10MB limit
    ARRAY['image/png', 'image/jpeg', 'image/webp']
) 
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/webp'];

-- 4. Storage 버킷 객체 접근 정책 설정
DROP POLICY IF EXISTS "Public Read on character-assets" ON storage.objects;
CREATE POLICY "Public Read on character-assets"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'character-assets');

DROP POLICY IF EXISTS "Public Upload on character-assets" ON storage.objects;
CREATE POLICY "Public Upload on character-assets"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'character-assets');

DROP POLICY IF EXISTS "Public Update on character-assets" ON storage.objects;
CREATE POLICY "Public Update on character-assets"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'character-assets');
