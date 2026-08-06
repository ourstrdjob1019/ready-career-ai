// ReadyCareer AI 공식 마스코트 "아리(Ari)" 및 주요 캐릭터 에셋 URL
// 사용자 제공 정식 Public Vercel Blob Storage URL 연동 (토큰 만료 없음 100% 안정적 표출 보장)
export const ARI_BLOB_URL = "https://fea6nfqj9cdttjmk.public.blob.vercel-storage.com/%EC%BA%90%EB%A6%AD%ED%84%B0/KakaoTalk_20260713_090001607.png";
export const ARI_BLOB_NEW_URL = "https://fea6nfqj9cdttjmk.public.blob.vercel-storage.com/%EC%BA%90%EB%A6%AD%ED%84%B0/KakaoTalk_20260729_161916710.png";

import { JOB_CHARACTER_MASTER_LIST, type JobCharacterMaster } from "./jobCharacterData";
export { JOB_CHARACTER_MASTER_LIST, type JobCharacterMaster };

export const MASCOT_ASSETS = {
  avatar: ARI_BLOB_URL,
  sticker3D: ARI_BLOB_URL,
  celebrate: ARI_BLOB_URL,
  starRoadmapIcon: ARI_BLOB_URL,
  jobvengersNew: ARI_BLOB_NEW_URL,
};

export interface JobVengerItem {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  bgGradient: string;
  badgeColor: string;
  riasecCode?: string;
}

const gradients = [
  "from-[#F3EAFF] to-[#E2D4FF]",
  "from-[#E3F9FD] to-[#C1F1F8]",
  "from-[#FFEBF2] to-[#FFD5E5]",
  "from-[#FFF8E7] to-[#FFECD0]",
  "from-[#EAFBEE] to-[#CFF7DA]",
  "from-[#E6EFFF] to-[#C7DBFF]",
  "from-[#F7EAFF] to-[#EACFFF]",
  "from-[#EBFFF8] to-[#C6FFF0]",
  "from-[#FFEBEB] to-[#FFD1D1]",
  "from-[#EFF1FF] to-[#D5D9FF]",
];

const badges = [
  "text-[#7B5CF0] bg-[#7B5CF0]/15",
  "text-[#006970] bg-[#006970]/15",
  "text-[#FF4081] bg-[#FF4081]/15",
  "text-[#D97706] bg-[#D97706]/15",
  "text-[#10B981] bg-[#10B981]/15",
  "text-[#3B82F6] bg-[#3B82F6]/15",
  "text-[#9333EA] bg-[#9333EA]/15",
  "text-[#059669] bg-[#059669]/15",
  "text-[#E11D48] bg-[#E11D48]/15",
  "text-[#4F46E5] bg-[#4F46E5]/15",
];

// 첫 화면(랜딩 페이지) 및 탐험에 쓰이는 24개 실전 직업 마스터 명단 (Supabase 실물 스토리지 연결, 레벨 1 기본 표출)
export const JOB_VENGERS_LIST: JobVengerItem[] = JOB_CHARACTER_MASTER_LIST.map((item, index) => {
  const lv1Image = item.levels.find(l => l.level === 1)?.imageUrl || item.defaultImageUrl;
  return {
    id: index + 1,
    title: item.jobName,
    category: item.category,
    imageUrl: lv1Image || ARI_BLOB_URL,
    bgGradient: gradients[index % gradients.length],
    badgeColor: badges[index % badges.length],
    riasecCode: item.riasecCode,
  };
});

/** 직업명과 레벨(1~5, 또는 XP 등급)에 근거하여 실제 Supabase 캐릭터 이미지 URL을 조회하는 Helper 함수 */
export function getJobCharacterImage(jobName?: string, level: number = 1): string {
  if (!jobName) return ARI_BLOB_URL;
  const norm = jobName.replace(/\s+/g, '').toLowerCase();
  const matched = JOB_CHARACTER_MASTER_LIST.find(
    item => item.jobName.replace(/\s+/g, '').toLowerCase() === norm ||
            norm.includes(item.jobName.replace(/\s+/g, '').toLowerCase()) ||
            item.jobName.replace(/\s+/g, '').toLowerCase().includes(norm)
  );
  if (!matched) return ARI_BLOB_URL;
  const validLevel = Math.max(1, Math.min(5, level));
  const levelObj = matched.levels.find(l => l.level === validLevel);
  return levelObj?.imageUrl || matched.defaultImageUrl || ARI_BLOB_URL;
}

/** 직업명과 레벨(1~5)에 대응하는 고유 캐릭터 칭호 (예: '1. 경찰_브론즈' 또는 '02 Lv.3 이제성우') 조회 */
export function getJobCharacterTitle(jobName?: string, level: number = 1, fallbackRankName: string = "탐험가"): string {
  if (!jobName) return fallbackRankName;
  const norm = jobName.replace(/\s+/g, '').toLowerCase();
  const matched = JOB_CHARACTER_MASTER_LIST.find(
    item => item.jobName.replace(/\s+/g, '').toLowerCase() === norm ||
            norm.includes(item.jobName.replace(/\s+/g, '').toLowerCase()) ||
            item.jobName.replace(/\s+/g, '').toLowerCase().includes(norm)
  );
  if (!matched) return fallbackRankName;
  const validLevel = Math.max(1, Math.min(5, level));
  const levelObj = matched.levels.find(l => l.level === validLevel);
  if (levelObj?.name) {
    return levelObj.name.replace(/^[0-9.]+\s*/, '').trim();
  }
  return fallbackRankName;
}


