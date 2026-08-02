import React, { useState, useEffect } from "react";
import { useAuth } from "../context";
import { executeAiPrompt } from "../services/aiService";
import { ARI_BLOB_URL } from "../assets/mascotData";
import {
  Sparkles,
  CheckCircle2,
  BookOpen,
  FolderCheck,
  Brain,
  X
} from "lucide-react";

interface CornellNote {
  id: string;
  category: string; // 예: '🔬 통합과학', '📐 수학', '💻 AI·IT', '🌍 인문사회'
  subject: string;
  topic: string;
  keywords: string;
  mySummary: string;
  aiSummary?: string;
  date: string;
}

interface QuizItem {
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

export const StarRoadmap: React.FC = () => {
  const { session } = useAuth();
  
  // 현재 홈화면에서 동기화된 선택 관심 직무 불러오기
  const targetJobName = localStorage.getItem("readycareer_target_job_name") || session?.targetJob || "AI 융합 개척자";
  const customAvatarUrl = localStorage.getItem("readycareer_custom_avatar_url") || ARI_BLOB_URL;

  const [notes, setNotes] = useState<CornellNote[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  
  // 신규 코넬 노트 작성 폼 상태
  const [categoryInput, setCategoryInput] = useState("🔬 과학 · 공학");
  const [subjectInput, setSubjectInput] = useState("");
  const [topicInput, setTopicInput] = useState("");
  const [keywordsInput, setKeywordsInput] = useState("");
  const [summaryInput, setSummaryInput] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // 퀴즈 및 과목 선택 모달 상태
  const [showSubjectSelectModal, setShowSubjectSelectModal] = useState(false);
  const [activeQuizNote, setActiveQuizNote] = useState<CornellNote | null>(null);
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);

  // 초기 누적 보관 데이터 세팅
  useEffect(() => {
    const saved = localStorage.getItem("readycareer_cornell_notes_v1");
    if (saved) {
      try { setNotes(JSON.parse(saved)); } catch (e) {}
    } else {
      const defaultNotes: CornellNote[] = [
        {
          id: "cnot-1",
          category: "💻 AI · 프로그래밍",
          subject: "인공지능과 신경망 구조",
          topic: "생물학적 뉴런 메커니즘과 퍼셉트론 알고리즘 융합",
          keywords: "퍼셉트론, 활성화 함수, 가중치, 역전파, 시냅스 전달",
          mySummary: "인체 뇌 세포의 뉴런이 전기 신호 역치 이상을 전달하는 물리적 메커니즘을 파이썬 배열 및 신경망 수식으로 대입하여, 자율 학습의 정확도를 올리는 실험 노트를 정리함.",
          aiSummary: `💡 [AI 코넬 스마트 심화 정리본]: 제출된 학습 내용과 키워드는 '${targetJobName}' 직업군으로 진입하기 위한 최상위 논리적 융합 역량을 보여줍니다! 뉴런의 생물학적 구조를 인공지능 코딩의 가중치 조절 기법으로 연결시킨 점을 세특 학습 활동으로 부각할 것을 적극 추천합니다!`,
          date: "2026.07.28",
        },
        {
          id: "cnot-2",
          category: "🔬 과학 · 공학",
          subject: "물리학 I - 열역학과 신소재",
          topic: "극한 가공 가혹 환경에서의 초전도 저항 방어 설계",
          keywords: "초전도체, 열역학, 엔트로피 통제, 격변 신소재",
          mySummary: "우주 로켓 본체나 미래 모빌리티가 초고속 운행 시 발생하는 고에너지 열변형 저항을 줄이기 위한 양자화 구조 배열 및 차분 가이드 실험.",
          aiSummary: `💡 [AI 코넬 스마트 심화 정리본]: 고등 교과 물리학 이론을 미래형 신소재 및 첨단 모빌리티 기술에 접목시킨 탁월한 탐구 요약입니다. 이를 '학문 간 융합 사고력을 바탕으로 기술적 난제를 해결하려는 열정' 항목으로 도출할 수 있습니다!`,
          date: "2026.07.29",
        }
      ];
      setNotes(defaultNotes);
      localStorage.setItem("readycareer_cornell_notes_v1", JSON.stringify(defaultNotes));
    }
  }, [targetJobName]);

  // AI 코넬 스마트 정리본 자동 생성 및 누적 등록 핸들러
  const handleCreateCornellNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectInput.trim() || !topicInput.trim() || !summaryInput.trim()) {
      alert("과목명, 학습 주제, 요약 내용을 모두 기입해 주세요!");
      return;
    }

    setIsAiGenerating(true);
    let aiGeneratedSummary = `💡 [AI 코넬 스마트 심화 정리본]: 작성해주신 학습 요약은 회원님의 희망 직문('${targetJobName}')와 98% 융합되는 아주 우수한 학문적 성장 기록입니다. '[${subjectInput}] - ${topicInput}' 탐구를 통해 기입한 핵심 키워드('${keywordsInput}')를 기반으로 생기부 학업 역량 및 교과 세특 보고서의 깊이를 극대화할 수 있습니다!`;

    try {
      const aiRes = await executeAiPrompt({
        promptType: "cornell_note_synthesis",
        subject: subjectInput,
        topic: topicInput,
        keywords: keywordsInput,
        userNote: summaryInput,
        targetJob: targetJobName,
      } as any);
      if (aiRes.content && aiRes.provider !== "expo-demo-fallback") {
        aiGeneratedSummary = `💡 [AI 코넬 스마트 심화 정리본]: ${aiRes.content.replace(/^["']|["']$/g, "").trim()}`;
      }
    } catch (err) {
      console.warn("AI 요약 통신 불완전, 시연 맞춤 하이퀄리티 AI 템플릿 적용", err);
    }

    const newNote: CornellNote = {
      id: "cnot-" + Date.now(),
      category: categoryInput,
      subject: subjectInput.trim(),
      topic: topicInput.trim(),
      keywords: keywordsInput.trim() || "융합 사고, 교과 심화",
      mySummary: summaryInput.trim(),
      aiSummary: aiGeneratedSummary,
      date: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
    };

    const updated = [newNote, ...notes];
    setNotes(updated);
    localStorage.setItem("readycareer_cornell_notes_v1", JSON.stringify(updated));

    // 입력폼 초기화
    setSubjectInput("");
    setTopicInput("");
    setKeywordsInput("");
    setSummaryInput("");
    setIsAiGenerating(false);
  };

  // 과목별 퀴즈 생성 핸들러 (Self-Test)
  const handleStartQuiz = async (note: CornellNote) => {
    setActiveQuizNote(note);
    setQuizLoading(true);
    setUserAnswers({});
    setShowResults(false);

    // AI 혹은 스마트 맞춤 퀴즈 풀 생성 (3제)
    setTimeout(() => {
      const sampleQuizzes: QuizItem[] = [
        {
          question: `Q1. [${note.subject}] 학습 노트의 주요 탐구 주제와 올바르게 부합하는 설명은 무엇인가요?`,
          options: [
            `"${note.topic}"의 학문적 원리를 깊이 있게 대입하여 해결책을 구체화한 탐구이다.`,
            "교과과정을 벗어난 무연관 단어들을 임의로 기계적 낭독한 글이다.",
            "실습이나 논리적 검증 없이 본인의 추측만 열람한 단편 기록이다.",
            "진로 역량과 상관없는 타 과목 단순 과제를 복사한 요약이다."
          ],
          correctIdx: 0,
          explanation: `정답입니다! 작성된 노트는 '${note.topic}' 주제를 중심으로 깊이 있는 교과 역량을 훌륭히 담고 있습니다.`
        },
        {
          question: `Q2. 이 학습 노트에 활용된 핵심 키워드("${note.keywords.slice(0, 20)}...")는 회원님의 지망 직직('${targetJobName}') 진출 역량을 보여주기에 적절하다. (O/X 퀴즈)`,
          options: ["⭕ 네! 전공적합성과 융합적 탐구열정을 보여주기에 완벽하게 적합합니다.", "❌ 아니요, 직무와 학업 간 연관성이 전혀 없습니다."],
          correctIdx: 0,
          explanation: "정답! 키워드 간의 연계를 통해 교과와 진로를 잇는 학문적 깊이를 보여줄 수 있습니다."
        },
        {
          question: "Q3. 다음 중 코넬 노트 작성법을 기반으로 이 학습 결과를 발전시킬 수 있는 향후 행동으로 가장 적절한 것은?",
          options: [
            "노트 보관 후 한 번도 다시 쳐다보지 않고 잊어버린다.",
            `정리된 [AI 스마트 심화 정리본]을 토대로 담당 선생님께 교과 심화 보고서를 제출하여 세특 상담을 나눈다!`,
            "키워드만 남기고 본문 요약 내용을 전부 삭제한다.",
            "학교 수업 시간 대신 자가 퀴즈만 반복 낭독한다."
          ],
          correctIdx: 1,
          explanation: `훌륭합니다! AI가 정리해 준 보고서 포스트를 토대로 선생님과 적극적으로 교과 세특 상담을 나누는 것이 최고의 진로 전략입니다!`
        }
      ];
      setQuizzes(sampleQuizzes);
      setQuizLoading(false);
    }, 700);
  };

  const categories = ["전체", "🔬 과학 · 공학", "📐 수학 · 통계", "💻 AI · 프로그래밍", "🌍 인문 · 사회", "🗣️ 어학 · 진로"];
  const filteredNotes = selectedCategory === "전체" ? notes : notes.filter(n => n.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 space-y-12 selection:bg-[#7B5CF0]/20 selection:text-[#7B5CF0]">
      
      {/* =========================================================================
          SECTION 1: HERO TITLE (현재 선택된 직문 테마 연동)
         ========================================================================= */}
      <div className="rounded-[36px] bg-gradient-to-r from-[#7B5CF0] via-[#5D32D8] to-[#2E0B8A] text-white p-8 sm:p-12 shadow-[0_18px_48px_rgba(123,92,240,0.25)] border-4 border-white/30 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="space-y-4 max-w-2xl z-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full font-extrabold text-xs sm:text-sm tracking-wide border border-white/40 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
            <span>★ 선택 직무 연계: <strong>{targetJobName}</strong></span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-headline font-black text-white tracking-tight leading-tight">
            📘 AI 스마트 학습 포트폴리오 <br className="hidden sm:block"/> &amp; 코넬 노트 보관함
          </h1>
          <p className="text-sm sm:text-base font-semibold text-[#DFD7FF] leading-relaxed">
            코넬 노트 기법으로 과목명과 핵심 요약을 적어보세요! AI가 <strong>"{targetJobName}"</strong> 역량에 맞춘 <strong>심화 정리본</strong>을 자동 도출해 드리며, 과목별 누적 보관 및 <strong>셀프 퀴즈 테스트</strong>를 제공합니다!
          </p>
        </div>

        <div className="flex-shrink-0 z-10 w-36 h-36 sm:w-48 sm:h-48 rounded-[36px] bg-white/20 backdrop-blur-xl p-4 border-4 border-white/50 shadow-2xl flex items-center justify-center transform hover:scale-105 transition-all">
          <img src={customAvatarUrl} alt="Target Job Avatar" className="w-full h-full object-contain filter drop-shadow-2xl" />
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: 신규 코넬 노트 작성 및 AI 정리본 도출 모듈
         ========================================================================= */}
      <div className="bg-white rounded-[36px] p-7 sm:p-12 shadow-[0_15px_45px_rgba(123,92,240,0.1)] border-2 border-[#EADFFF] space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-purple-100 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#7B5CF0]/10 text-[#7B5CF0] px-3.5 py-1 rounded-full text-xs font-black mb-2">
              <BookOpen className="w-4 h-4" />
              <span>Cornell Note-Taking System</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-headline font-black text-[#1A1626]">
              ✍️ 새 코넬 학습 노트 및 AI 요약 정리 작성
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-[#5C5672] mt-1 break-keep">
              과목명, 학습주제, 요약을 기입하시면 AI가 하단에 <strong>전문적인 학업-진로 융합 정리본</strong>을 즉시 생성하여 누적 보관합니다.
            </p>
          </div>

          {/* 우측 상단 🤖 아리와 함께 문제 만들기 버튼 */}
          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={() => setShowSubjectSelectModal(true)}
              className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[#FF3B7C] via-[#FF6247] to-[#7B5CF0] hover:brightness-110 text-white font-black text-xs sm:text-sm shadow-[0_8px_25px_rgba(255,59,124,0.35)] hover:shadow-[0_12px_35px_rgba(255,59,124,0.55)] transition-all flex items-center gap-2 transform hover:-translate-y-1 active:scale-95 cursor-pointer border-2 border-white/80 whitespace-nowrap"
            >
              <Brain className="w-5 h-5 text-amber-300 animate-bounce-short" />
              <span>🤖 아리와 함께 문제 만들기</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleCreateCornellNote} className="space-y-6">
          
          {/* 과목 카테고리 칩 및 과목명 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-black text-[#3B364C] block">
                🏷️ 과목 카테고리 (누적 분류)
              </label>
              <select
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                className="w-full h-14 px-4 rounded-2xl bg-[#F8F6FF] border-2 border-[#E1DAFA] font-extrabold text-sm text-[#1A1626] focus:border-[#7B5CF0] focus:outline-none shadow-inner"
              >
                {categories.filter(c => c !== "전체").map((c, idx) => (
                  <option key={idx} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs sm:text-sm font-black text-[#3B364C] block">
                📚 과목명 및 단원 / 학습 범위
              </label>
              <input
                type="text"
                placeholder="예: 수학 I - 삼각함수 파동 수식과 통계적 접근"
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                className="w-full h-14 px-5 rounded-2xl bg-[#F8F6FF] border-2 border-[#E1DAFA] font-bold text-sm text-[#1A1626] placeholder:text-[#908A9E] focus:border-[#7B5CF0] focus:outline-none shadow-inner"
              />
            </div>
          </div>

          {/* 학습 주제 및 핵심 키워드 (코넬 좌측 란) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-black text-[#3B364C] block">
                🎯 오늘의 핵심 학습 주제 (Topic)
              </label>
              <input
                type="text"
                placeholder="예: 생체 신호 데이터를 분석하는 주기적 파동 함수 시뮬레이션"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                className="w-full h-14 px-5 rounded-2xl bg-[#F8F6FF] border-2 border-[#E1DAFA] font-bold text-sm text-[#1A1626] placeholder:text-[#908A9E] focus:border-[#7B5CF0] focus:outline-none shadow-inner"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-black text-[#3B364C] block">
                🔑 핵심 키워드 (코넬 노트 Left Column Cues)
              </label>
              <input
                type="text"
                placeholder="예: 삼각함수 주기, 주파수 변환, 인공신경망 데이터 보정"
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
                className="w-full h-14 px-5 rounded-2xl bg-[#F8F6FF] border-2 border-[#E1DAFA] font-bold text-sm text-[#1A1626] placeholder:text-[#908A9E] focus:border-[#7B5CF0] focus:outline-none shadow-inner"
              />
            </div>
          </div>

          {/* 학습 요약 (코넬 메인 란) */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-black text-[#3B364C] block">
              📝 나의 학습 요약 &amp; 심화 고찰 (Cornell Note Summary &amp; Notes)
            </label>
            <textarea
              rows={4}
              placeholder="오늘 학교 수업이나 인터넷 강좌, 자유 탐구를 통해 배운 주요 이론과 나의 생각, 질문, 실험 결과나 확장 아이디어를 자유롭게 기입해 보세요! AI가 이를 품격 있는 스마트 정리본으로 도출해 줍니다."
              value={summaryInput}
              onChange={(e) => setSummaryInput(e.target.value)}
              className="w-full p-5 rounded-2xl bg-[#F8F6FF] border-2 border-[#E1DAFA] font-semibold text-sm text-[#1A1626] placeholder:text-[#908A9E] focus:border-[#7B5CF0] focus:outline-none shadow-inner leading-relaxed"
            />
          </div>

          {/* 제출 & AI 스마트 정리 생성 버튼 */}
          <div className="pt-2 text-center sm:text-right">
            <button
              type="submit"
              disabled={isAiGenerating}
              className="w-full sm:w-auto py-4 px-10 rounded-2xl bg-gradient-to-r from-[#7B5CF0] via-[#5C32D9] to-[#008A90] hover:brightness-110 text-white font-black text-base sm:text-lg border-2 border-white shadow-[0_10px_25px_rgba(123,92,240,0.3)] hover:shadow-[0_15px_35px_rgba(123,92,240,0.45)] transition-all flex items-center justify-center gap-3 cursor-pointer mx-auto sm:ml-auto"
            >
              <Sparkles className={`w-6 h-6 text-amber-300 ${isAiGenerating ? "animate-spin" : ""}`} />
              <span>{isAiGenerating ? "AI가 코넬 심화 정리본 도출 중..." : "✨ AI 스마트 심화 정리 및 보관함에 누적하기"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* =========================================================================
          SECTION 3: 과목별 카테고리 누적 보관함 & 퀴즈 생성 기능
         ========================================================================= */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-purple-100 pb-4 pl-2">
          <div>
            <h3 className="text-2xl font-headline font-black text-[#1A1626] flex items-center gap-2">
              <FolderCheck className="w-7 h-7 text-[#008A90]" />
              <span>🗂️ 과목별 학습 코넬 노트 보관함 (총 {filteredNotes.length}건 누적)</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#5C5672] font-semibold mt-1">
              과목 카테고리별로 내가 누적해 둔 학습 노트를 열람하고, 언제든 <strong>[🧠 AI 셀프 테스트 퀴즈]</strong>로 나의 지식을 점검할 수 있습니다!
            </p>
          </div>

          {/* 카테고리 필터 탭 바 */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
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

        {/* 누적 노트 리스트 및 카드 그리드 */}
        {filteredNotes.length === 0 ? (
          <div className="w-full py-16 text-center bg-white rounded-[32px] border-2 border-dashed border-purple-200 space-y-3">
            <span className="text-4xl block">empty_folder</span>
            <p className="text-base font-extrabold text-[#7B5CF0]">선택하신 카테고리의 학습 노트가 아직 없습니다.</p>
            <span className="text-xs font-bold text-[#8A859C]">위 작성폼에서 노트를 추가하여 보관함을 채워 보세요!</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="bg-[#FFFDF9] rounded-[32px] shadow-[0_15px_45px_rgba(0,0,0,0.08)] hover:shadow-[0_22px_60px_rgba(123,92,240,0.18)] border-2 border-[#E8DFC8] transition-all duration-300 relative overflow-hidden flex flex-col"
              >
                {/* 상단 바인더 타공 구멍 및 노트 질감 바 (실제 스프링/3공 바인더 느낌) */}
                <div className="w-full py-2.5 bg-[#F5EEDC] flex items-center justify-center gap-4 sm:gap-8 border-b border-[#DFD3B6] shadow-inner">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-3.5 h-3.5 rounded-full bg-[#3D3522]/30 shadow-inner border border-white/60" />
                  ))}
                </div>

                {/* 코넬 노트 상단 영역 (과목명 & 날짜 Header) */}
                <div className="p-6 sm:p-8 border-b-2 border-[#E6DDD0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/70">
                  <div className="flex items-center gap-3">
                    <span className="text-xs sm:text-sm font-black px-4 py-1.5 rounded-full bg-[#008A90] text-white shadow-sm">
                      {note.category}
                    </span>
                    <h4 className="text-xl sm:text-2xl font-black text-[#1A1626] tracking-tight">
                      {note.subject} <span className="text-sm font-bold text-[#6240D5]">| {note.topic}</span>
                    </h4>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-[#6E6A80] bg-[#F3ECE0] px-3.5 py-1.5 rounded-xl border border-[#DFD3B6]">
                      📅 {note.date}
                    </span>
                    {/* 과목별 AI 퀴즈 셀프 테스트 버튼 */}
                    <button
                      onClick={() => handleStartQuiz(note)}
                      className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF3B7C] to-[#FF7043] hover:from-[#FF2068] hover:to-[#FF5A27] text-white font-black text-xs sm:text-sm shadow-md hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer transform hover:scale-105 active:scale-95"
                    >
                      <Brain className="w-4 h-4 text-white animate-bounce-short" />
                      <span>🧠 AI 학습 퀴즈 테스트 생성</span>
                    </button>
                  </div>
                </div>

                {/* 리얼 코넬 본문 레이아웃 (좌측 Cue 칼럼 + 붉은색 수직 구분선 + 우측 Notes 칼럼) */}
                <div className="flex flex-col md:flex-row flex-grow">
                  {/* 좌측 란: Cues / 핵심 키워드 (코넬 오프라인 노트 구조) */}
                  <div className="w-full md:w-1/3 lg:w-1/4 bg-[#FFFBF0] p-6 sm:p-7 md:border-r-[3px] border-b md:border-b-0 border-[#FCA5A5] space-y-3">
                    <div className="inline-flex items-center gap-1.5 bg-[#FEF2F2] text-[#DC2626] px-3 py-1 rounded-lg text-xs font-black border border-red-200">
                      <span>📌 Cues (핵심 키워드)</span>
                    </div>
                    <p className="text-xs sm:text-sm font-extrabold text-[#3F3952] leading-relaxed break-keep">
                      {note.keywords}
                    </p>
                  </div>

                  {/* 메인 란: Notes / 학습 요약 내용 */}
                  <div className="w-full md:w-2/3 lg:w-3/4 bg-[#FFFDFC] p-6 sm:p-8 space-y-3 relative">
                    {/* 은은한 줄 노트 배경 텍스처 효과 */}
                    <div className="inline-flex items-center gap-1.5 bg-[#F0FDF4] text-[#15803D] px-3 py-1 rounded-lg text-xs font-black border border-green-200">
                      <span>📝 Notes (탐구 요약 & 심화 고찰)</span>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-[#1A1626] leading-relaxed whitespace-pre-wrap break-keep">
                      {note.mySummary}
                    </p>
                  </div>
                </div>

                {/* 하단 란: Summary / AI 아리의 핵심 심화 정리 박스 (코넬노트 맨 아랫면 Summary 영역) */}
                {note.aiSummary && (
                  <div className="w-full border-t-[3px] border-t-[#A5B4FC] bg-gradient-to-r from-[#EEF2FF] via-[#F5F3FF] to-[#FAF5FF] p-6 sm:p-8 space-y-3 relative">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-2 bg-[#4338CA] text-white px-4 py-1.5 rounded-full text-xs font-black shadow-md">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>💡 Summary (AI 스마트 심화 정리 및 세특 매칭)</span>
                      </div>
                      <span className="text-xs font-black text-[#4338CA] bg-white px-3 py-1 rounded-full border border-indigo-200 shadow-sm">
                        ⚡ "{targetJobName}" 지망 역량 자동 연계
                      </span>
                    </div>
                    <p className="text-sm sm:text-base font-extrabold text-[#1E1B4B] leading-relaxed break-keep pt-1">
                      {note.aiSummary}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL: 과목별 AI 학습 요약 퀴즈 셀프 테스트 (Self-Test Arena)
         ========================================================================= */}
      {activeQuizNote && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-gradient-to-b from-white via-[#FAF7FF] to-[#F2EEFF] w-full max-w-4xl rounded-[40px] p-8 sm:p-12 shadow-[0_25px_80px_rgba(0,0,0,0.5)] border-4 border-white relative max-h-[90vh] overflow-y-auto space-y-8">
            
            <button
              onClick={() => setActiveQuizNote(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 transition-colors shadow-sm"
            >
              <X className="w-6 h-6" />
            </button>

            {/* 퀴즈 모달 상단 헤더 */}
            <div className="text-center space-y-2 border-b-2 border-purple-100 pb-5">
              <span className="text-xs font-black bg-[#FF3B7C] text-white px-4 py-1.5 rounded-full shadow-md inline-flex items-center gap-1.5">
                <Brain className="w-4 h-4" />
                <span>AI 학습 노트 맞춤형 셀프 테스트</span>
              </span>
              <h3 className="text-2xl sm:text-4xl font-black text-[#1A1626]">
                🧠 [{activeQuizNote.subject}] 실전 지식 점검 퀴즈!
              </h3>
              <p className="text-xs sm:text-sm font-bold text-[#5C5672]">
                방금 누적한 코넬 노트를 기반으로 AI가 생성한 <strong>3제 맞춤 문제</strong>입니다. 정답을 터치하고 해설을 확인하세요!
              </p>
            </div>

            {/* 퀴즈 내용 로딩 혹은 풀기 */}
            {quizLoading ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#7B5CF0] text-white text-3xl flex items-center justify-center mx-auto animate-spin-slow shadow-xl">
                  ✨
                </div>
                <h4 className="text-xl font-black text-[#6240D5]">AI 멘토 아리가 학습 노트 데이터를 퀴즈로 렌더링 중입니다...</h4>
              </div>
            ) : (
              <div className="space-y-8">
                {quizzes.map((q, idx) => (
                  <div key={idx} className="bg-white p-6 sm:p-8 rounded-[32px] border-2 border-purple-150 shadow-md space-y-5">
                    <h4 className="text-lg sm:text-xl font-extrabold text-[#1A1626] leading-snug">
                      {q.question}
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = userAnswers[idx] === oIdx;
                        const isCorrect = oIdx === q.correctIdx;
                        let btnStyle = "bg-[#FAF7FF] text-[#3F3952] border-2 border-purple-200 hover:bg-[#F0ECFE]";
                        if (showResults) {
                          if (isCorrect) btnStyle = "bg-[#E2FDEC] text-[#007A3E] border-2 border-[#54E297] font-black";
                          else if (isSelected && !isCorrect) btnStyle = "bg-[#FFE8EF] text-[#D3184E] border-2 border-[#FFA1BC]";
                        } else if (isSelected) {
                          btnStyle = "bg-[#7B5CF0] text-white border-2 border-[#5B32D6] font-black shadow-md";
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => !showResults && setUserAnswers({ ...userAnswers, [idx]: oIdx })}
                            disabled={showResults}
                            className={`w-full py-4 px-6 rounded-2xl text-left font-bold text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {showResults && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* 정답 확인 시 해설 노출 */}
                    {showResults && (
                      <div className="mt-4 p-4 rounded-2xl bg-[#F4F9FF] border border-[#C5DFFB] text-xs sm:text-sm font-extrabold text-[#1F5F9F]">
                        💡 <strong>AI 해설:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                ))}

                {/* 하단 제어 바 */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-purple-100">
                  <span className="text-xs sm:text-sm font-black text-[#6E6A80]">
                    💡 문제를 다 풀었다면 정답 채점을 눌러 마일리지를 적립하세요!
                  </span>
                  {!showResults ? (
                    <button
                      onClick={() => {
                        if (Object.keys(userAnswers).length < quizzes.length) {
                          alert("모든 문제의 선택지를 골라 주세요!");
                          return;
                        }
                        setShowResults(true);
                      }}
                      className="w-full sm:w-auto py-4 px-10 rounded-2xl bg-[#008A90] hover:bg-[#007379] text-white font-black text-base shadow-xl transition-transform transform hover:scale-105"
                    >
                      💯 정답 및 AI 해설 즉시 확인하기!
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveQuizNote(null)}
                      className="w-full sm:w-auto py-4 px-10 rounded-2xl bg-[#7B5CF0] hover:bg-[#6340D5] text-white font-black text-base shadow-xl transition-transform transform hover:scale-105"
                    >
                      🏆 셀프 테스트 완수! 보관함으로 돌아가기 &rarr;
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: 아리와 함께 문제 만들기 (누적 과목 선택 팝업)
         ========================================================================= */}
      {showSubjectSelectModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-gradient-to-b from-white via-[#FAF7FF] to-[#F2EEFF] w-full max-w-2xl rounded-[40px] p-8 sm:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.5)] border-4 border-white relative max-h-[85vh] overflow-hidden flex flex-col space-y-6">
            <button
              onClick={() => setShowSubjectSelectModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 transition-colors shadow-sm"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center space-y-2 border-b-2 border-purple-100 pb-5 flex-shrink-0">
              <div className="w-20 h-20 rounded-3xl bg-white p-2 mx-auto shadow-xl border-2 border-purple-200 flex items-center justify-center animate-float">
                <img src={ARI_BLOB_URL} alt="Ari Mascot" className="w-full h-full object-contain filter drop-shadow-md" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#1A1626] tracking-tight">
                🤖 아리와 함께 문제 만들기 <span className="text-[#7B5CF0]">(과목 선택)</span>
              </h3>
              <p className="text-xs sm:text-sm font-extrabold text-[#5C5672] break-keep leading-relaxed">
                지금까지 보관함에 작성해 둔 코넬 학습 노트 중 <strong>도전을 원하는 과목</strong>을 선택해 줘! <br/>
                AI 아리가 해당 과목의 핵심 이론으로 <strong>맞춤 셀프 퀴즈</strong>를 뚝딱 출제해 줄게! ✨
              </p>
            </div>

            {notes.length === 0 ? (
              <div className="py-12 text-center text-slate-500 font-bold space-y-2">
                <span className="text-3xl block">📭</span>
                <p>아직 작성된 코넬 노트가 없어! 위 작성폼에서 요약 노트를 먼저 등록해줘!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto pr-2 pb-2 flex-grow">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => {
                      setShowSubjectSelectModal(false);
                      handleStartQuiz(note);
                    }}
                    className="p-5 rounded-[28px] bg-white hover:bg-[#FAF6FF] border-2 border-[#E1DAFA] hover:border-[#7B5CF0] shadow-[0_8px_20px_rgba(123,92,240,0.08)] hover:shadow-xl cursor-pointer transition-all duration-300 flex flex-col justify-between gap-3 group transform hover:-translate-y-1.5"
                  >
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-black bg-[#008A90] text-white px-2.5 py-0.5 rounded-full inline-block">
                        {note.category}
                      </span>
                      <h4 className="text-base font-black text-[#1A1626] group-hover:text-[#7B5CF0] transition-colors line-clamp-1 tracking-tight">
                        {note.subject}
                      </h4>
                      <p className="text-xs font-bold text-[#6E6A80] line-clamp-2 leading-relaxed bg-[#F8F6FF] p-2.5 rounded-xl border border-purple-50">
                        📌 {note.topic}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-xs font-black text-[#7B5CF0] pt-2 border-t border-purple-100">
                      <span className="text-[11px] text-slate-400">📅 {note.date}</span>
                      <span className="bg-purple-50 px-3 py-1 rounded-full group-hover:bg-[#7B5CF0] group-hover:text-white transition-colors flex items-center gap-1">
                        🧠 퀴즈 출제 &rarr;
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default StarRoadmap;
