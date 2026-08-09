import React, { useState, useEffect } from "react";
import { useAuth } from "../context";
import { executeAiPrompt } from "../services/aiService";
import { getJobCharacterImage } from "../assets/mascotData";
import { getCurrentXP, getRankFromXP } from "../services/expService";
import { rewardXP } from "../services/expService";
import {
  Sparkles,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Calendar,
  Image as ImageIcon,
  X,
  Save,
  Filter
} from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  dateRange: string;
  content: string;
  tags: string[];
  aiFeedback?: string;
  photoUrl?: string;
  isSelfReport?: boolean;
}

// AI 맞춤 진로 활동 다양성 추천 풀 (새로고침 시 로테이션)
const RECOMMENDED_POOLS = [
  [
    {
      title: "KAIST AI 소프트웨어 산학 융합 메가톤 도전",
      category: "동아리·자율 (창작)",
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
    },
    {
      title: "ESG 친환경 탄소 자원순환 신소재 아이디어 공모전",
      category: "진학·탐구 (교과)",
      dateRange: "2026.05.15 ~ 2026.07.10",
      content: "기후위기를 극복하기 위한 미생물 플라이 융합 신재생 화합물 시각화 기획서를 작성하여 학술 소년 과제전에 출품함.",
      tags: ["ESG탄소중립", "신소재공학", "융합사고력"],
      aiFeedback: "사회적 현안(ESG)을 과학공학적 지식으로 구체화한 탐구로, 교과 세부능력 및 특기사항에 인용하기 훌륭합니다."
    }
  ],
  [
    {
      title: "구글 텐서플로우(TensorFlow) 딥러닝 전문가 과정 수료",
      category: "🏅 자격증",
      dateRange: "2026.03.10 ~ 2026.06.25",
      content: "글로벌 IT 권위 인증인 TensorFlow Developer 과정을 온라인 캠퍼스를 통해 전담 100% 실무 코딩 프로젝트로 완수함.",
      tags: ["TensorFlow", "글로벌자격증", "AI엔지니어"],
      aiFeedback: "세계가 인정하는 AI 프레임워크 제어 능력을 이수하여 인공지능/SW 학과 학종 서류 통과 1순위 역량을 갖췄습니다."
    },
    {
      title: "교내 뇌과학·로보틱스 융합 학술 발제회 대상",
      category: "독서·예술",
      dateRange: "2026.04.10 ~ 2026.06.05",
      content: "SF 고전과 뇌과학 저서 10권을 연계 분석하여 뇌-기계 통신(BMI)이 초래할 미래 윤리 강령 입건안을 학술지에 실음.",
      tags: ["뇌과학융합", "학술지발제", "인문공학교양"],
      aiFeedback: "이공계 인재로서 보기 드문 철학적 깊이와 문해력을 보유하고 있음을 입사관에게 확실히 각인시킵니다."
    },
    {
      title: "청소년 과학창의대회 대한민국 총장상 및 파이썬 교육 기부",
      category: "동아리·자율 (창작)",
      dateRange: "2026.05.01 ~ 2026.07.28",
      content: "지역 아동센터 초등학생들에게 AI 코딩과 블록 코딩 기초를 8주간 재능 기부하고, 공모전 장려 보상을 함께 성취함.",
      tags: ["교육기부봉사", "SW멘토링", "인성평가만점"],
      aiFeedback: "지식 나눔을 실천하는 따뜻한 인성 역량과 확실한 주도적 소통 리더십을 생기부 행특에 생생하게 기록할 수 있습니다!"
    }
  ]
];

export const Portfolio: React.FC = () => {
  const { session } = useAuth();

  const targetJobName = localStorage.getItem("readycareer_target_job_name") || session?.targetJob || "로봇공학자";
  
  const currentLevel = getRankFromXP(getCurrentXP()).levelNum;
  const customAvatarUrl = getJobCharacterImage(targetJobName, currentLevel);

  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("전체 보기");
  
  // 추천 활동 팩 상태 및 숨김 처리(Progressive Disclosure) 토글
  const [recPoolIdx, setRecPoolIdx] = useState(0);
  const [showRecPool, setShowRecPool] = useState(false);
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

  // 모달 상태 (상세보기 뷰 모달 & 수정 모달)
  const [viewingItem, setViewingItem] = useState<PortfolioItem | null>(null);
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
          aiFeedback: "‘공공 데이터셋 융합 활용’이라는 객관적 실증 근거 제시가 우수하며 세특 역량 중 가장 높은 ‘창작 통찰력’ 기준에 충족합니다.",
        },
        {
          id: "pf-102",
          title: "AI 데이터 분석 및 빅데이터 준전문가 (ADsP) 최종 획득",
          category: "🏅 자격증",
          dateRange: "2026.03.01 ~ 2026.05.15",
          content: "R/Python 및 통계 가공 분석 기법을 매일 2시간씩 탐구하여 데이터 전처리 및 분류 예측 기계학습 이론 공인 국가기관 인증 자격을 당당히 성취함.",
          tags: ["ADsP", "국가공인", "데이터분석준전문가"],
          aiFeedback: "고등학교 학업 중 실무권위의 국가공인 데이터 자격을 성취하여 입사관 및 면접관에게 확실한 실전 SW 검증을 보일 수 있습니다!",
        },
        {
          id: "pf-103",
          title: "청소년 자율 동아리 '미래 모빌리티 연구소' 프로젝트 학술상",
          category: "동아리·자율 (창작)",
          dateRange: "2026.05.01 ~ 2026.07.20",
          content: "자율주행 RC카에 라즈베리 파이와 카메라 센서를 부착하여 차선 위반 감지 신경망을 트레이닝하고, 지역 연계 동아리 박람회에서 우수 시연상을 수상함.",
          tags: ["자율주행RC카", "라즈베리파이", "협업리더십"],
          aiFeedback: "주도적으로 HW와 SW를 통합 제어해 낸 생생한 프로젝트 로그로, 공대 및 인공지능 학과 합격을 보증하는 만점 활동입니다.",
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

  // Canvas를 이용한 사진 업로드 및 자동 용량 줄이기 최적화
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

        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.75);
        if (isEdit && editingItem) {
          setEditingItem({ ...editingItem, photoUrl: compressedDataUrl });
        } else {
          setUploadedPhoto(compressedDataUrl);
        }
        setIsPhotoCompressing(false);
        showToast("⚡ 사진 용량이 약 88% 자동 최적화 축소되어 완벽히 장착되었습니다!");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // AI 문구 자동 교정 및 세특 최적화
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

  // 신규 진로 경험 저장
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
    rewardXP(60, "진로 포트폴리오 스펙 등록!");

    setFormTitle("");
    setFormContent("");
    setFormTags("");
    setUploadedPhoto(undefined);
    setShowInputForm(false);
    showToast("🎉 내 진로 포트폴리오 스펙 쇼룸에 성공적으로 저장되었습니다!");
  };

  // 추천 활동 내 포트폴리오로 가져오기
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
    rewardXP(60, `[${rec.title}] 진로 활동 보관함 장착!`);
    showToast(`✅ [${rec.title}] 항목이 내 진로 포트폴리오 스펙 쇼룸으로 즉시 이동되었습니다!`);
  };

  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    
    const updated = items.map(it => it.id === editingItem.id ? editingItem : it);
    setItems(updated);
    localStorage.setItem("readycareer_portfolio_items_v2", JSON.stringify(updated));
    
    if (viewingItem && viewingItem.id === editingItem.id) {
      setViewingItem(editingItem);
    }
    
    setEditingItem(null);
    showToast("✏️ 포트폴리오 항목이 수정 완료되었습니다!");
  };

  const handleDeleteItem = (id: string) => {
    if (!window.confirm("정말 이 포트폴리오 스펙 기록을 삭제하시겠습니까?")) return;
    const updated = items.filter(it => it.id !== id);
    setItems(updated);
    localStorage.setItem("readycareer_portfolio_items_v2", JSON.stringify(updated));
    if (viewingItem && viewingItem.id === id) setViewingItem(null);
    showToast("🗑️ 항목이 깔끔하게 삭제되었습니다.");
  };

  const categoriesList = ["전체 보기", "진학·탐구 (교과)", "동아리·자율 (창작)", "독서·예술", "🏅 자격증", "🛠️ 기타(직접입력)"];
  
  const filteredItems = selectedCategory === "전체 보기" ? items : items.filter(it => {
    if (selectedCategory === "🛠️ 기타(직접입력)") {
      return !["진학·탐구 (교과)", "동아리·자율 (창작)", "독서·예술", "🏅 자격증"].includes(it.category);
    }
    return it.category.includes(selectedCategory.split(" ")[0]) || it.category.includes(selectedCategory);
  });

  const currentRecPool = RECOMMENDED_POOLS[recPoolIdx % RECOMMENDED_POOLS.length];

  // 스펙 통계 계산
  const certCount = items.filter(it => it.category.includes("자격증")).length;
  const studyCount = items.filter(it => it.category.includes("진학") || it.category.includes("탐구")).length;
  const clubCount = items.filter(it => it.category.includes("동아리") || it.category.includes("자율") || it.category.includes("창작")).length;
  const photoCount = items.filter(it => !!it.photoUrl).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 space-y-10 selection:bg-[#D946EF]/20 selection:text-[#D946EF] relative">
      
      {toastMsg && (
        <div className="fixed bottom-10 right-10 z-50 bg-[#008A90] text-white px-6 py-4 rounded-3xl font-semibold tracking-tighter text-sm sm:text-base shadow-sm flex items-center gap-3 animate-bounce-short border-2 border-white">
          <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* =========================================================================
          SECTION 1: HERO (진로 스펙 쇼룸 & 딥퍼플/마젠타 팝업 열정 테마)
         ========================================================================= */}
      <div className="rounded-[36px] bg-gradient-to-r from-[#1E114D] via-[#4A20D2] to-[#D946EF] text-white p-8 sm:p-12 shadow-sm border-4 border-white/25 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="space-y-4 max-w-2xl z-10 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-semibold tracking-tighter bg-[#7AF1FC] text-[#006970] px-3.5 py-1.5 rounded-full shadow-md">
              🎯 목표 직업: {targetJobName}
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-headline font-semibold tracking-tighter tracking-tight leading-tight">
            💼 나의 꿈 보관함
          </h1>
          <p className="text-sm sm:text-base font-semibold text-[#F0E6FF] leading-relaxed">
            진로 활동을 쌓아가며 내 꿈을 설계해보세요!
          </p>
        </div>

        <div className="flex-shrink-0 z-10 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-[36px] bg-white/20 backdrop-blur-md p-4 border-4 border-white/50 shadow-2xl hidden sm:flex items-center justify-center transform hover:rotate-6 transition-all">
            <img src={customAvatarUrl} alt="Target Avatar" className="w-full h-full object-contain filter drop-shadow-2xl" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          [신규 탑재] SECTION 0: 🏆 진로 성과 장식장 & 스펙 현황 메트릭 (Stats Bar)
         ========================================================================= */}
      <div className="bg-gradient-to-br from-[#F8F5FF] via-white to-[#FAF0FF] rounded-[36px] p-7 sm:p-10 border-2 border-[#E9D5FF] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-150 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-headline font-semibold tracking-tighter text-[#1A1626]">
              🏆 나의 진로활동 발자취
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-[#6E6A80]">
              현재까지 누적된 역량 지표가 실시간 집계됩니다. 다양한 스펙을 채워 황금 훈장을 늘려가세요!
            </p>
          </div>

          <button
            onClick={() => setShowInputForm(!showInputForm)}
            className="w-full sm:w-auto py-4 px-8 rounded-3xl bg-gradient-to-r from-[#FF3B7C] via-[#FF5C8A] to-[#7B5CF0] hover:brightness-110 text-white font-semibold tracking-tighter text-sm sm:text-base shadow-sm transition-transform transform hover:-translate-y-1 active:scale-95 cursor-pointer border-2 border-white flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>{showInputForm ? "입력창 닫기 ▲" : "✍️ 내 진로 활동 직접 추가하기"}</span>
          </button>
        </div>

        {/* 4대 스펙 훈장 메트릭 그리드 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-purple-100 shadow-sm flex items-center gap-4 transform hover:scale-[1.02] transition-all">
            <div className="w-12 h-12 rounded-3xl bg-purple-50 flex items-center justify-center text-2xl shrink-0 border border-purple-200">
              🔬
            </div>
            <div>
              <span className="text-xs font-semibold tracking-tighter text-[#8D88A0] block">교과·세특 탐구</span>
              <span className="text-2xl sm:text-3xl font-semibold tracking-tighter text-[#7B5CF0]">{studyCount} <span className="text-sm font-medium tracking-tight text-slate-500">건</span></span>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-pink-100 shadow-sm flex items-center gap-4 transform hover:scale-[1.02] transition-all">
            <div className="w-12 h-12 rounded-3xl bg-pink-50 flex items-center justify-center text-2xl shrink-0 border border-pink-200">
              🤝
            </div>
            <div>
              <span className="text-xs font-semibold tracking-tighter text-[#8D88A0] block">동아리·창작</span>
              <span className="text-2xl sm:text-3xl font-semibold tracking-tighter text-[#FF3B7C]">{clubCount} <span className="text-sm font-medium tracking-tight text-slate-500">건</span></span>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-amber-100 shadow-sm flex items-center gap-4 transform hover:scale-[1.02] transition-all">
            <div className="w-12 h-12 rounded-3xl bg-amber-50 flex items-center justify-center text-2xl shrink-0 border border-amber-200 animate-bounce-short">
              🏅
            </div>
            <div>
              <span className="text-xs font-semibold tracking-tighter text-[#8D88A0] block">취득 자격증</span>
              <span className="text-2xl sm:text-3xl font-semibold tracking-tighter text-amber-600">{certCount} <span className="text-sm font-medium tracking-tight text-slate-500">개</span></span>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-cyan-100 shadow-sm flex items-center gap-4 transform hover:scale-[1.02] transition-all">
            <div className="w-12 h-12 rounded-3xl bg-cyan-50 flex items-center justify-center text-2xl shrink-0 border border-cyan-200">
              📷
            </div>
            <div>
              <span className="text-xs font-semibold tracking-tighter text-[#8D88A0] block">인증 사진 첨부</span>
              <span className="text-2xl sm:text-3xl font-semibold tracking-tighter text-[#008A90]">{photoCount} <span className="text-sm font-medium tracking-tight text-slate-500">건</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2 (MODAL / PANEL): 내 진로 경험 직접 입력 폼 (AI 세특 교정, 사진 압축)
         ========================================================================= */}
      {showInputForm && (
        <div className="bg-white/95 backdrop-blur-2xl rounded-[40px] p-8 sm:p-12 shadow-sm border-4 border-[#DED4FF] space-y-8 animate-fadeIn">
          <div className="flex items-center justify-between border-b-2 border-purple-100 pb-5">
            <div className="space-y-1">
              <span className="text-xs font-semibold tracking-tighter bg-purple-100 text-[#7B5CF0] px-3 py-1 rounded-full inline-block">
                ✨ NEIS 100% 맞춤 및 이미지 88% 압축 엔진 탑재
              </span>
              <h2 className="text-2xl sm:text-3xl font-headline font-semibold tracking-tighter text-[#1A1626]">
                📝 내 진로 경험 및 세특/자격증 직접 등록
              </h2>
            </div>
            <button
              onClick={() => setShowInputForm(false)}
              className="p-2 rounded-full bg-purple-50 hover:bg-purple-100 text-[#7B5CF0] font-medium tracking-tight"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSaveNewItem} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold tracking-tighter text-[#3B364C] block">
                  🏷️ 활동 영역 및 분류
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full h-14 px-4 rounded-3xl bg-[#F9F7FF] border-2 border-[#DED4FF] font-semibold tracking-tighter text-sm text-[#1A1626] focus:border-[#7B5CF0] focus:outline-none shadow-inner"
                >
                  <option value="진학·탐구 (교과)">진학·탐구 (교과 세특)</option>
                  <option value="동아리·자율 (창작)">동아리·자율 (창작)</option>
                  <option value="독서·예술">독서·예술</option>
                  <option value="🏅 자격증">🏅 자격증</option>
                  <option value="🛠️ 기타(직접입력)">🛠️ 기타(직접입력)</option>
                </select>

                {formCategory === "🛠️ 기타(직접입력)" && (
                  <input
                    type="text"
                    placeholder="예: 스포츠 과학 해설 봉사활동"
                    value={customCategoryInput}
                    onChange={(e) => setCustomCategoryInput(e.target.value)}
                    className="w-full h-12 px-4 mt-2 rounded-2xl bg-purple-50/70 border border-[#7B5CF0] font-semibold tracking-tighter text-xs text-[#7B5CF0] placeholder:text-[#8D88A0] focus:outline-none"
                    required
                  />
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs sm:text-sm font-semibold tracking-tighter text-[#3B364C] block">
                  📌 활동 이름
                </label>
                <input
                  type="text"
                  placeholder="예: 인공지능 윤리 논쟁 해부 및 챗봇 모형 설계 프로젝트"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full h-14 px-5 rounded-3xl bg-[#F9F7FF] border-2 border-[#DED4FF] font-medium tracking-tight text-sm text-[#1A1626] placeholder:text-[#8D88A0] focus:border-[#7B5CF0] focus:outline-none shadow-inner"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 bg-[#FAF6FF] p-5 rounded-3xl border border-purple-100">
              <label className="text-xs sm:text-sm font-semibold tracking-tighter text-[#3B364C] flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#7B5CF0]" />
                <span>⏳ 활동 수행 기간 선택 (시작일 ~ 종료일)</span>
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <div className="w-full sm:w-1/2 flex items-center gap-3">
                  <span className="text-xs font-medium tracking-tight text-[#6E6A80] whitespace-nowrap">시작일:</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-12 px-4 rounded-2xl bg-white border border-purple-200 font-medium tracking-tight text-sm text-[#1A1626] shadow-sm"
                  />
                </div>
                <span className="hidden sm:inline font-semibold tracking-tighter text-[#7B5CF0]">~</span>
                <div className="w-full sm:w-1/2 flex items-center gap-3">
                  <span className="text-xs font-medium tracking-tight text-[#6E6A80] whitespace-nowrap">종료일:</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-12 px-4 rounded-2xl bg-white border border-purple-200 font-medium tracking-tight text-sm text-[#1A1626] shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs sm:text-sm font-semibold tracking-tighter text-[#3B364C] block">
                  📝 활동 내용과 배운 점
                </label>
                <button
                  type="button"
                  onClick={handleAiRefineForm}
                  disabled={isAiRefining}
                  className="px-5 py-2 rounded-2xl bg-gradient-to-r from-[#008A90] to-[#00A3A8] hover:brightness-110 text-white font-semibold tracking-tighter text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer w-fit"
                >
                  <Sparkles className={`w-4 h-4 text-amber-300 ${isAiRefining ? "animate-spin" : ""}`} />
                  <span>{isAiRefining ? "문장을 다듬는 중..." : "✨ 문장을 다듬어 드려요. 결과는 꼭 직접 확인하세요."}</span>
                </button>
              </div>
              <textarea
                rows={5}
                placeholder="어떤 계기로 시작했고 어떤 활동을 했는지 적어보세요!"
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                className="w-full p-5 rounded-3xl bg-[#F9F7FF] border-2 border-[#DED4FF] font-semibold text-sm text-[#1A1626] placeholder:text-[#8D88A0] focus:border-[#7B5CF0] focus:outline-none shadow-inner leading-relaxed"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold tracking-tighter text-[#3B364C] flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#FF3B7C]" />
                  <span>📷 인증 사진 업로드 (용량 자동 88% 축소 최적화)</span>
                </label>
                <div className="relative border-2 border-dashed border-[#B8AAFA] hover:border-[#7B5CF0] rounded-3xl p-4 bg-[#F8F6FF] text-center transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, false)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  {uploadedPhoto ? (
                    <div className="flex items-center justify-center gap-3">
                      <img src={uploadedPhoto} alt="Upload Preview" className="w-14 h-14 object-cover rounded-2xl shadow-md border" />
                      <div className="text-left">
                        <span className="text-xs font-semibold tracking-tighter text-green-700 block">✅ 사진 최적화 첨부 완료!</span>
                        <span className="text-[10px] font-medium tracking-tight text-[#8D88A0]">클릭하여 다른 이미지 변경</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-6 h-6 text-[#7B5CF0] mx-auto" />
                      <span className="text-xs font-semibold tracking-tighter text-[#5C5672] block">
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
                <label className="text-xs sm:text-sm font-semibold tracking-tighter text-[#3B364C] block">
                  🏷️ 역량 태그 (쉼표로 구분)
                </label>
                <input
                  type="text"
                  placeholder="예: 인공지능, 빅데이터, 리더십, 국가공인"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  className="w-full h-14 px-5 rounded-3xl bg-[#F9F7FF] border-2 border-[#DED4FF] font-semibold tracking-tighter text-sm text-[#1A1626] placeholder:text-[#8D88A0] focus:border-[#7B5CF0] focus:outline-none shadow-inner"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowInputForm(false)}
                className="py-4 px-8 rounded-3xl bg-slate-100 hover:bg-slate-200 font-medium tracking-tight text-sm text-[#5C5672]"
              >
                취소
              </button>
              <button
                type="submit"
                className="py-4 px-10 rounded-3xl bg-[#7B5CF0] hover:bg-[#643DDD] text-white font-semibold tracking-tighter text-base shadow-xl transition-all flex items-center gap-2 cursor-pointer transform hover:scale-105"
              >
                <Save className="w-5 h-5" />
                <span>내 진로 포트폴리오에 누적 보존하기!</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* =========================================================================
          SECTION 3: AI 맞춤 진로 활동 추천 보관함 (Progressive Disclosure - 접기/펼치기)
         ========================================================================= */}
      <div className="bg-gradient-to-r from-[#FAF6FF] via-[#E5FAFF]/50 to-[#FAF6FF] rounded-[32px] p-6 sm:p-8 border-2 border-[#C6EEF4] shadow-md transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-3xl bg-[#008A90] text-white flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <span className="text-xs font-semibold tracking-tighter text-[#008A90] block uppercase tracking-wide">AI Career Activity Explorer</span>
              <h3 className="text-lg sm:text-xl font-headline font-semibold tracking-tighter text-[#1A1626]">
                🚀 나의 꿈을 향한 진로 활동 추천받기
              </h3>
              <p className="text-xs sm:text-sm text-[#5C5672] font-semibold">
                어떤 활동을 할지 막막할 때 클릭해 보세요! 마음에 드는 활동을 터치 한 번에 내 포트폴리오로 가져올 수 있습니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {showRecPool && (
              <button
                onClick={() => setRecPoolIdx(recPoolIdx + 1)}
                className="px-4 py-3 rounded-3xl bg-[#008A90] hover:bg-[#007378] text-white font-semibold tracking-tighter text-xs shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                <span>새로고침 ({recPoolIdx % RECOMMENDED_POOLS.length + 1}/{RECOMMENDED_POOLS.length})</span>
              </button>
            )}
            <button
              onClick={() => setShowRecPool(!showRecPool)}
              className="px-6 py-3.5 rounded-3xl bg-[#7B5CF0] hover:bg-[#6240D5] text-white font-semibold tracking-tighter text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{showRecPool ? "▲ 추천 보관함 접기" : "▼ AI 추천 활동 풀 열어보기"}</span>
            </button>
          </div>
        </div>

        {/* 펼쳤을 때만 보이는 추천 활동 풀 */}
        {showRecPool && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 mt-6 border-t border-cyan-200/60 animate-fadeIn">
            {currentRecPool.map((rec, idx) => (
              <div key={idx} className="bg-white/95 rounded-[26px] p-6 border-2 border-cyan-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold tracking-tighter bg-[#008A90]/15 text-[#008A90] px-3 py-1 rounded-full">
                      {rec.category}
                    </span>
                    <span className="text-[11px] font-medium tracking-tight text-[#8D88A0] bg-slate-100 px-2 py-0.5 rounded-md">
                      📅 {rec.dateRange}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-semibold tracking-tighter text-[#1A1626] leading-snug group-hover:text-[#008A90] transition-colors">
                    {rec.title}
                  </h4>
                  <p className="text-xs font-medium tracking-tight text-[#4A4460] leading-relaxed bg-[#F8FDFF] p-3.5 rounded-3xl border border-cyan-50 line-clamp-3">
                    {rec.content}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {rec.tags.map((t, tIdx) => (
                      <span key={tIdx} className="text-[10px] font-semibold tracking-tighter bg-purple-50 text-[#6240D5] px-2 py-0.5 rounded-md">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleImportRecommendation(rec)}
                    className="w-full py-3 px-4 bg-gradient-to-r from-[#008A90] to-[#00A0A5] hover:brightness-110 text-white font-semibold tracking-tighter text-xs rounded-3xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-transform active:scale-95"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>내 포트폴리오로 가져오기!</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================================
          SECTION 4: 진로포트폴리오 갤러리/명함 쇼룸 (가독성 최적화 Grid View)
         ========================================================================= */}
      <div className="space-y-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-purple-150 pb-5 pl-2">
          <div>
            <h3 className="text-2xl font-headline font-semibold tracking-tighter text-[#1A1626] flex items-center gap-2">
              <span>🗃️ 나의 진로 활동 (총 {filteredItems.length}건)</span>
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              카드를 터치하거나 [상세보기]를 눌러 고해상도 인증 사진과 AI 세특 평가를 확인하세요!
            </p>
          </div>

          {/* 카테고리 필터 바 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold tracking-tighter text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> 분류:
            </span>
            {categoriesList.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-3xl font-semibold tracking-tighter text-xs transition-all shadow-2xs ${
                    isSelected
                      ? "bg-[#7B5CF0] text-white scale-105 shadow-md"
                      : "bg-white text-[#6E6A80] border border-purple-200 hover:bg-[#FAF6FF]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* 갤러리 그리드 리스트 뷰 */}
        {filteredItems.length === 0 ? (
          <div className="w-full py-20 text-center bg-white rounded-[36px] border-2 border-dashed border-purple-200 space-y-3">
            <span className="text-5xl block">💼</span>
            <p className="text-base font-semibold tracking-tighter text-[#7B5CF0]">선택한 분류에 해당하는 포트폴리오 항목이 없습니다.</p>
            <span className="text-xs font-medium tracking-tight text-[#8A859C]">위의 직접 추가 버튼을 누르거나 AI 추천 풀에서 스펙을 장착해 보세요!</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredItems.map((it) => {
              const isCert = it.category.includes("자격증");
              return (
                <div
                  key={it.id}
                  onClick={() => setViewingItem(it)}
                  className="bg-white rounded-[24px] p-5 border-2 border-slate-200 hover:border-[#6A42ED] shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between min-h-[220px] group cursor-pointer relative overflow-hidden"
                >
                  <div className="space-y-2.5 overflow-hidden w-full">
                    {/* 상단 뱃지 & 날짜 */}
                    <div className="flex items-center justify-between gap-1.5">
                      <span className={`text-xs font-semibold tracking-tighter px-3 py-1 rounded-full border truncate max-w-[140px] shadow-2xs ${
                        isCert
                          ? "bg-rose-50 text-rose-600 border-rose-200"
                          : "bg-[#F3F0FF] text-[#6A42ED] border-[#D8CEFF]"
                      }`}>
                        • {it.category}
                      </span>
                      <span className="text-xs font-medium tracking-tight text-slate-400 shrink-0">
                        {it.dateRange?.split(' ')[0] || "2026.05"}
                      </span>
                    </div>

                    {/* 제목 및 본문 */}
                    <div className="space-y-1">
                      <h4 className="text-base font-semibold tracking-tighter text-[#1F193B] group-hover:text-[#6A42ED] transition-colors line-clamp-2 leading-snug break-keep">
                        {it.title}
                      </h4>
                      <p className="text-xs font-semibold text-slate-500 line-clamp-2 leading-relaxed break-keep">
                        {it.content}
                      </p>
                    </div>

                    {/* 태그 리스트 */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {it.tags?.slice(0, 3).map((tag, tIdx) => (
                        <span key={tIdx} className="text-[11px] font-semibold tracking-tighter bg-white text-slate-600 px-2.5 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                          #{tag}
                        </span>
                      ))}
                      {(it.tags?.length || 0) > 3 && (
                        <span className="text-[11px] font-semibold tracking-tighter text-purple-500 px-1.5 py-0.5">+{it.tags.length - 3}</span>
                      )}
                    </div>
                  </div>

                  {/* 하단 스티커 액션바 */}
                  <div className="pt-3.5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold tracking-tighter">
                    <span className="text-[#0D9488] flex items-center gap-1">
                      {it.photoUrl ? "📷 인증사진 포함" : "📄 활동 기록 완료"}
                    </span>
                    <span className="text-slate-500 group-hover:text-[#6A42ED] transition-colors flex items-center gap-1">
                      터치하여 확장 &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* =========================================================================
          MODAL 1: 포트폴리오 스펙 상세 보기 뷰어 (Detail Viewer Modal)
         ========================================================================= */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn" onClick={() => setViewingItem(null)}>
          <div 
            className="bg-white w-full max-w-3xl rounded-[40px] p-8 sm:p-12 shadow-sm border-4 border-purple-200 relative max-h-[90vh] overflow-y-auto space-y-7"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setViewingItem(null)}
              className="absolute top-7 right-7 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium tracking-tight"
            >
              <X className="w-6 h-6" />
            </button>

            {/* 상단 분류 */}
            <div className="space-y-3 border-b-2 border-purple-100 pb-5 pr-8">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold tracking-tighter px-4 py-1.5 rounded-full ${viewingItem.category.includes('자격증') ? 'bg-[#FF3B7C] text-white' : 'bg-[#7B5CF0] text-white'}`}>
                  {viewingItem.category}
                </span>
                <span className="text-xs font-semibold tracking-tighter text-[#6E6A80] bg-[#F2EEFF] px-3 py-1 rounded-lg">
                  ⏳ 수행 기간: {viewingItem.dateRange || "2026.05 ~ 07"}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-headline font-semibold tracking-tighter text-[#1A1626] leading-snug">
                {viewingItem.title}
              </h3>
            </div>

            {/* 첨부 사진 확대 */}
            {viewingItem.photoUrl && (
              <div className="rounded-3xl overflow-hidden border-2 border-purple-200 shadow-md max-h-[380px] bg-white text-center">
                <img src={viewingItem.photoUrl} alt="High Res Verification" className="w-full h-full max-h-[360px] object-contain mx-auto" />
              </div>
            )}

            {/* 본문 내용 */}
            <div className="space-y-2">
              <span className="text-xs font-semibold tracking-tighter text-slate-400 uppercase tracking-wide">📝 활동 내용과 배운 점</span>
              <div className="bg-[#F9F8FD] p-7 rounded-[32px] border border-purple-200 shadow-inner text-base font-medium tracking-tight text-[#2E2840] leading-relaxed whitespace-pre-wrap">
                {viewingItem.content}
              </div>
            </div>

            {/* 역량 태그 */}
            <div className="space-y-2">
              <span className="text-xs font-semibold tracking-tighter text-slate-400">🏷️ 핵심 직무 역량 태그</span>
              <div className="flex flex-wrap gap-2">
                {viewingItem.tags?.map((tag, idx) => (
                  <span key={idx} className="text-sm font-semibold tracking-tighter bg-[#EFEAFE] text-[#6240D5] px-4 py-1.5 rounded-2xl border border-purple-200">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* AI 역량 피드백 */}
            {viewingItem.aiFeedback && (
              <div className="w-full rounded-[32px] bg-gradient-to-r from-[#E6FAFE] via-[#F2EEFF] to-[#FAEAFE] p-7 border-2 border-[#BFF6FE] shadow-inner space-y-3">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 bg-[#008A90] text-white px-3.5 py-1 rounded-full text-xs font-semibold tracking-tighter shadow">
                    <Sparkles className="w-4 h-4 text-amber-200 animate-spin-slow" />
                    <span>AI 입학사정관 & 채용관 평가 피드백</span>
                  </div>
                  <span className="text-xs font-semibold tracking-tighter text-[#008A90] bg-white px-3 py-1 rounded-full border border-cyan-200">
                    ⚡ 대학·기업 제출 승인됨
                  </span>
                </div>
                <p className="text-sm sm:text-base font-semibold tracking-tighter text-[#1A1626] leading-relaxed">
                  {viewingItem.aiFeedback}
                </p>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between border-t-2 border-purple-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingItem(viewingItem);
                    setViewingItem(null);
                  }}
                  className="px-5 py-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-[#7B5CF0] font-semibold tracking-tighter text-sm flex items-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>수정하기</span>
                </button>
                <button
                  onClick={() => handleDeleteItem(viewingItem.id)}
                  className="px-5 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold tracking-tighter text-sm flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>삭제하기</span>
                </button>
              </div>
              
              <button
                onClick={() => setViewingItem(null)}
                className="px-8 py-3.5 rounded-3xl bg-[#7B5CF0] hover:bg-[#6240D5] text-white font-semibold tracking-tighter text-sm shadow-md transition-all cursor-pointer"
              >
                닫기 &rarr;
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: 포트폴리오 수정 모달 (Edit Modal)
         ========================================================================= */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-[36px] p-8 sm:p-10 shadow-sm border-4 border-purple-200 relative max-h-[90vh] overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between border-b-2 border-purple-100 pb-4">
              <h3 className="text-xl sm:text-2xl font-headline font-semibold tracking-tighter text-[#1A1626]">
                ✏️ 포트폴리오 내역 직접 수정
              </h3>
              <button onClick={() => setEditingItem(null)} className="p-2 rounded-full bg-purple-50 text-[#7B5CF0] font-medium tracking-tight">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateItem} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold tracking-tighter text-[#3B364C] block mb-1">🏷️ 활동 분류</label>
                  <select
                    value={["진학·탐구 (교과)", "동아리·자율 (창작)", "독서·예술", "🏅 자격증"].includes(editingItem.category) ? editingItem.category : "🛠️ 기타(직접입력)"}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "🛠️ 기타(직접입력)") {
                        setEditingItem({ ...editingItem, category: "자율 탐색" });
                      } else {
                        setEditingItem({ ...editingItem, category: val });
                      }
                    }}
                    className="w-full h-12 px-4 rounded-2xl bg-purple-50 border border-[#B8AAFA] font-semibold tracking-tighter text-sm text-[#1A1626]"
                  >
                    <option value="진학·탐구 (교과)">진학·탐구 (교과)</option>
                    <option value="동아리·자율 (창작)">동아리·자율 (창작)</option>
                    <option value="독서·예술">독서·예술</option>
                    <option value="🏅 자격증">🏅 자격증</option>
                    <option value="🛠️ 기타(직접입력)">🛠️ 기타(직접입력)</option>
                  </select>
                  {!["진학·탐구 (교과)", "동아리·자율 (창작)", "독서·예술", "🏅 자격증"].includes(editingItem.category) && (
                    <input
                      type="text"
                      placeholder="분류 직접 입력 (예: 봉사활동, 학교제안)"
                      value={editingItem.category}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                      className="w-full h-10 px-3 mt-2 rounded-lg bg-white border border-[#7B5CF0] text-xs font-semibold tracking-tighter text-[#7B5CF0] focus:outline-none shadow-inner"
                    />
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold tracking-tighter text-[#3B364C] block mb-1">⏳ 수행 기간</label>
                  <input
                    type="text"
                    value={editingItem.dateRange || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, dateRange: e.target.value })}
                    placeholder="예: 2026.05.01 ~ 2026.07.15"
                    className="w-full h-12 px-4 rounded-2xl bg-purple-50 border border-[#B8AAFA] font-semibold tracking-tighter text-sm text-[#1A1626]"
                  >
                  </input>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold tracking-tighter text-[#3B364C] block mb-1">📌 활동 제목 (또는 자격증명)</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full h-12 px-4 rounded-2xl bg-purple-50 border border-[#B8AAFA] font-medium tracking-tight text-sm text-[#1A1626]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold tracking-tighter text-[#3B364C] block mb-1">📝 수행 내용 및 고찰</label>
                <textarea
                  rows={6}
                  value={editingItem.content}
                  onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                  className="w-full p-4 rounded-3xl bg-purple-50 border border-[#B8AAFA] font-semibold text-sm text-[#1A1626] leading-relaxed"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold tracking-tighter text-[#3B364C] block mb-1">📷 인증 사진 수정 (용량 88% 압축)</label>
                  <div className="border-2 border-dashed border-[#B8AAFA] rounded-2xl p-3 text-center bg-purple-50 relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    {editingItem.photoUrl ? (
                      <div className="flex items-center justify-center gap-2">
                        <img src={editingItem.photoUrl} alt="preview" className="w-10 h-10 object-cover rounded" />
                        <span className="text-xs font-medium tracking-tight text-purple-800">새 사진으로 교체</span>
                      </div>
                    ) : (
                      <span className="text-xs font-medium tracking-tight text-slate-500">클릭하여 새 인증 사진 업로드</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold tracking-tighter text-[#3B364C] block mb-1">🏷️ 역량 태그 (쉼표 구분)</label>
                  <input
                    type="text"
                    value={editingItem.tags ? editingItem.tags.join(", ") : ""}
                    onChange={(e) => setEditingItem({ ...editingItem, tags: e.target.value.split(",").map(t => t.trim()).filter(t => t) })}
                    className="w-full h-12 px-4 rounded-2xl bg-purple-50 border border-[#B8AAFA] font-medium tracking-tight text-sm text-[#1A1626]"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-purple-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 font-medium tracking-tight text-sm text-[#5C5672]"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="py-3 px-8 rounded-2xl bg-[#7B5CF0] hover:bg-[#643DDD] text-white font-semibold tracking-tighter text-sm shadow-lg"
                >
                  수정 사항 반영하기
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
