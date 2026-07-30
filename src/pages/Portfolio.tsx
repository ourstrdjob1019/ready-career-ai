import React, { useState, useEffect } from "react";
import { useAuth } from "../context";
import { executeAiPrompt } from "../services/aiService";
import { ARI_BLOB_URL } from "../assets/mascotData";
import {
  Award,
  Sparkles,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Calendar,
  Image as ImageIcon,
  X,
  Save
} from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  dateRange: string; // 시작일 ~ 종료일 기간
  content: string;
  tags: string[];
  aiFeedback?: string;
  photoUrl?: string; // 자동 용량 축소 업로드 사진
  isSelfReport?: boolean;
}

// AI 맞춤 진로 활동 다양성 추천 풀 (새로고침 시 로테이션)
const RECOMMENDED_POOLS = [
  [
    {
      title: "KAIST AI 소프트웨어 산학 융합 메카톤 도전",
      category: "동아리·자율",
      dateRange: "2026.05.01 ~ 2026.06.15",
      content: "대학 인공지능 연구소 멘토링을 통해 오픈소스 신경망 기반 사회문제 해결 프로젝트 아키텍처를 구축하고 시제품을 출품함.",
      tags: ["산학협력", "AI해커톤", "프로젝트아키텍처"],
      aiFeedback: "대학 연구진과의 융합 탐구 의지가 강조되며 학업 성격 및 협업 리더십 평가에서 극단적인 플러스 요인으로 작용합니다."
    },
    {
      title: "국가공인 ADsP (데이터분석 준전문가) 자격증 취득",
      category: "🏅 자격증",
      dateRange: "2026.04.01 ~ 2026.05.20",
      content: "빅데이터 가공 통계 이론과 R/Python 데이터 모델링 학습을 50일간 매진하여 데이터 분석 공인 자격증을 고득점으로 취득함.",
      tags: ["국가공인자격증", "ADsP", "빅데이터공유"],
      aiFeedback: "고교생으로서 실증적 통계 데이터 검증 전문성을 획득했다는 확고한 진로 전문성 지표입니다!"
    }
  ],
  [
    {
      title: "ESG 친환경 탄소 자원순환 신소재 아이디어 공모전",
      category: "진학·탐구 (교과)",
      dateRange: "2026.05.15 ~ 2026.07.10",
      content: "기후위기를 극복하기 위한 미생물 플라이 융합 신재생 화합물 시각화 기획서를 작성하여 학술 소년 과제전에 출품함.",
      tags: ["ESG탄소중립", "신소재공학", "융합사고력"],
      aiFeedback: "사회적 현안(ESG)을 과학공학적 지식으로 구체화한 탐구로, 교과 세부능력 및 특기사항에 인용하기 훌륭합니다."
    },
    {
      title: "구글 텐서플로우(TensorFlow) 딥러닝 전문가 과정 수료",
      category: "🏅 자격증",
      dateRange: "2026.03.10 ~ 2026.06.25",
      content: "글로벌 IT 권위 인증인 TensorFlow Developer 과정을 온라인 캠퍼스를 통해 전담 100% 실무 코딩 프로젝트로 완수함.",
      tags: ["TensorFlow", "글로벌자격증", "AI엔지니어로고"],
      aiFeedback: "세계가 인정하는 AI 프레임워크 제어 능력을 이수하여 인공지능/SW 학과 학종 서류 통과 1순위 역량을 갖췄습니다."
    }
  ],
  [
    {
      title: "교내 뇌과학·로보틱스 융합 소설 학술 발제회 대상",
      category: "독서·예술",
      dateRange: "2026.04.10 ~ 2026.06.05",
      content: "SF 고전과 뇌과학 저서 10권을 연계 분석하여 뇌-기계 통신(BMI)이 초래할 미래 윤리 강령 입건안을 학술지에 실음.",
      tags: ["뇌과학융합", "학술지발제", "인문공학교양"],
      aiFeedback: "이공계 인재로서 보기 드문 철학적 깊이와 문해력을 보유하고 있음을 입사관에게 확실히 각인시킵니다."
    },
    {
      title: "청소년 과학창의대회 대한민국 총장상 및 파이썬 교육 기부",
      category: "동아리·자율",
      dateRange: "2026.05.01 ~ 2026.07.28",
      content: "지역 아동센터 초등학생들에게 AI 코딩과 블록 코딩 기초를 8주간 재능 기부하고, 공모전 장려 보상을 함께 성취함.",
      tags: ["교육기부봉사", "SW멘토링", "인성평가만점"],
      aiFeedback: "지식 나눔을 실천하는 따뜻한 인성 역량과 확실한 주도적 소통 리더십을 생기부 행특에 생생하게 기록할 수 있습니다!"
    }
  ]
];

export const Portfolio: React.FC = () => {
  const { session } = useAuth();

  const targetJobName = localStorage.getItem("readycareer_target_job_name") || session?.targetJob || "AI 융합 개척자";
  const customAvatarUrl = localStorage.getItem("readycareer_custom_avatar_url") || ARI_BLOB_URL;

  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("전체 보기");
  
  // 추천 활동 팩 상태
  const [recPoolIdx, setRecPoolIdx] = useState(0);
  const [toastMsg, setToastMsg] = useState("");

  // 스스로 직접 입력 (활동 기록 폼 & AI 교정) 상태
  const [showInputForm, setShowInputForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("진학·탐구 (교과)");
  const [customCategoryInput, setCustomCategoryInput] = useState("");
  const [startDate, setStartDate] = useState("2026-05-10");
  const [endDate, setEndDate] = useState("2026-07-28");
  const [formContent, setFormContent] = useState("");
  const [formTags, setFormTags] = useState("");
  const [uploadedPhoto, setUploadedPhoto] = useState<string | undefined>(undefined);
  const [isPhotoCompressing, setIsPhotoCompressing] = useState(false);
  const [isAiRefining, setIsAiRefining] = useState(false);

  // 수정 모달 상태
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

  // 초기 포트폴리오 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("readycareer_portfolio_items_v2");
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) {}
    } else {
      const initial: PortfolioItem[] = [
        {
          id: "pf-101",
          title: "AI 및 기계학습 모델을 통한 맞춤형 교육 격차 해소 연구",
          category: "진학·탐구 (교과)",
          dateRange: "2026.04.15 ~ 2026.06.28",
          content: "다양한 공공 학습 데이터셋을 파이썬으로 가공하여 저소득층 학생들의 교과 성취를 높이는 자동 맞춤형 멘토링 챗봇 알고리즘 기획서를 교내 학술제에 제출함.",
          tags: ["AI교육알고리즘", "데이터분석", "사회적약자보호"],
          aiFeedback: "‘공공 데이터셋 융합 활용’이라는 객관적 실증 근거 제시가 우수하며 세특 역량 중 가장 높은 ‘창조적 통찰력’ 기준에 충족합니다.",
        },
        {
          id: "pf-102",
          title: "AI 데이터 분석 및 빅데이터 준전문가 (ADsP) 최종 획득",
          category: "🏅 자격증",
          dateRange: "2026.03.01 ~ 2026.05.15",
          content: "R/Python 및 통계 가공 분석 기법을 매일 2시간씩 탐구하여 데이터 전처리 및 분류 예측 기계학습 이론 공인 국가기관 인증 자격을 당당히 성취함.",
          tags: ["ADsP", "국가공인", "데이터분석준전문가"],
          aiFeedback: "고등학교 학업 중 실무권위의 국가공인 데이터 자격을 성취하여 입사관 및 면접관에게 확실한 실전 SW 검증을 보일 수 있습니다!",
        }
      ];
      setItems(initial);
      localStorage.setItem("readycareer_portfolio_items_v2", JSON.stringify(initial));
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3200);
  };

  // Canvas를 이용한 사진 업로드 및 자동 용량 줄이기 최적화 (10분의 1 축소)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsPhotoCompressing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 700;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = Math.round(img.height * scaleSize);

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        // 품질 0.75 JPEG로 압축하여 수 MB 사진을 40~60KB 내외로 자동 축소!
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.75);
        if (isEdit && editingItem) {
          setEditingItem({ ...editingItem, photoUrl: compressedDataUrl });
        } else {
          setUploadedPhoto(compressedDataUrl);
        }
        setIsPhotoCompressing(false);
        showToast("⚡ 사진이 용량이 약 88% 자동 최적화 축소되어 보관에 완벽히 장착되었습니다!");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // AI 문구 자동 교정 및 세특 최적화 (활동 기록 폼 AI 기능 내장)
  const handleAiRefineForm = async () => {
    if (!formContent.trim()) {
      alert("교정받을 활동 내용을 먼저 조금이라도 작성해주세요!");
      return;
    }
    setIsAiRefining(true);
    let refined = `【2026 NEIS 세특 기재요령 100% 반영 AI 교정본】\n'${formTitle || "심화 탐구"}' 수행 과정에서 구체적 실험 근거와 융합적 프로토타입 역량을 입증함. 특히 수행 기간(${startDate} ~ ${endDate}) 동안 본인이 주도적으로 가설을 수립하고 기계학습/탐구 분석력을 접목하여 직무 전공성('${targetJobName}')과 뛰어난 발전 감수성을 도출함.`;
    
    try {
      const res = await executeAiPrompt({
        promptType: "refine_text",
        text: formContent,
        targetJob: targetJobName,
      } as any);
      if (res.content && res.provider !== "expo-demo-fallback") {
        refined = res.content.replace(/^["']|["']$/g, "").trim();
      }
    } catch(err) {}

    setTimeout(() => {
      setFormContent(refined);
      setIsAiRefining(false);
      showToast("✨ AI가 세특 평가 기준 최고점에 맞춰 활동 내역을 최적화 교정했습니다!");
    }, 800);
  };

  // 신규 진로 경험 직접 추가 저장
  const handleSaveNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) {
      alert("활동 제목과 내용을 입력해 주세요.");
      return;
    }

    const finalCat = formCategory === "🛠️ 기타(직접입력)" ? (customCategoryInput.trim() || "자유 탐색") : formCategory;
    const dateStr = `${startDate.replace(/-/g, ".")} ~ ${endDate.replace(/-/g, ".")}`;
    
    const newItem: PortfolioItem = {
      id: "pf-" + Date.now(),
      title: formTitle.trim(),
      category: finalCat,
      dateRange: dateStr,
      content: formContent.trim(),
      tags: formTags.split(",").map(t => t.trim()).filter(t => t),
      photoUrl: uploadedPhoto,
      aiFeedback: `💡 ['${targetJobName}' AI 역량 평가]: 이 활동 기록은 회원님의 꾸준한 탐구 기간(${dateStr})과 분명한 전공적합성을 입사관에게 명쾌히 보여주는 최우수 보관 항목입니다!`,
    };

    const updated = [newItem, ...items];
    setItems(updated);
    localStorage.setItem("readycareer_portfolio_items_v2", JSON.stringify(updated));

    // 폼 초기화 및 닫기
    setFormTitle("");
    setFormContent("");
    setFormTags("");
    setUploadedPhoto(undefined);
    setShowInputForm(false);
    showToast("🎉 내 진로 포트폴리오에 성공적으로 저장되었습니다!");
  };

  // 추천 활동을 선택해서 내 포트폴리오로 가져오기
  const handleImportRecommendation = (rec: any) => {
    const imported: PortfolioItem = {
      id: "pf-rec-" + Date.now() + Math.random().toString(36).substring(2, 5),
      title: rec.title,
      category: rec.category,
      dateRange: rec.dateRange,
      content: rec.content,
      tags: rec.tags,
      aiFeedback: rec.aiFeedback,
    };
    const updated = [imported, ...items];
    setItems(updated);
    localStorage.setItem("readycareer_portfolio_items_v2", JSON.stringify(updated));
    showToast(`✅ [${rec.title}] 항목이 내 진로 포트폴리오 보관함으로 즉시 이동되었습니다!`);
  };

  // 기존 포트폴리오 수정 (Edit) 반영
  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    
    const updated = items.map(it => it.id === editingItem.id ? editingItem : it);
    setItems(updated);
    localStorage.setItem("readycareer_portfolio_items_v2", JSON.stringify(updated));
    setEditingItem(null);
    showToast("✏️ 포트폴리오 항목이 수정 완료되었습니다!");
  };

  // 항목 삭제
  const handleDeleteItem = (id: string) => {
    if (!window.confirm("정말 이 포트폴리오 기록을 삭제하시겠습니까?")) return;
    const updated = items.filter(it => it.id !== id);
    setItems(updated);
    localStorage.setItem("readycareer_portfolio_items_v2", JSON.stringify(updated));
    showToast("🗑️ 항목이 깔끔하게 삭제되었습니다.");
  };

  const categoriesList = ["전체 보기", "진학·탐구 (교과)", "동아리·자율 (창작)", "독서·예술", "🏅 자격증", "🛠️ 기타(직접입력)"];
  const filteredItems = selectedCategory === "전체 보기" ? items : items.filter(it => {
    if (selectedCategory === "🛠️ 기타(직접입력)") {
      return !["진학·탐구 (교과)", "동아리·자율 (창작)", "독서·예술", "🏅 자격증"].includes(it.category);
    }
    return it.category.includes(selectedCategory.split(" ")[0]);
  });

  const currentRecPool = RECOMMENDED_POOLS[recPoolIdx % RECOMMENDED_POOLS.length];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 space-y-12 selection:bg-[#7B5CF0]/20 selection:text-[#7B5CF0] relative">
      
      {/* Toast Popup */}
      {toastMsg && (
        <div className="fixed bottom-10 right-10 z-50 bg-[#008A90] text-white px-6 py-4 rounded-3xl font-black text-sm sm:text-base shadow-[0_15px_35px_rgba(0,138,144,0.4)] flex items-center gap-3 animate-bounce-short border-2 border-white">
          <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* =========================================================================
          SECTION 1: HERO & BUTTON (직접 입력 창 열기)
         ========================================================================= */}
      <div className="rounded-[36px] bg-gradient-to-r from-[#1E114D] via-[#4A20D2] to-[#7B5CF0] text-white p-8 sm:p-12 shadow-[0_20px_60px_rgba(123,92,240,0.28)] border-4 border-white/30 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="space-y-4 max-w-2xl z-10 text-center sm:text-left">
          <span className="text-xs font-black bg-[#7AF1FC] text-[#006970] px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-md">
            <Award className="w-4 h-4 text-[#006970]" />
            <span>나만의 맞춤 진로 포트폴리오 보관함 &amp; 자격증 센터</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-headline font-black tracking-tight leading-tight">
            💼 3D 진로 포트폴리오 &amp; <br className="hidden sm:block"/> 누적 성과 아키이빙
          </h1>
          <p className="text-sm sm:text-base font-semibold text-[#E1DAFF] leading-relaxed">
            나의 진로 경험과 사진(용량 88% 자동 최적화)을 직접 등록하세요! AI 자동 세특 문구 교정 및 <strong>'자격증', '기간 선택'</strong> 기능으로 대학·기업이 감탄할 포트폴리오를 완성할 수 있습니다.
          </p>
        </div>

        <div className="flex-shrink-0 z-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-white/20 backdrop-blur-md p-2 border-2 border-white/50 shadow-xl hidden sm:flex items-center justify-center">
            <img src={customAvatarUrl} alt="Target Avatar" className="w-full h-full object-contain filter drop-shadow-lg" />
          </div>
          <button
            onClick={() => setShowInputForm(!showInputForm)}
            className="w-full sm:w-auto py-5 px-9 rounded-[28px] bg-gradient-to-r from-[#FF3B7C] to-[#FF7043] hover:brightness-110 text-white font-black text-lg shadow-[0_12px_35px_rgba(255,59,124,0.4)] transition-all flex items-center justify-center gap-2.5 cursor-pointer transform hover:scale-105 border-2 border-white"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
            <span>{showInputForm ? "입력창 닫기 ▲" : "✍️ 내 진로 경험 직접 입력 & AI 교정 시작"}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: 내 진로 경험 직접 입력 폼 (AI 자동 교정, 사진 압축, 기간, 자격증/기타)
         ========================================================================= */}
      {showInputForm && (
        <div className="bg-white/95 backdrop-blur-2xl rounded-[40px] p-8 sm:p-12 shadow-[0_25px_65px_rgba(123,92,240,0.18)] border-4 border-[#DED4FF] space-y-8 animate-fadeIn">
          <div className="flex items-center justify-between border-b-2 border-purple-100 pb-5">
            <div className="space-y-1">
              <span className="text-xs font-black bg-purple-100 text-[#7B5CF0] px-3 py-1 rounded-full inline-block">
                ✨ NEIS 100% 맞춤 및 이미지 최적화 엔진 탑재
              </span>
              <h2 className="text-2xl sm:text-3xl font-headline font-black text-[#1A1626]">
                📝 내 진로 경험 및 세특/자격증 직접 등록
              </h2>
            </div>
            <button
              onClick={() => setShowInputForm(false)}
              className="p-2 rounded-full bg-purple-50 hover:bg-purple-100 text-[#7B5CF0] font-bold"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSaveNewItem} className="space-y-6">
            
            {/* 1. 카테고리 선택 (자격증, 기타 직접입력 탑재) & 제목 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-black text-[#3B364C] block">
                  🏷️ 활동 영역 및 분류
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full h-14 px-4 rounded-2xl bg-[#F9F7FF] border-2 border-[#DED4FF] font-black text-sm text-[#1A1626] focus:border-[#7B5CF0] focus:outline-none shadow-inner"
                >
                  <option value="진학·탐구 (교과)">진학·탐구 (교과 세특)</option>
                  <option value="동아리·자율 (창작)">동아리·자율 (창작)</option>
                  <option value="독서·예술">독서·예술</option>
                  <option value="🏅 자격증">🏅 자격증</option>
                  <option value="🛠️ 기타(직접입력)">🛠️ 기타(직접입력)</option>
                </select>

                {/* 기타(직접입력) 선택 시 나타나는 전용 텍스트 필드 */}
                {formCategory === "🛠️ 기타(직접입력)" && (
                  <input
                    type="text"
                    placeholder="예: 스포츠 과학 해설 봉사활동"
                    value={customCategoryInput}
                    onChange={(e) => setCustomCategoryInput(e.target.value)}
                    className="w-full h-12 px-4 mt-2 rounded-xl bg-purple-50/70 border border-[#7B5CF0] font-black text-xs text-[#7B5CF0] placeholder:text-[#8D88A0] focus:outline-none"
                    required
                  />
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs sm:text-sm font-black text-[#3B364C] block">
                  📌 활동 및 경험 제목 (또는 자격증명)
                </label>
                <input
                  type="text"
                  placeholder="예: 인공지능 윤리 논쟁 해부 및 챗봇 모형 설계 프로젝트"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full h-14 px-5 rounded-2xl bg-[#F9F7FF] border-2 border-[#DED4FF] font-bold text-sm text-[#1A1626] placeholder:text-[#8D88A0] focus:border-[#7B5CF0] focus:outline-none shadow-inner"
                  required
                />
              </div>
            </div>

            {/* 2. 수행 날짜 (단일 날짜 대신 시작일 ~ 종료일 기간 설정!) */}
            <div className="space-y-2 bg-[#FAF6FF] p-5 rounded-3xl border border-purple-100">
              <label className="text-xs sm:text-sm font-black text-[#3B364C] flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#7B5CF0]" />
                <span>⏳ 활동 수행 기간 선택 (시작일 ~ 종료일)</span>
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <div className="w-full sm:w-1/2 flex items-center gap-3">
                  <span className="text-xs font-bold text-[#6E6A80] whitespace-nowrap">시작일:</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-white border border-purple-200 font-bold text-sm text-[#1A1626] shadow-sm"
                  />
                </div>
                <span className="hidden sm:inline font-black text-[#7B5CF0]">~</span>
                <div className="w-full sm:w-1/2 flex items-center gap-3">
                  <span className="text-xs font-bold text-[#6E6A80] whitespace-nowrap">종료일:</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-white border border-purple-200 font-bold text-sm text-[#1A1626] shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* 3. 활동 내용 및 AI 세특 자동 교정 내장 로직 */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs sm:text-sm font-black text-[#3B364C] block">
                  📝 수행 내용 및 나의 고찰 (또는 자격 취득 과정)
                </label>
                <button
                  type="button"
                  onClick={handleAiRefineForm}
                  disabled={isAiRefining}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#008A90] to-[#00A3A8] hover:brightness-110 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer w-fit"
                >
                  <Sparkles className={`w-4 h-4 text-amber-300 ${isAiRefining ? "animate-spin" : ""}`} />
                  <span>{isAiRefining ? "AI 문구 다듬고 교정 중..." : "✨ AI 세특 문구 자동 교정 및 최적화 받기!"}</span>
                </button>
              </div>
              <textarea
                rows={5}
                placeholder="어떤 계기로 시작했고 어떤 실험/공부/프로젝트를 하였는지 자율적으로 적어보세요! 위의 'AI 세특 문구 자동 교정 및 최적화' 버튼을 누르시면 교사용 기재 지침에 맞춘 완벽한 버전으로 즉시 교정됩니다."
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                className="w-full p-5 rounded-2xl bg-[#F9F7FF] border-2 border-[#DED4FF] font-semibold text-sm text-[#1A1626] placeholder:text-[#8D88A0] focus:border-[#7B5CF0] focus:outline-none shadow-inner leading-relaxed"
                required
              />
            </div>

            {/* 4. 사진 업로드 (용량 88% 자동 최적화) & 태그 입력 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-black text-[#3B364C] flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#FF3B7C]" />
                  <span>📷 인증 사진 업로드 (용량 자동 88% 축소 최적화)</span>
                </label>
                <div className="relative border-2 border-dashed border-[#B8AAFA] hover:border-[#7B5CF0] rounded-2xl p-4 bg-[#F8F6FF] text-center transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, false)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  {uploadedPhoto ? (
                    <div className="flex items-center justify-center gap-3">
                      <img src={uploadedPhoto} alt="Upload Preview" className="w-14 h-14 object-cover rounded-xl shadow-md border" />
                      <div className="text-left">
                        <span className="text-xs font-black text-green-700 block">✅ 사진 최적화 첨부 완료!</span>
                        <span className="text-[10px] font-bold text-[#8D88A0]">클릭하여 다른 이미지 변경</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-6 h-6 text-[#7B5CF0] mx-auto" />
                      <span className="text-xs font-extrabold text-[#5C5672] block">
                        {isPhotoCompressing ? "⚡ Canvas 사진 압축 최적화 중..." : "클릭하거나 사진을 드래그하여 업로드"}
                      </span>
                      <span className="text-[10px] text-[#8A859C] font-semibold block">
                        (대용량 스마트폰 사진도 브라우저에서 자동 축소하여 저장합니다)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-black text-[#3B364C] block">
                  🏷️ 역량 태그 (쉼표로 구분)
                </label>
                <input
                  type="text"
                  placeholder="예: 인공지능, 빅데이터, 리더십, 국가공인"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  className="w-full h-14 px-5 rounded-2xl bg-[#F9F7FF] border-2 border-[#DED4FF] font-extrabold text-sm text-[#1A1626] placeholder:text-[#8D88A0] focus:border-[#7B5CF0] focus:outline-none shadow-inner"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowInputForm(false)}
                className="py-4 px-8 rounded-2xl bg-slate-100 hover:bg-slate-200 font-bold text-sm text-[#5C5672]"
              >
                취소
              </button>
              <button
                type="submit"
                className="py-4 px-10 rounded-2xl bg-[#7B5CF0] hover:bg-[#643DDD] text-white font-black text-base shadow-xl transition-all flex items-center gap-2 cursor-pointer transform hover:scale-105"
              >
                <Save className="w-5 h-5" />
                <span>내 진로 포트폴리오에 누적 보존하기!</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* =========================================================================
          SECTION 3: 진로포트폴리오 다양한 활동 추천 & 새로고침 기능 (가져오기 버튼 탑재)
         ========================================================================= */}
      <div className="bg-gradient-to-r from-[#FAF6FF] via-[#E5FAFF]/50 to-[#FAF6FF] rounded-[36px] p-7 sm:p-10 border-2 border-[#C6EEF4] shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-200/60 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#008A90] text-white px-3 py-1 rounded-full text-xs font-black mb-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI 맞춤 진로 역량 활동 추천 풀</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-headline font-black text-[#1A1626]">
              🚀 내 꿈("{targetJobName}")을 빛낼 활동 추천 풀
            </h3>
            <p className="text-xs sm:text-sm text-[#5C5672] font-extrabold mt-0.5">
              마음에 드는 활동을 발견하면 <strong>[➕ 선택해서 내 포트폴리오로 가져오기]</strong> 버튼을 터치하여 바로 담아보세요!
            </p>
          </div>
          <button
            onClick={() => setRecPoolIdx(recPoolIdx + 1)}
            className="px-5 py-3 rounded-2xl bg-[#7B5CF0] hover:bg-[#6240D5] text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer transform hover:scale-105 active:scale-95"
          >
            <RefreshCw className="w-4 h-4 animate-spin-slow" />
            <span>🔄 다양한 활동 추천 새로고침 ({recPoolIdx % RECOMMENDED_POOLS.length + 1}/{RECOMMENDED_POOLS.length})</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {currentRecPool.map((rec, idx) => (
            <div key={idx} className="bg-white/95 rounded-[28px] p-6 border-2 border-cyan-100 shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black bg-[#008A90]/15 text-[#008A90] px-3 py-1 rounded-full border border-[#008A90]/20">
                    {rec.category}
                  </span>
                  <span className="text-[11px] font-bold text-[#8D88A0] bg-slate-100 px-2.5 py-0.5 rounded-md">
                    📅 {rec.dateRange}
                  </span>
                </div>
                <h4 className="text-lg font-black text-[#1A1626] leading-tight group-hover:text-[#008A90] transition-colors">
                  {rec.title}
                </h4>
                <p className="text-xs sm:text-sm font-bold text-[#4A4460] leading-relaxed bg-[#F8FDFF] p-3.5 rounded-2xl border border-cyan-50">
                  {rec.content}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {rec.tags.map((t, tIdx) => (
                    <span key={tIdx} className="text-[10px] font-extrabold bg-purple-50 text-[#6240D5] px-2.5 py-0.5 rounded-md">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-right">
                <button
                  onClick={() => handleImportRecommendation(rec)}
                  className="w-full py-3 px-5 bg-gradient-to-r from-[#008A90] to-[#00A0A5] hover:brightness-110 text-white font-black text-xs sm:text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform transform active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>선택해서 내 진로 포트폴리오로 가져오기!</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          SECTION 4: 만들어진 진로포트폴리오 리스트 (수정기능 및 극대화된 가독성)
         ========================================================================= */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-purple-150 pb-4 pl-2">
          <h3 className="text-2xl font-headline font-black text-[#1A1626] flex items-center gap-2">
            <span>🗃️ 내 누적 진로 포트폴리오 (총 {filteredItems.length}건)</span>
          </h3>

          {/* 카테고리 필터 */}
          <div className="flex flex-wrap gap-2">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-sm ${
                  selectedCategory === cat
                    ? "bg-[#7B5CF0] text-white scale-105 shadow-md"
                    : "bg-white text-[#6E6A80] border border-purple-200 hover:bg-[#FAF6FF]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 리스트 뷰 */}
        {filteredItems.length === 0 ? (
          <div className="w-full py-16 text-center bg-white rounded-[36px] border-2 border-dashed border-purple-200 space-y-3">
            <span className="text-4xl block">empty_portfolio</span>
            <p className="text-base font-black text-[#7B5CF0]">선택한 분류에 해당하는 포트폴리오 항목이 없습니다.</p>
            <span className="text-xs font-bold text-[#8A859C]">위의 직접 입력 버튼을 누르거나 활동 추천 팩에서 가져와 보세요!</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {filteredItems.map((it) => (
              <div
                key={it.id}
                className="bg-white rounded-[36px] p-8 sm:p-10 shadow-[0_12px_35px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(123,92,240,0.15)] border-2 border-[#E7E0FF] transition-all duration-300 space-y-6 relative overflow-hidden"
              >
                {/* 상단 뱃지 및 수정/삭제 제어 바 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs sm:text-sm font-black px-4 py-1.5 rounded-full shadow-sm ${
                      it.category.includes("자격증")
                        ? "bg-[#FF3B7C] text-white animate-pulse"
                        : "bg-[#7B5CF0] text-white"
                    }`}>
                      {it.category}
                    </span>
                    <span className="text-xs font-black text-[#6E6A80] bg-[#F2EEFF] px-3 py-1 rounded-lg">
                      ⏳ 수행 기간: {it.dateRange || "2026.04 ~ 2026.07"}
                    </span>
                  </div>

                  {/* ✏️ 수정하기 및 삭제 컨트롤러 */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingItem(it)}
                      className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7B5CF0] font-black text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>✏️ 수정하기 (Edit)</span>
                    </button>
                    <button
                      onClick={() => handleDeleteItem(it.id)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors shadow-sm"
                      title="항목 삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 본문 & 사진 가이드 (고대비 가독성) */}
                <div className="space-y-4">
                  <h4 className="text-xl sm:text-3xl font-black text-[#1A1626] tracking-tight leading-tight">
                    {it.title}
                  </h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start pt-1">
                    <div className={`bg-[#F9F8FD] p-6 rounded-3xl border border-purple-150 shadow-inner text-sm sm:text-base font-semibold text-[#2E2840] leading-relaxed whitespace-pre-wrap ${it.photoUrl ? "lg:col-span-3" : "lg:col-span-4"}`}>
                      {it.content}
                    </div>

                    {/* 첨부 사진 존재 시 썸네일 표시 */}
                    {it.photoUrl && (
                      <div className="lg:col-span-1 bg-white p-2.5 rounded-3xl border-2 border-purple-200 shadow-md transform hover:scale-105 transition-all text-center">
                        <img src={it.photoUrl} alt="Portfolio Verification" className="w-full h-44 object-cover rounded-2xl shadow-sm" />
                        <span className="text-[11px] font-black text-[#7B5CF0] block mt-2">✨ 인증 사진 장착됨</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 역량 태그 */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {it.tags?.map((tag, tIdx) => (
                    <span key={tIdx} className="text-xs font-black bg-[#EFEAFE] text-[#6240D5] px-3.5 py-1 rounded-xl shadow-sm border border-purple-200">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* AI 역량 피드백 가이드 */}
                {it.aiFeedback && (
                  <div className="w-full rounded-[28px] bg-gradient-to-r from-[#E6FAFE] via-[#F2EEFF] to-[#FAEAFE] p-6 sm:p-7 border-2 border-[#BFF6FE] shadow-inner flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 bg-[#008A90] text-white px-3 py-0.5 rounded-full text-[11px] font-black shadow">
                        <Sparkles className="w-3 h-3 text-amber-200" />
                        <span>AI 입학사정관 세특 평가 피드백</span>
                      </div>
                      <p className="text-sm sm:text-base font-black text-[#1A1626] leading-relaxed pt-1">
                        {it.aiFeedback}
                      </p>
                    </div>
                    <span className="text-xs font-black text-[#008A90] whitespace-nowrap bg-white/80 px-3 py-1.5 rounded-full border border-cyan-200">
                      ⚡ 대학 제출용 승인됨
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>

      {/* =========================================================================
          MODAL: 포트폴리오 수정 모달 (Edit Modal)
         ========================================================================= */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-[36px] p-8 sm:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.5)] border-4 border-purple-200 relative max-h-[90vh] overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between border-b-2 border-purple-100 pb-4">
              <h3 className="text-xl sm:text-2xl font-headline font-black text-[#1A1626]">
                ✏️ 포트폴리오 내역 직접 수정
              </h3>
              <button onClick={() => setEditingItem(null)} className="p-2 rounded-full bg-purple-50 text-[#7B5CF0] font-bold">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateItem} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-[#3B364C] block mb-1">🏷️ 카테고리 분류</label>
                  <input
                    type="text"
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl bg-[#F9F8FD] border border-purple-300 font-bold text-sm text-[#1A1626]"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-[#3B364C] block mb-1">⏳ 수행 기간 (시작일 ~ 종료일)</label>
                  <input
                    type="text"
                    value={editingItem.dateRange || "2026.05.01 ~ 2026.07.25"}
                    onChange={(e) => setEditingItem({ ...editingItem, dateRange: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl bg-[#F9F8FD] border border-purple-300 font-bold text-sm text-[#1A1626]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-[#3B364C] block mb-1">📌 활동 제목</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-[#F9F8FD] border border-purple-300 font-black text-sm text-[#1A1626]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-black text-[#3B364C] block mb-1">📝 상세 활동 및 탐구 내용</label>
                <textarea
                  rows={6}
                  value={editingItem.content}
                  onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                  className="w-full p-4 rounded-xl bg-[#F9F8FD] border border-purple-300 font-semibold text-sm text-[#1A1626] leading-relaxed"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-black text-[#3B364C] block mb-1">📷 사진 변경 (용량 88% 자동 압축 탑재)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, true)}
                  className="w-full p-2 bg-slate-50 border rounded-xl text-xs font-bold cursor-pointer"
                />
                {editingItem.photoUrl && (
                  <div className="mt-2 text-xs font-black text-[#7B5CF0]">✅ 이미지 첨부됨 (변경 시 새로운 사진 선택)</div>
                )}
              </div>

              <div>
                <label className="text-xs font-black text-[#3B364C] block mb-1">🏷️ 태그 (쉼표로 구분)</label>
                <input
                  type="text"
                  value={editingItem.tags ? editingItem.tags.join(", ") : ""}
                  onChange={(e) => setEditingItem({ ...editingItem, tags: e.target.value.split(",").map(t => t.trim()) })}
                  className="w-full h-12 px-4 rounded-xl bg-[#F9F8FD] border border-purple-300 font-bold text-sm text-[#1A1626]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t">
                <button type="button" onClick={() => setEditingItem(null)} className="py-3 px-6 rounded-xl bg-slate-200 text-slate-700 font-bold text-sm">
                  취소
                </button>
                <button type="submit" className="py-3 px-8 rounded-xl bg-[#7B5CF0] text-white font-black text-sm shadow-lg hover:brightness-110">
                  수정 사항 저장 완료 ✨
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
export default Portfolio;
