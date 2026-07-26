// ReadyCareer AI 공식 마스코트 "아리(Ari)" 및 주요 캐릭터 에셋 URL
// Vercel Private Blob (private.blob) URL의 토큰 만료 및 권한 차단으로 인한 공백 표시 현상을 원천 방지하기 위해 로컬 마스코트 PNG 에셋을 안정적으로 적용합니다.
import ariMascotPng from "./ari_mascot.png";

export const ARI_BLOB_URL = ariMascotPng;

export const MASCOT_ASSETS = {
  avatar: ARI_BLOB_URL,
  sticker3D: ARI_BLOB_URL,
  celebrate: ARI_BLOB_URL,
  starRoadmapIcon: ARI_BLOB_URL,
};
