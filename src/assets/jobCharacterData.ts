/**
 * ReadyCareer AI — 24개 RIASEC 직업별 마스코트 캐릭터 레벨별 이미지 마스터 데이터
 * Supabase Storage ('character-assets') 실물 영문 ASCII 클린 매핑 완결판
 * 자동 생성일: 2026-08-06T03:12:01.474Z
 */

export interface JobCharacterLevel {
  level: number;
  name: string;
  imageUrl: string;
}

export interface JobCharacterMaster {
  jobName: string;
  category: string;
  riasecCode: 'R' | 'I' | 'A' | 'S' | 'E' | 'C';
  levels: JobCharacterLevel[];
  defaultImageUrl: string;
}

export const JOB_CHARACTER_MASTER_LIST: JobCharacterMaster[] = [
  {
    "jobName": "성우 (아리)",
    "category": "예술형(A)",
    "riasecCode": "A",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/actor_ari/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "00 Lv.1 초보성우",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/actor_ari/lv1.png"
      },
      {
        "level": 2,
        "name": "01 Lv.2 나름성우",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/actor_ari/lv2.png"
      },
      {
        "level": 3,
        "name": "02 Lv.3 이제성우",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/actor_ari/lv3.png"
      },
      {
        "level": 4,
        "name": "03 Lv.4 능숙성우",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/actor_ari/lv4.png"
      },
      {
        "level": 5,
        "name": "04 Lv.5 최고성우",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/actor_ari/lv5.png"
      }
    ]
  },
  {
    "jobName": "작곡가 (아리)",
    "category": "예술형(A)",
    "riasecCode": "A",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/composer_ari/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "00 Lv.1 초보작곡가",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/composer_ari/lv1.png"
      },
      {
        "level": 2,
        "name": "01 Lv.2 나름작곡가",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/composer_ari/lv2.png"
      },
      {
        "level": 3,
        "name": "02 Lv.3 이제작곡가",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/composer_ari/lv3.png"
      },
      {
        "level": 4,
        "name": "03 Lv.4 능숙작곡가",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/composer_ari/lv4.png"
      },
      {
        "level": 5,
        "name": "04 Lv.5 최고작곡가",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/composer_ari/lv5.png"
      }
    ]
  },
  {
    "jobName": "콘텐츠크리에이터 (토리)",
    "category": "예술형(A)",
    "riasecCode": "A",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/creator_tori/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "00 Lv.1 초보콘텐츠크리에이터",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/creator_tori/lv1.png"
      },
      {
        "level": 2,
        "name": "01 Lv.2 나름콘텐츠크리에이터",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/creator_tori/lv2.png"
      },
      {
        "level": 3,
        "name": "02 Lv.3 이제콘텐츠크리에이터",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/creator_tori/lv3.png"
      },
      {
        "level": 4,
        "name": "03 Lv.4 능숙콘텐츠크리에이터",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/creator_tori/lv4.png"
      },
      {
        "level": 5,
        "name": "04 Lv.5 최고콘텐츠크리에이터",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/creator_tori/lv5.png"
      }
    ]
  },
  {
    "jobName": "파티시에 (토리)",
    "category": "예술형(A)",
    "riasecCode": "A",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/patissier_tori/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "00 Lv.1 초보파티시에",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/patissier_tori/lv1.png"
      },
      {
        "level": 2,
        "name": "01 Lv.2 나름파티시에",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/patissier_tori/lv2.png"
      },
      {
        "level": 3,
        "name": "02 Lv.3 이제파티시에",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/patissier_tori/lv3.png"
      },
      {
        "level": 4,
        "name": "03 Lv.4 능숙파티시에",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/patissier_tori/lv4.png"
      },
      {
        "level": 5,
        "name": "04 Lv.5 최고파티시에",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/patissier_tori/lv5.png"
      }
    ]
  },
  {
    "jobName": "과학수사관",
    "category": "탐구형(I)",
    "riasecCode": "I",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/forensic_investigator/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "1. 과학수사관_브론즈",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/forensic_investigator/lv1.png"
      },
      {
        "level": 2,
        "name": "2. 과학수사관_실버",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/forensic_investigator/lv2.png"
      },
      {
        "level": 3,
        "name": "3. 과학수사관_골드",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/forensic_investigator/lv3.png"
      },
      {
        "level": 4,
        "name": "4. 과학수사관_다이아",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/forensic_investigator/lv4.png"
      },
      {
        "level": 5,
        "name": "5. 과학수사관_마스터",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/forensic_investigator/lv5.png"
      }
    ]
  },
  {
    "jobName": "로봇공학자",
    "category": "탐구형(I)",
    "riasecCode": "I",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/robotics_engineer/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "1. 로봇공학자_브론즈",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/robotics_engineer/lv1.png"
      },
      {
        "level": 2,
        "name": "2. 로봇공학자_실버",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/robotics_engineer/lv2.png"
      },
      {
        "level": 3,
        "name": "3. 로봇공학자_골드",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/robotics_engineer/lv3.png"
      },
      {
        "level": 4,
        "name": "4. 로봇공학자_다이아",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/robotics_engineer/lv4.png"
      },
      {
        "level": 5,
        "name": "5. 로봇공학자_마스터",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/robotics_engineer/lv5.png"
      }
    ]
  },
  {
    "jobName": "생명과학연구원",
    "category": "탐구형(I)",
    "riasecCode": "I",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/bioscience_researcher/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "1. 생명과학연구원_브론즈",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/bioscience_researcher/lv1.png"
      },
      {
        "level": 2,
        "name": "2. 생명과학연구원_실버",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/bioscience_researcher/lv2.png"
      },
      {
        "level": 3,
        "name": "3. 생명과학연구원_골드",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/bioscience_researcher/lv3.png"
      },
      {
        "level": 4,
        "name": "4. 생명과학연구원_다이아",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/bioscience_researcher/lv4.png"
      },
      {
        "level": 5,
        "name": "5. 생명과학연구원_마스터",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/bioscience_researcher/lv5.png"
      }
    ]
  },
  {
    "jobName": "소프트웨어개발자",
    "category": "탐구형(I)",
    "riasecCode": "I",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/software_developer/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "1. 소프트웨어개발자_브론즈",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/software_developer/lv1.png"
      },
      {
        "level": 2,
        "name": "2. 소프트웨어개발자_실버",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/software_developer/lv2.png"
      },
      {
        "level": 3,
        "name": "3. 소프트웨어개발자_골드",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/software_developer/lv3.png"
      },
      {
        "level": 4,
        "name": "4. 소프트웨어개발자_다이아",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/software_developer/lv4.png"
      },
      {
        "level": 5,
        "name": "5. 소프트웨어개발자_마스터",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/software_developer/lv5.png"
      }
    ]
  },
  {
    "jobName": "수의사",
    "category": "탐구형(I)",
    "riasecCode": "I",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/veterinarian/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "1. 수의사_브론즈",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/veterinarian/lv1.png"
      },
      {
        "level": 2,
        "name": "2. 수의사_실버",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/veterinarian/lv2.png"
      },
      {
        "level": 3,
        "name": "3. 수의사_골드",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/veterinarian/lv3.png"
      },
      {
        "level": 4,
        "name": "4. 수의사_다이아",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/veterinarian/lv4.png"
      },
      {
        "level": 5,
        "name": "5. 수의사_마스터",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/veterinarian/lv5.png"
      }
    ]
  },
  {
    "jobName": "약사",
    "category": "탐구형(I)",
    "riasecCode": "I",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/pharmacist/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "1. 약사_브론즈",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/pharmacist/lv1.png"
      },
      {
        "level": 2,
        "name": "2. 약사_실버",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/pharmacist/lv2.png"
      },
      {
        "level": 3,
        "name": "3. 약사_골드",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/pharmacist/lv3.png"
      },
      {
        "level": 4,
        "name": "4. 약사_다이아",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/pharmacist/lv4.png"
      },
      {
        "level": 5,
        "name": "5. 약사_마스터",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/pharmacist/lv5.png"
      }
    ]
  },
  {
    "jobName": "의사",
    "category": "탐구형(I)",
    "riasecCode": "I",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/doctor/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "1. 의사_브론즈",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/doctor/lv1.png"
      },
      {
        "level": 2,
        "name": "2. 의사_실버",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/doctor/lv2.png"
      },
      {
        "level": 3,
        "name": "3. 의사_골드",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/doctor/lv3.png"
      },
      {
        "level": 4,
        "name": "4. 의사_다이아",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/doctor/lv4.png"
      },
      {
        "level": 5,
        "name": "5. 의사_마스터",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/doctor/lv5.png"
      }
    ]
  },
  {
    "jobName": "정보보안전문가",
    "category": "탐구형(I)",
    "riasecCode": "I",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/security_specialist/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "1. 정보보안전문가_브론즈",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/security_specialist/lv1.png"
      },
      {
        "level": 2,
        "name": "2. 정보보안전문가_실버",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/security_specialist/lv2.png"
      },
      {
        "level": 3,
        "name": "3. 정보보안전문가_골드",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/security_specialist/lv3.png"
      },
      {
        "level": 4,
        "name": "4. 정보보안전문가_다이아",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/security_specialist/lv4.png"
      },
      {
        "level": 5,
        "name": "5. 정보보안전문가_마스터",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/security_specialist/lv5.png"
      }
    ]
  },
  {
    "jobName": "경찰",
    "category": "현실형(R)",
    "riasecCode": "R",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/police_officer/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "1. 경찰_브론즈",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/police_officer/lv1.png"
      },
      {
        "level": 2,
        "name": "2. 경찰_실버",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/police_officer/lv2.png"
      },
      {
        "level": 3,
        "name": "3. 경찰_골드",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/police_officer/lv3.png"
      },
      {
        "level": 4,
        "name": "4. 경찰_다이아",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/police_officer/lv4.png"
      },
      {
        "level": 5,
        "name": "5. 경찰_마스터",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/police_officer/lv5.png"
      }
    ]
  },
  {
    "jobName": "드론조종사",
    "category": "현실형(R)",
    "riasecCode": "R",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/drone_pilot/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "1. 드론조종사_브론즈",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/drone_pilot/lv1.png"
      },
      {
        "level": 2,
        "name": "2. 드론조종사_실버",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/drone_pilot/lv2.png"
      },
      {
        "level": 3,
        "name": "3. 드론조종사_골드",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/drone_pilot/lv3.png"
      },
      {
        "level": 4,
        "name": "4. 드론조종사_다이아",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/drone_pilot/lv4.png"
      },
      {
        "level": 5,
        "name": "5. 드론조종사_마스터",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/drone_pilot/lv5.png"
      }
    ]
  },
  {
    "jobName": "반도체엔지니어",
    "category": "현실형(R)",
    "riasecCode": "R",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/semiconductor_engineer/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "1. 반도체엔지니어_브론즈",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/semiconductor_engineer/lv1.png"
      },
      {
        "level": 2,
        "name": "2. 반도체엔지니어_실버",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/semiconductor_engineer/lv2.png"
      },
      {
        "level": 3,
        "name": "3. 반도체엔지니어_골드",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/semiconductor_engineer/lv3.png"
      },
      {
        "level": 4,
        "name": "4. 반도체엔지니어_다이아",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/semiconductor_engineer/lv4.png"
      },
      {
        "level": 5,
        "name": "5. 반도체엔지니어_마스터",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/semiconductor_engineer/lv5.png"
      }
    ]
  },
  {
    "jobName": "소방관",
    "category": "현실형(R)",
    "riasecCode": "R",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/firefighter/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "1. 소방관_브론즈",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/firefighter/lv1.png"
      },
      {
        "level": 2,
        "name": "2. 소방관_실버",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/firefighter/lv2.png"
      },
      {
        "level": 3,
        "name": "3. 소방관_골드",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/firefighter/lv3.png"
      },
      {
        "level": 4,
        "name": "4. 소방관_다이아",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/firefighter/lv4.png"
      },
      {
        "level": 5,
        "name": "5. 소방관_마스터",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/firefighter/lv5.png"
      }
    ]
  },
  {
    "jobName": "요리사",
    "category": "현실형(R)",
    "riasecCode": "R",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/chef/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "1. 요리사_브론즈",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/chef/lv1.png"
      },
      {
        "level": 2,
        "name": "2. 요리사_실버",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/chef/lv2.png"
      },
      {
        "level": 3,
        "name": "3. 요리사_골드",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/chef/lv3.png"
      },
      {
        "level": 4,
        "name": "4. 요리사_다이아",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/chef/lv4.png"
      },
      {
        "level": 5,
        "name": "5. 요리사_마스터",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/chef/lv5.png"
      }
    ]
  },
  {
    "jobName": "자동차정비사",
    "category": "현실형(R)",
    "riasecCode": "R",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/auto_mechanic/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "1. 자동차정비사_브론즈",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/auto_mechanic/lv1.png"
      },
      {
        "level": 2,
        "name": "2. 자동차정비사_실버",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/auto_mechanic/lv2.png"
      },
      {
        "level": 3,
        "name": "3. 자동차정비사_골드",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/auto_mechanic/lv3.png"
      },
      {
        "level": 4,
        "name": "4. 자동차정비사_다이아",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/auto_mechanic/lv4.png"
      },
      {
        "level": 5,
        "name": "5. 자동차정비사_마스터",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/auto_mechanic/lv5.png"
      }
    ]
  },
  {
    "jobName": "전기기사",
    "category": "현실형(R)",
    "riasecCode": "R",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/electrical_engineer/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "1. 전기기사_브론즈",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/electrical_engineer/lv1.png"
      },
      {
        "level": 2,
        "name": "2. 전기기사_실버",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/electrical_engineer/lv2.png"
      },
      {
        "level": 3,
        "name": "3. 전기기사_골드",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/electrical_engineer/lv3.png"
      },
      {
        "level": 4,
        "name": "4. 전기기사_다이아",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/electrical_engineer/lv4.png"
      },
      {
        "level": 5,
        "name": "5. 전기기사_마스터",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/electrical_engineer/lv5.png"
      }
    ]
  },
  {
    "jobName": "항공기조종사",
    "category": "현실형(R)",
    "riasecCode": "R",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/airline_pilot/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "1. 항공기조종사_브론즈",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/airline_pilot/lv1.png"
      },
      {
        "level": 2,
        "name": "2. 항공기조종사_실버",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/airline_pilot/lv2.png"
      },
      {
        "level": 3,
        "name": "3. 항공기조종사_골드",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/airline_pilot/lv3.png"
      },
      {
        "level": 4,
        "name": "4. 항공기조종사_다이아",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/airline_pilot/lv4.png"
      },
      {
        "level": 5,
        "name": "5. 항공기조종사_마스터",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/airline_pilot/lv5.png"
      }
    ]
  },
  {
    "jobName": "간호사 (아리)",
    "category": "사회형(S)",
    "riasecCode": "S",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/nurse_ari/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "00 Lv.1 초보간호사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/nurse_ari/lv1.png"
      },
      {
        "level": 2,
        "name": "01 Lv.2 나름간호사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/nurse_ari/lv2.png"
      },
      {
        "level": 3,
        "name": "02 Lv.3 이제간호사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/nurse_ari/lv3.png"
      },
      {
        "level": 4,
        "name": "03 Lv.4 능숙간호사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/nurse_ari/lv4.png"
      },
      {
        "level": 5,
        "name": "04 Lv.5 최고간호사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/nurse_ari/lv5.png"
      }
    ]
  },
  {
    "jobName": "사회복지사 (아리)",
    "category": "사회형(S)",
    "riasecCode": "S",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/social_worker_ari/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "00 Lv.1 초보사회복지사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/social_worker_ari/lv1.png"
      },
      {
        "level": 2,
        "name": "01 Lv.2 나름사회복지사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/social_worker_ari/lv2.png"
      },
      {
        "level": 3,
        "name": "02 Lv.3 이제사회복지사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/social_worker_ari/lv3.png"
      },
      {
        "level": 4,
        "name": "03 Lv.4 능숙사회복지사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/social_worker_ari/lv4.png"
      },
      {
        "level": 5,
        "name": "04 Lv.5 최고사회복지사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/social_worker_ari/lv5.png"
      }
    ]
  },
  {
    "jobName": "승무원 (토리)",
    "category": "사회형(S)",
    "riasecCode": "S",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/flight_attendant_tori/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "00 Lv.1 초보승무원",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/flight_attendant_tori/lv1.png"
      },
      {
        "level": 2,
        "name": "01 Lv.2 나름승무원",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/flight_attendant_tori/lv2.png"
      },
      {
        "level": 3,
        "name": "02 Lv.3 이제승무원",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/flight_attendant_tori/lv3.png"
      },
      {
        "level": 4,
        "name": "03 Lv.4 능숙승무원",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/flight_attendant_tori/lv4.png"
      },
      {
        "level": 5,
        "name": "04 Lv.5 최고승무원",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/flight_attendant_tori/lv5.png"
      }
    ]
  },
  {
    "jobName": "유치원교사 (토리)",
    "category": "사회형(S)",
    "riasecCode": "S",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/kindergarten_teacher_tori/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "00 Lv.1 초보유치원교사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/kindergarten_teacher_tori/lv1.png"
      },
      {
        "level": 2,
        "name": "01 Lv.2 나름유치원교사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/kindergarten_teacher_tori/lv2.png"
      },
      {
        "level": 3,
        "name": "02 Lv.3 이제유치원교사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/kindergarten_teacher_tori/lv3.png"
      },
      {
        "level": 4,
        "name": "03 Lv.4 능숙유치원교사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/kindergarten_teacher_tori/lv4.png"
      },
      {
        "level": 5,
        "name": "04 Lv.5 최고유치원교사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/kindergarten_teacher_tori/lv5.png"
      }
    ]
  }
];
