// ReadyCareer AI 공식 마스코트 "아리(Ari)" 및 주요 캐릭터 에셋 URL
// 사용자 제공 정식 Public Vercel Blob Storage URL 연동 (토큰 만료 없음 100% 안정적 표출 보장)
export const ARI_BLOB_URL = "https://fea6nfqj9cdttjmk.public.blob.vercel-storage.com/%EC%BA%90%EB%A6%AD%ED%84%B0/KakaoTalk_20260713_090001607.png";
export const ARI_BLOB_NEW_URL = "https://fea6nfqj9cdttjmk.public.blob.vercel-storage.com/%EC%BA%90%EB%A6%AD%ED%84%B0/KakaoTalk_20260729_161916710.png";

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
}

// 첫 화면(랜딩 페이지) 무한 롤링 애니메이션을 위한 '직벤져스(Job-vengers)' 3D 캐릭터 10종 마스터 명단
export const JOB_VENGERS_LIST: JobVengerItem[] = [
  { id: 1, title: "AI 진로 설계 아리", category: "진로·어드바이저", imageUrl: ARI_BLOB_URL, bgGradient: "from-[#F3EAFF] to-[#E2D4FF]", badgeColor: "text-[#7B5CF0] bg-[#7B5CF0]/15" },
  { id: 2, title: "미래 퓨처 크리에이터 아리", category: "미디어·디지털콘텐츠", imageUrl: ARI_BLOB_NEW_URL, bgGradient: "from-[#E3F9FD] to-[#C1F1F8]", badgeColor: "text-[#006970] bg-[#006970]/15" },
  { id: 3, title: "휴머노이드 로보틱스 아리", category: "차세대 공학·제어", imageUrl: ARI_BLOB_URL, bgGradient: "from-[#FFEBF2] to-[#FFD5E5]", badgeColor: "text-[#FF4081] bg-[#FF4081]/15" },
  { id: 4, title: "양자 컴퓨팅 분석가 아리", category: "AI·데이터사이언스", imageUrl: ARI_BLOB_NEW_URL, bgGradient: "from-[#FFF8E7] to-[#FFECD0]", badgeColor: "text-[#D97706] bg-[#D97706]/15" },
  { id: 5, title: "스마트 바이오 연구원 아리", category: "생명·의학공학", imageUrl: ARI_BLOB_URL, bgGradient: "from-[#EAFBEE] to-[#CFF7DA]", badgeColor: "text-[#10B981] bg-[#10B981]/15" },
  { id: 6, title: "우주항공 네비게이터 아리", category: "우주·항공 공학", imageUrl: ARI_BLOB_NEW_URL, bgGradient: "from-[#E6EFFF] to-[#C7DBFF]", badgeColor: "text-[#3B82F6] bg-[#3B82F6]/15" },
  { id: 7, title: "메타버스 그래픽 디렉터 아리", category: "3D AR/VR · 디자인", imageUrl: ARI_BLOB_URL, bgGradient: "from-[#F7EAFF] to-[#EACFFF]", badgeColor: "text-[#9333EA] bg-[#9333EA]/15" },
  { id: 8, title: "그린 클린에너지 전문가 아리", category: "ESG · 친환경에너지", imageUrl: ARI_BLOB_NEW_URL, bgGradient: "from-[#EBFFF8] to-[#C6FFF0]", badgeColor: "text-[#059669] bg-[#059669]/15" },
  { id: 9, title: "사이버 의료 데이터 아리", category: "AI 첨단 의료서비스", imageUrl: ARI_BLOB_URL, bgGradient: "from-[#FFEBEB] to-[#FFD1D1]", badgeColor: "text-[#E11D48] bg-[#E11D48]/15" },
  { id: 10, title: "스마트시티 융합 아키텍트 아리", category: "미래건축·공간", imageUrl: ARI_BLOB_NEW_URL, bgGradient: "from-[#EFF1FF] to-[#D5D9FF]", badgeColor: "text-[#4F46E5] bg-[#4F46E5]/15" },
];
