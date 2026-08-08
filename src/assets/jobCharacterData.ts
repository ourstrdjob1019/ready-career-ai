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
    "jobName": "성우",
    "category": "예술형(A)",
    "riasecCode": "A",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/actor_ari/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "브론즈성우",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/actor_ari/lv1.png"
      },
      {
        "level": 2,
        "name": "실버성우",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/actor_ari/lv2.png"
      },
      {
        "level": 3,
        "name": "골드성우",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/actor_ari/lv3.png"
      },
      {
        "level": 4,
        "name": "다이아성우",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/actor_ari/lv4.png"
      },
      {
        "level": 5,
        "name": "마스터성우",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/actor_ari/lv5.png"
      }
    ]
  },
  {
    "jobName": "작곡가",
    "category": "예술형(A)",
    "riasecCode": "A",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/composer_ari/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "브론즈작곡가",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/composer_ari/lv1.png"
      },
      {
        "level": 2,
        "name": "실버작곡가",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/composer_ari/lv2.png"
      },
      {
        "level": 3,
        "name": "골드작곡가",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/composer_ari/lv3.png"
      },
      {
        "level": 4,
        "name": "다이아작곡가",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/composer_ari/lv4.png"
      },
      {
        "level": 5,
        "name": "마스터작곡가",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/composer_ari/lv5.png"
      }
    ]
  },
  {
    "jobName": "콘텐츠크리에이터",
    "category": "예술형(A)",
    "riasecCode": "A",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/creator_tori/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "브론즈콘텐츠크리에이터",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/creator_tori/lv1.png"
      },
      {
        "level": 2,
        "name": "실버콘텐츠크리에이터",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/creator_tori/lv2.png"
      },
      {
        "level": 3,
        "name": "골드콘텐츠크리에이터",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/creator_tori/lv3.png"
      },
      {
        "level": 4,
        "name": "다이아콘텐츠크리에이터",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/creator_tori/lv4.png"
      },
      {
        "level": 5,
        "name": "마스터콘텐츠크리에이터",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/creator_tori/lv5.png"
      }
    ]
  },
  {
    "jobName": "파티시에",
    "category": "예술형(A)",
    "riasecCode": "A",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/patissier_tori/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "브론즈파티시에",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/patissier_tori/lv1.png"
      },
      {
        "level": 2,
        "name": "실버파티시에",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/patissier_tori/lv2.png"
      },
      {
        "level": 3,
        "name": "골드파티시에",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/patissier_tori/lv3.png"
      },
      {
        "level": 4,
        "name": "다이아파티시에",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/A/patissier_tori/lv4.png"
      },
      {
        "level": 5,
        "name": "마스터파티시에",
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
        "name": "브론즈과학수사관",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/forensic_investigator/lv1.png"
      },
      {
        "level": 2,
        "name": "실버과학수사관",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/forensic_investigator/lv2.png"
      },
      {
        "level": 3,
        "name": "골드과학수사관",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/forensic_investigator/lv3.png"
      },
      {
        "level": 4,
        "name": "다이아과학수사관",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/forensic_investigator/lv4.png"
      },
      {
        "level": 5,
        "name": "마스터과학수사관",
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
        "name": "브론즈로봇공학자",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/robotics_engineer/lv1.png"
      },
      {
        "level": 2,
        "name": "실버로봇공학자",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/robotics_engineer/lv2.png"
      },
      {
        "level": 3,
        "name": "골드로봇공학자",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/robotics_engineer/lv3.png"
      },
      {
        "level": 4,
        "name": "다이아로봇공학자",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/robotics_engineer/lv4.png"
      },
      {
        "level": 5,
        "name": "마스터로봇공학자",
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
        "name": "브론즈생명과학연구원",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/bioscience_researcher/lv1.png"
      },
      {
        "level": 2,
        "name": "실버생명과학연구원",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/bioscience_researcher/lv2.png"
      },
      {
        "level": 3,
        "name": "골드생명과학연구원",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/bioscience_researcher/lv3.png"
      },
      {
        "level": 4,
        "name": "다이아생명과학연구원",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/bioscience_researcher/lv4.png"
      },
      {
        "level": 5,
        "name": "마스터생명과학연구원",
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
        "name": "브론즈소프트웨어개발자",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/software_developer/lv1.png"
      },
      {
        "level": 2,
        "name": "실버소프트웨어개발자",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/software_developer/lv2.png"
      },
      {
        "level": 3,
        "name": "골드소프트웨어개발자",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/software_developer/lv3.png"
      },
      {
        "level": 4,
        "name": "다이아소프트웨어개발자",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/software_developer/lv4.png"
      },
      {
        "level": 5,
        "name": "마스터소프트웨어개발자",
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
        "name": "브론즈수의사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/veterinarian/lv1.png"
      },
      {
        "level": 2,
        "name": "실버수의사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/veterinarian/lv2.png"
      },
      {
        "level": 3,
        "name": "골드수의사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/veterinarian/lv3.png"
      },
      {
        "level": 4,
        "name": "다이아수의사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/veterinarian/lv4.png"
      },
      {
        "level": 5,
        "name": "마스터수의사",
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
        "name": "브론즈약사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/pharmacist/lv1.png"
      },
      {
        "level": 2,
        "name": "실버약사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/pharmacist/lv2.png"
      },
      {
        "level": 3,
        "name": "골드약사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/pharmacist/lv3.png"
      },
      {
        "level": 4,
        "name": "다이아약사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/pharmacist/lv4.png"
      },
      {
        "level": 5,
        "name": "마스터약사",
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
        "name": "브론즈의사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/doctor/lv1.png"
      },
      {
        "level": 2,
        "name": "실버의사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/doctor/lv2.png"
      },
      {
        "level": 3,
        "name": "골드의사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/doctor/lv3.png"
      },
      {
        "level": 4,
        "name": "다이아의사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/doctor/lv4.png"
      },
      {
        "level": 5,
        "name": "마스터의사",
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
        "name": "브론즈정보보안전문가",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/security_specialist/lv1.png"
      },
      {
        "level": 2,
        "name": "실버정보보안전문가",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/security_specialist/lv2.png"
      },
      {
        "level": 3,
        "name": "골드정보보안전문가",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/security_specialist/lv3.png"
      },
      {
        "level": 4,
        "name": "다이아정보보안전문가",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/I/security_specialist/lv4.png"
      },
      {
        "level": 5,
        "name": "마스터정보보안전문가",
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
        "name": "브론즈경찰",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/police_officer/lv1.png"
      },
      {
        "level": 2,
        "name": "실버경찰",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/police_officer/lv2.png"
      },
      {
        "level": 3,
        "name": "골드경찰",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/police_officer/lv3.png"
      },
      {
        "level": 4,
        "name": "다이아경찰",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/police_officer/lv4.png"
      },
      {
        "level": 5,
        "name": "마스터경찰",
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
        "name": "브론즈드론조종사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/drone_pilot/lv1.png"
      },
      {
        "level": 2,
        "name": "실버드론조종사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/drone_pilot/lv2.png"
      },
      {
        "level": 3,
        "name": "골드드론조종사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/drone_pilot/lv3.png"
      },
      {
        "level": 4,
        "name": "다이아드론조종사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/drone_pilot/lv4.png"
      },
      {
        "level": 5,
        "name": "마스터드론조종사",
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
        "name": "브론즈반도체엔지니어",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/semiconductor_engineer/lv1.png"
      },
      {
        "level": 2,
        "name": "실버반도체엔지니어",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/semiconductor_engineer/lv2.png"
      },
      {
        "level": 3,
        "name": "골드반도체엔지니어",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/semiconductor_engineer/lv3.png"
      },
      {
        "level": 4,
        "name": "다이아반도체엔지니어",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/semiconductor_engineer/lv4.png"
      },
      {
        "level": 5,
        "name": "마스터반도체엔지니어",
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
        "name": "브론즈소방관",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/firefighter/lv1.png"
      },
      {
        "level": 2,
        "name": "실버소방관",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/firefighter/lv2.png"
      },
      {
        "level": 3,
        "name": "골드소방관",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/firefighter/lv3.png"
      },
      {
        "level": 4,
        "name": "다이아소방관",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/firefighter/lv4.png"
      },
      {
        "level": 5,
        "name": "마스터소방관",
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
        "name": "브론즈요리사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/chef/lv1.png"
      },
      {
        "level": 2,
        "name": "실버요리사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/chef/lv2.png"
      },
      {
        "level": 3,
        "name": "골드요리사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/chef/lv3.png"
      },
      {
        "level": 4,
        "name": "다이아요리사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/chef/lv4.png"
      },
      {
        "level": 5,
        "name": "마스터요리사",
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
        "name": "브론즈자동차정비사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/auto_mechanic/lv1.png"
      },
      {
        "level": 2,
        "name": "실버자동차정비사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/auto_mechanic/lv2.png"
      },
      {
        "level": 3,
        "name": "골드자동차정비사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/auto_mechanic/lv3.png"
      },
      {
        "level": 4,
        "name": "다이아자동차정비사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/auto_mechanic/lv4.png"
      },
      {
        "level": 5,
        "name": "마스터자동차정비사",
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
        "name": "브론즈전기기사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/electrical_engineer/lv1.png"
      },
      {
        "level": 2,
        "name": "실버전기기사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/electrical_engineer/lv2.png"
      },
      {
        "level": 3,
        "name": "골드전기기사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/electrical_engineer/lv3.png"
      },
      {
        "level": 4,
        "name": "다이아전기기사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/electrical_engineer/lv4.png"
      },
      {
        "level": 5,
        "name": "마스터전기기사",
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
        "name": "브론즈항공기조종사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/airline_pilot/lv1.png"
      },
      {
        "level": 2,
        "name": "실버항공기조종사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/airline_pilot/lv2.png"
      },
      {
        "level": 3,
        "name": "골드항공기조종사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/airline_pilot/lv3.png"
      },
      {
        "level": 4,
        "name": "다이아항공기조종사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/airline_pilot/lv4.png"
      },
      {
        "level": 5,
        "name": "마스터항공기조종사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/R/airline_pilot/lv5.png"
      }
    ]
  },
  {
    "jobName": "간호사",
    "category": "사회형(S)",
    "riasecCode": "S",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/nurse_ari/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "브론즈간호사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/nurse_ari/lv1.png"
      },
      {
        "level": 2,
        "name": "실버간호사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/nurse_ari/lv2.png"
      },
      {
        "level": 3,
        "name": "골드간호사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/nurse_ari/lv3.png"
      },
      {
        "level": 4,
        "name": "다이아간호사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/nurse_ari/lv4.png"
      },
      {
        "level": 5,
        "name": "마스터간호사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/nurse_ari/lv5.png"
      }
    ]
  },
  {
    "jobName": "사회복지사",
    "category": "사회형(S)",
    "riasecCode": "S",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/social_worker_ari/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "브론즈사회복지사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/social_worker_ari/lv1.png"
      },
      {
        "level": 2,
        "name": "실버사회복지사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/social_worker_ari/lv2.png"
      },
      {
        "level": 3,
        "name": "골드사회복지사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/social_worker_ari/lv3.png"
      },
      {
        "level": 4,
        "name": "다이아사회복지사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/social_worker_ari/lv4.png"
      },
      {
        "level": 5,
        "name": "마스터사회복지사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/social_worker_ari/lv5.png"
      }
    ]
  },
  {
    "jobName": "승무원",
    "category": "사회형(S)",
    "riasecCode": "S",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/flight_attendant_tori/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "브론즈승무원",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/flight_attendant_tori/lv1.png"
      },
      {
        "level": 2,
        "name": "실버승무원",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/flight_attendant_tori/lv2.png"
      },
      {
        "level": 3,
        "name": "골드승무원",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/flight_attendant_tori/lv3.png"
      },
      {
        "level": 4,
        "name": "다이아승무원",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/flight_attendant_tori/lv4.png"
      },
      {
        "level": 5,
        "name": "마스터승무원",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/flight_attendant_tori/lv5.png"
      }
    ]
  },
  {
    "jobName": "유치원교사",
    "category": "사회형(S)",
    "riasecCode": "S",
    "defaultImageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/kindergarten_teacher_tori/lv3.png",
    "levels": [
      {
        "level": 1,
        "name": "브론즈유치원교사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/kindergarten_teacher_tori/lv1.png"
      },
      {
        "level": 2,
        "name": "실버유치원교사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/kindergarten_teacher_tori/lv2.png"
      },
      {
        "level": 3,
        "name": "골드유치원교사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/kindergarten_teacher_tori/lv3.png"
      },
      {
        "level": 4,
        "name": "다이아유치원교사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/kindergarten_teacher_tori/lv4.png"
      },
      {
        "level": 5,
        "name": "마스터유치원교사",
        "imageUrl": "https://pydvuqjhzcrpauzpssxg.supabase.co/storage/v1/object/public/character-assets/S/kindergarten_teacher_tori/lv5.png"
      }
    ]
  }
];
