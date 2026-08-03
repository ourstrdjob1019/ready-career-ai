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
  X,
  Plus,
  ChevronDown,
  ChevronUp,
  Layers,
  CheckSquare,
  ArrowRight,
  Filter,
  Bookmark
} from "lucide-react";

interface CornellNote {
  id: string;
  category: string; // 예: '🔬 과학', '💻 기술·정보' 등
  subject: string;
  topic: string;
  keywords: string;
  mySummary: string;
  aiSummary?: string;
  date: string;
  schoolLevel?: string; // 'high' | 'middle'
}

interface QuizItem {
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

// 중학교 및 고교학점제 맞춤 카테고리 (교과 영역) 정의
const SUBJECT_CATEGORIES = [
  "전체",
  "📖 국어",
  "📐 수학",
  "🗣️ 영어",
  "🌍 사회·역사",
  "🔬 과학",
  "💻 기술·정보",
  "🎨 예체능·교양",
  "🛠️ 전문·기타"
];

// 학교급 구분 정보
const SCHOOL_LEVEL_INFO = [
  { 
    id: "high", 
    label: "🏫 고등학교 (고교학점제)", 
    badge: "일반/진로/융합 선택과목 지원",
    desc: "1학년 공통과목 이수 후 진로와 흥미에 맞춰 선택 수강하는 과목 구조입니다." 
  },
  { 
    id: "middle", 
    label: "🏫 중학교 (공통·선택)", 
    badge: "기초/탐구/생활기술 교과 지원",
    desc: "공통 교육과정 및 학교별 개설 선택과목(생활외국어, 진로와직업 등) 구조입니다." 
  }
];

// 학교급 + 교과 영역별 추천 세부과목 칩 데이터
const RECOMMENDED_SUBJECTS: Record<string, Record<string, string[]>> = {
  high: {
    "📖 국어": ["공통 국어 I·II", "화법과 언어", "독서와 작문", "문학", "매체 의사소통", "심화 국어", "고전 읽기"],
    "📐 수학": ["공통 수학 I·II", "대수", "미적분 I", "미적분 II", "기하", "확률과 통계", "인공지능 수학", "경제 수학", "실용 수학"],
    "🗣️ 영어": ["공통 영어 I·II", "영어 I", "영어 II", "영어 회화", "독해와 작문", "심화 영어", "직무 영어"],
    "🌍 사회·역사": ["통합사회 I·II", "한국사 I·II", "세계시민과 지리", "생활과 윤리", "윤리와 사상", "경제", "정치와 법", "사회·문화", "고전과 윤리", "국제 관계"],
    "🔬 과학": ["통합과학 I·II", "물리학", "화학", "생명과학", "지구과학", "역학과 에너지 (물리II)", "물질과 에너지 (화학II)", "생물의 진화 (생명II)", "우주와 지구 (지학II)", "과학과제 연구", "융합과학 탐구"],
    "💻 기술·정보": ["기술·가정", "정보", "인공지능 기초", "데이터의 과학", "프로그래밍", "로봇 기구 개발", "정보처리와 관리"],
    "🎨 예체능·교양": ["체육", "음악", "미술", "제2외국어(중국어·일본어·아랍어 등)", "한문", "철학", "심리학", "교양", "보건"],
    "🛠️ 전문·기타": ["진로와 직업", "경영·금융", "기계·전자", "디자인·콘텐츠", "보건·복지 전문교과", "직업 탐구 (직접 입력)"],
  },
  middle: {
    "📖 국어": ["국어 (1학년)", "국어 (2학년)", "국어 (3학년)", "국어 문학·독서 기초"],
    "📐 수학": ["수학 (1학년 - 기본 수와 식)", "수학 (2학년 - 도형/방정식)", "수학 (3학년 - 삼각비/이차함수)"],
    "🗣️ 영어": ["영어 (1학년)", "영어 (2학년)", "영어 (3학년)", "실무 생활 영어"],
    "🌍 사회·역사": ["사회 ①", "사회 ②", "역사 ① (한국사)", "역사 ② (세계사)", "도덕 ①", "도덕 ②"],
    "🔬 과학": ["과학 ① (자연 현상)", "과학 ② (물질과 에너지)", "과학 ③ (생명과 우주)", "과학 탐구 실험"],
    "💻 기술·정보": ["기술·가정 ①", "기술·가정 ②", "정보 (프로그래밍/AI 소프트웨어 기초)"],
    "🎨 예체능·교양": ["체육", "음악", "미술", "생활 중국어", "생활 일본어", "생활 아랍어", "한문", "보건", "환경"],
    "🛠️ 전문·기타": ["진로와 직업", "자유학기제 진로 탐구", "동아리 및 자율 학습"],
  }
};

// 기존 로드 시 옛날 카테고리를 새 시스템으로 매핑해주는 유틸
const normalizeCategory = (cat: string): string => {
  if (!cat) return "🛠️ 전문·기타";
  if (SUBJECT_CATEGORIES.includes(cat)) return cat;
  if (cat.includes("AI") || cat.includes("프로그래밍") || cat.includes("기술") || cat.includes("정보")) return "💻 기술·정보";
  if (cat.includes("과학") || cat.includes("공학")) return "🔬 과학";
  if (cat.includes("수학") || cat.includes("통계")) return "📐 수학";
  if (cat.includes("인문") || cat.includes("사회") || cat.includes("역사") || cat.includes("도덕") || cat.includes("윤리")) return "🌍 사회·역사";
  if (cat.includes("어학") || cat.includes("영어") || cat.includes("외국어")) return "🗣️ 영어";
  if (cat.includes("국어") || cat.includes("문학") || cat.includes("화법") || cat.includes("독서")) return "📖 국어";
  if (cat.includes("예술") || cat.includes("체육") || cat.includes("음악") || cat.includes("미술") || cat.includes("교양")) return "🎨 예체능·교양";
  return "🛠️ 전문·기타";
};

export const StarRoadmap: React.FC = () => {
  const { session } = useAuth();
  
  // 현재 홈화면에서 동기화된 선택 관심 직급 불러오기
  const targetJobName = localStorage.getItem("readycareer_target_job_name") || session?.targetJob || "AI 융합 개척자";
  const customAvatarUrl = localStorage.getItem("readycareer_custom_avatar_url") || ARI_BLOB_URL;

  // 노트 보관 및 필터링 상태
  const [notes, setNotes] = useState<CornellNote[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  
  // UX UI 개선: 새 노트 작성폼 표시 토글 & 아코디언 상태
  const [showNoteForm, setShowNoteForm] = useState<boolean>(false);
  const [expandedNoteIds, setExpandedNoteIds] = useState<Record<string, boolean>>({});

  // 신규 코넬 노트 작성 폼 상태
  const [selectedSchoolLevel, setSelectedSchoolLevel] = useState<"high" | "middle">("high");
  const [categoryInput, setCategoryInput] = useState("🔬 과학");
  const [subjectInput, setSubjectInput] = useState("");
  const [topicInput, setTopicInput] = useState("");
  const [keywordsInput, setKeywordsInput] = useState("");
  const [summaryInput, setSummaryInput] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // 퀴즈 스튜디오 모달 (단일/취합 출제 선택) 및 문제 풀기 상태
  const [showQuizStudioModal, setShowQuizStudioModal] = useState(false);
  const [quizStudioTab, setQuizStudioTab] = useState<"single" | "multi">("multi");
  const [selectedQuizNoteIds, setSelectedQuizNoteIds] = useState<string[]>([]);

  // 실전 퀴즈 테스트 아레나 상태
  const [activeQuizNotes, setActiveQuizNotes] = useState<CornellNote[] | null>(null);
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [quizLoading, setQuizLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);

  // 초기 누적 보관 데이터 세팅 및 normalization
  useEffect(() => {
    const saved = localStorage.getItem("readycareer_cornell_notes_v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const normalized = parsed.map((n: any) => ({
            ...n,
            category: normalizeCategory(n.category)
          }));
          setNotes(normalized);
          return;
        }
      } catch (e) {
        console.error("로컬 스토리지 노트 파싱 오류", e);
      }
    }

    // 기본 예제 노트 (중·고등 과정 및 고교학점제 예시)
    const defaultNotes: CornellNote[] = [
      {
        id: "cnot-1",
        category: "💻 기술·정보",
        subject: "정보 & 인공지능 기초",
        topic: "생물학적 뉴런 메커니즘과 퍼셉트론 알고리즘 융합",
        keywords: "퍼셉트론, 활성화 함수, 가중치, 역전파, 시냅스 전달, 융합탐구",
        mySummary: "인체 뇌 세포의 뉴런이 전기 신호 역치 이상을 전달하는 물리적 메커니즘을 파이썬 배열 및 신경망 수식으로 대입하여, 자율 학습의 정확도를 올리는 실험 노트를 정리함.",
        aiSummary: `💡 [AI 코넬 스마트 심화 정리본]: 제출된 학습 내용과 키워드는 '${targetJobName}' 직무군으로 진입하기 위한 최상위 논리적 융합 역량을 보여줍니다! 뉴런의 생물학적 구조를 인공지능 코딩의 가중치 조절 기법으로 연결시킨 점을 정보 및 AI 교과 세특 활동으로 부각할 것을 적극 추천합니다!`,
        date: "2026.07.28",
        schoolLevel: "high"
      },
      {
        id: "cnot-2",
        category: "🔬 과학",
        subject: "물리학 I - 열역학과 신소재 (고교학점제 진로선택)",
        topic: "극한 가공 가혹 환경에서의 초전도 저항 방어 설계",
        keywords: "초전도체, 열역학, 엔트로피 통제, 격변 신소재, 물리학심화",
        mySummary: "우주 로켓 본체나 미래 모빌리티가 초고속 운행 시 발생하는 고에너지 열변형 저항을 줄이기 위한 양자화 구조 배열 및 차분 가이드 실험.",
        aiSummary: `💡 [AI 코넬 스마트 심화 정리본]: 고교학점제 진로선택 과목인 물리학 I·II 이론을 미래형 신소재 및 첨단 모빌리티 기술에 접목시킨 탁월한 탐구 요약입니다. 이를 '학문 간 융합 사고력을 바탕으로 기술적 난제를 해결하려는 열정' 항목으로 도출할 수 있습니다!`,
        date: "2026.07.29",
        schoolLevel: "high"
      },
      {
        id: "cnot-3",
        category: "📐 수학",
        subject: "대수 & 인공지능 수학",
        topic: "행렬 연산을 이용한 최적경로 및 네트워크 모델링",
        keywords: "행렬, 선형대수학, 최적화 알고리즘, 손실함수, 고교학점제",
        mySummary: "복잡한 네트워크 내에서 최단 경로 및 데이터 전달 속도를 계산하기 위해 고교학점제 선택과목인 인공지능 수학에서 다루는 행렬 변환 수식을 모델링함.",
        aiSummary: `💡 [AI 코넬 스마트 심화 정리본]: 대수 및 인공지능 수학 교과 역량을 논리적 문제 해결 모델과 연계한 최고 수준의 융합 포트폴리오입니다. 수학적 수식 모델링 능력을 생기부 학업역량의 차별화된 강점으로 제시해 보세요!`,
        date: "2026.08.01",
        schoolLevel: "high"
      }
    ];
    setNotes(defaultNotes);
    localStorage.setItem("readycareer_cornell_notes_v1", JSON.stringify(defaultNotes));
  }, [targetJobName]);

  // 아코디언 펼치기/접기 핸들러
  const toggleNoteExpand = (id: string) => {
    setExpandedNoteIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // AI 코넬 스마트 정리본 자동 생성 및 누적 등록 핸들러
  const handleCreateCornellNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectInput.trim() || !topicInput.trim() || !summaryInput.trim()) {
      alert("과목명, 학습 주제, 요약 내용을 모두 기입해 주세요!");
      return;
    }

    setIsAiGenerating(true);
    let aiGeneratedSummary = `💡 [AI 코넬 스마트 심화 정리본]: 작성해주신 학습 요약은 회원님의 희망 직무('${targetJobName}')와 98% 융합되는 아주 우수한 학업 성장 기록입니다. [${selectedSchoolLevel === 'high' ? '고교학점제' : '중등'} 교과과정: ${subjectInput}] - '${topicInput}' 탐구를 통해 기입한 핵심 키워드('${keywordsInput}')를 기반으로 생기부 학업 역량 및 교과 세특 보고서의 깊이를 극대화할 수 있습니다!`;

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
      schoolLevel: selectedSchoolLevel
    };

    const updated = [newNote, ...notes];
    setNotes(updated);
    localStorage.setItem("readycareer_cornell_notes_v1", JSON.stringify(updated));

    // 방금 작성한 노트 자동 펼쳐보기
    setExpandedNoteIds(prev => ({ ...prev, [newNote.id]: true }));

    // 입력폼 초기화 및 닫기
    setSubjectInput("");
    setTopicInput("");
    setKeywordsInput("");
    setSummaryInput("");
    setIsAiGenerating(false);
    setShowNoteForm(false);
    alert("🎉 새로운 학습 코넬 노트가 보관함에 안전하게 저장되었습니다!");
  };

  // 퀴즈 생성 핸들러 (단독 또는 다중 노트 취합 지원)
  const handleStartQuiz = async (targetNotes: CornellNote[]) => {
    if (!targetNotes || targetNotes.length === 0) return;
    setActiveQuizNotes(targetNotes);
    setQuizLoading(true);
    setUserAnswers({});
    setShowResults(false);

    setTimeout(() => {
      let generatedQuizzes: QuizItem[] = [];

      if (targetNotes.length === 1) {
        // 단독 노트 집중 퀴즈 (3문제)
        const note = targetNotes[0];
        generatedQuizzes = [
          {
            question: `Q1. [${note.subject}] 학습 노트의 주요 탐구 주제("${note.topic}")와 올바르게 부합하는 설명은 무엇인가요?`,
            options: [
              `"${note.topic}"의 학문적 원리를 깊이 있게 대입하여 미래 실무 문제를 해결하려는 융합 탐구이다.`,
              "교과 과정과 아무런 관련이 없는 단순 암기 단어들을 열람한 기록이다.",
              "실습이나 논리적 고찰 없이 교과서 본문을 복사해 놓은 단편적 메모이다.",
              "진로 역량과 상관없이 타 과목 과제의 제목만 따라 기입한 글이다."
            ],
            correctIdx: 0,
            explanation: `정답입니다! 작성하신 노트는 '${note.topic}' 주제를 중심으로 교과 심화와 진로 적합성을 훌륭히 담고 있습니다.`
          },
          {
            question: `Q2. 이 학습 노트에 기재된 핵심 키워드("${note.keywords.slice(0, 30)}...")는 회원님의 지망 직무('${targetJobName}')의 차별화된 학업 역량을 돋보이게 한다. (O/X 퀴즈)`,
            options: [
              "⭕ 네! 전공적합성과 학업 간 융합적 탐구열정을 입증하기에 최적입니다.",
              "❌ 아니요, 희망 직무와 교과 학습 사이에는 어떠한 연관도 없습니다."
            ],
            correctIdx: 0,
            explanation: "정답! 핵심 키워드들을 연결고리로 삼아 교과 탐구와 진로 역량의 깊이를 극대화할 수 있습니다."
          },
          {
            question: "Q3. 다음 중 코넬 노트 작성법과 AI 심화 정리본을 토대로 세특 역량을 성장시키는 최고의 향후 행동은?",
            options: [
              "노트를 한 번 작성한 후 폴더에 보관하고 잊어버린다.",
              `정리된 [AI 스마트 심화 정리본]을 확장하여 담당 과목 선생님께 교과 심화 탐구 보고서로 제출하고 세특 상담을 나눈다!`,
              "핵심 키워드만 남기고 본문의 고찰 내용을 전부 삭제한다.",
              "학교 정규 수업 대신 AI 퀴즈만 맹목적으로 외우고 수업 참여를 줄인다."
            ],
            correctIdx: 1,
            explanation: `훌륭합니다! AI가 정리해 준 보고서 방향성을 토대로 과목 선생님과 활발히 진로·학업 소통을 실현하는 것이 최고의 전략입니다!`
          }
        ];
      } else {
        // 여러 노트 종합·취합 퀴즈 (4문제)
        const subjectNames = Array.from(new Set(targetNotes.map(n => n.subject))).join(", ");
        const allKeywords = targetNotes.map(n => n.keywords).join(", ").split(",").map(k => k.trim()).filter(Boolean);
        const kw1 = allKeywords[0] || "융합 탐구";
        const kw2 = allKeywords[1] || allKeywords[allKeywords.length - 1] || "문제 해결력";

        generatedQuizzes = [
          {
            question: `Q1. [${targetNotes.length}과목 취합 융합 진단] 이번에 선택한 과목 및 단원들(${subjectNames})을 서로 연결하여 학습함으로써 획득하는 최대 시너지는?`,
            options: [
              `중·고등 학제 및 고교학점제 취지에 맞춰 서로 다른 학문적 관점(${targetNotes[0].category} 등)을 융합해 '${targetJobName}' 직군이 요구하는 차세대 문제 해결력을 입증한다.`,
              "여러 과목을 맥락 없이 섞어 공부함으로써 개별 과목의 개념을 헷갈리게 만든다.",
              "과목 간 연관성 분석 없이 노트 생성 건수만 늘려 학습 시간만 부가한다.",
              "학교 정규 시험을 보지 않고 AI 노트 종합 요약만으로 교과 평가를 대체한다."
            ],
            correctIdx: 0,
            explanation: `정답입니다! 여러 교과목 노트를 하나로 취합해 융합적으로 분석하는 것은 현대 교육과 미래 산업 환경에서 가장 중시되는 '융합적 인재'의 증거입니다.`
          },
          {
            question: `Q2. [통합 키워드 분석] 취합된 ${targetNotes.length}개 노트 속 핵심 키워드 중 '${kw1}', '${kw2}' 등이 공통적으로 지시하는 학업 발전 방향은 무엇인가요?`,
            options: [
              `단편적인 암기에서 벗어나 실현 가능한 미래 기술 및 사회 실물 문제를 논리적으로 탐구하는 깊이 있는 자세`,
              "시험 출제 가능성이 없는 무작위 외국어 표현들을 단순 열람한 행위",
              "교사 요약본을 어떤 고찰 없이 글자 그대로 받아 적는 수동적 학업 태도",
              "학급 규칙과 상관없는 개인적인 감성 위주의 일기장 기록"
            ],
            correctIdx: 0,
            explanation: `정답! 다양한 과목에서 도출한 키워드들이 하나로 어우러져 회원님의 탁월한 지적 전공 적합성을 가리키고 있습니다.`
          },
          {
            question: `Q3. [고교학점제 융합 보고서 전략] 취합된 노트들(${targetNotes.slice(0, 2).map(n => n.subject).join(", ")} 등)을 결합하여 교과 선생님들께 선보일 '융합 심화 소논문·탐구보고서'를 기안하는 올바른 방법은?`,
            options: [
              `각 과목에서 학습한 핵심 이론(Cues)을 교차 검증하고, 이를 '${targetJobName}' 실전 기술과 연계한 심화 탐구 결과를 정리해 멘토 교사들과 상담한다!`,
              "취합된 과목 중 가장 분량이 적은 과목 하나의 제목만 표지에 넣고 내용은 뺀다.",
              "인터넷 출처 불명의 게시물을 그대로 캡처하여 노트의 본문 없이 제출한다.",
              "교과 역량과 전혀 상관없는 교외 민간 사교육 기관의 수업 이름을 강조한다."
            ],
            correctIdx: 0,
            explanation: `완벽합니다! 여러 학문의 경계를 넘나드는 학문간 융합 탐구야말로 고경학점제 및 입시에서 학생부 세특을 빛내는 핵심 비법입니다!`
          },
          {
            question: `Q4. (O/X 퀴즈) 여러 학습 노트를 입체적으로 취합하여 복합 퀴즈로 테스트하는 것은 메타인지를극대화하고 장기 기억을 강화하는 데 매우 효과적인 학습 전략이다!`,
            options: [
              "⭕ 네, 맞습니다! 과목 간 지식을 구조화하고 메타인지를 일우는 최고의 학습 방식입니다.",
              "❌ 아니요, 과목을 결합해서 공부하면 혼란만 주므로 항상 단일 과목만 암기해야 합니다."
            ],
            correctIdx: 0,
            explanation: `정답입니다! 취합 퀴즈 테스트를 통해 분절된 지식을 유기적으로 엮는 기쁨을 경험하세요!`
          }
        ];
      }
      setQuizzes(generatedQuizzes);
      setQuizLoading(false);
    }, 600);
  };

  // 과목 카테고리 필터링 logic
  const filteredNotes = selectedCategory === "전체" 
    ? notes 
    : notes.filter(n => normalizeCategory(n.category) === selectedCategory);

  // 현재 노트가 존재하는 카테고리 (전체 탭 요약 보드용)
  const activeCategories = SUBJECT_CATEGORIES.filter(cat => 
    cat !== "전체" && notes.some(n => normalizeCategory(n.category) === cat)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 space-y-10 selection:bg-[#7B5CF0]/20 selection:text-[#7B5CF0]">
      
      {/* =========================================================================
          SECTION 1: HERO TITLE (현재 선택된 직무 테마 연동 & 고교학점제 안내)
         ========================================================================= */}
      <div className="rounded-[36px] bg-gradient-to-r from-[#7B5CF0] via-[#5D32D8] to-[#2E0B8A] text-white p-8 sm:p-12 shadow-[0_18px_48px_rgba(123,92,240,0.25)] border-4 border-white/30 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="space-y-4 max-w-2xl z-10 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full font-extrabold text-xs sm:text-sm tracking-wide border border-white/40 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
              <span>★ 선택 직무 연계: <strong>{targetJobName}</strong></span>
            </div>
            <span className="bg-[#FF3B7C] text-white text-xs sm:text-sm font-black px-3.5 py-1.5 rounded-full shadow-md">
              ⚡ 중·고등 및 고교학점제 맞춤
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-headline font-black text-white tracking-tight leading-tight">
            📘 AI 스마트 학습 포트폴리오 <br className="hidden sm:block"/> &amp; 코넬 노트 요약 보드
          </h1>
          <p className="text-sm sm:text-base font-semibold text-[#DFD7FF] leading-relaxed">
            과목별 요약 스티커로 나의 전체 학습 기록을 한눈에 살펴보세요! 필요할 때 <strong>[아코디언 펼치기]</strong>로 세부 내용을 확인하며, AI가 <strong>"{targetJobName}"</strong> 세특 연계 요약을 도출합니다. 단독 혹은 <strong>여러 노트를 취합한 AI 맞춤 퀴즈</strong>까지 원스톱으로 지원합니다!
          </p>
        </div>

        <div className="flex-shrink-0 z-10 w-36 h-36 sm:w-48 sm:h-48 rounded-[36px] bg-white/20 backdrop-blur-xl p-4 border-4 border-white/50 shadow-2xl flex items-center justify-center transform hover:scale-105 transition-all">
          <img src={customAvatarUrl} alt="Target Job Avatar" className="w-full h-full object-contain filter drop-shadow-2xl" />
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: 화면 깔끔한 정리를 위한 메인 컨트롤 바 (버튼 토글)
         ========================================================================= */}
      <div className="bg-gradient-to-r from-[#F7F4FF] via-[#FFF8FC] to-[#F3FAFA] rounded-[32px] p-6 sm:p-8 border-2 border-[#E1DAFA] shadow-md flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1.5 text-center lg:text-left">
          <div className="inline-flex items-center gap-1.5 bg-[#7B5CF0]/10 text-[#7B5CF0] px-3 py-1 rounded-full text-xs font-black">
            <Layers className="w-4 h-4" />
            <span>Smart Portfolio Control Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-headline font-black text-[#1A1626]">
            📚 총 <span className="text-[#7B5CF0] underline underline-offset-4">{notes.length}</span>건의 학습 코넬 노트가 보관 중입니다
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-[#5C5672] break-keep">
            화면 상단의 버튼을 눌러 새 학습을 간편히 기록하거나, 누적된 노트들을 조합해 실전 AI 퀴즈에 도전하세요!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full lg:w-auto shrink-0">
          <button
            onClick={() => setShowNoteForm(true)}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-[#7B5CF0] to-[#5D32D8] hover:brightness-110 text-white font-black text-sm sm:text-base shadow-[0_10px_25px_rgba(123,92,240,0.3)] transition-all flex items-center justify-center gap-2.5 transform hover:-translate-y-1 active:scale-95 cursor-pointer border-2 border-white/60"
          >
            <Plus className="w-5 h-5 text-amber-300 stroke-[3]" />
            <span>✨ 새로운 학습 기록하기 (노트 작성)</span>
          </button>

          <button
            onClick={() => {
              setSelectedQuizNoteIds([]);
              setShowQuizStudioModal(true);
            }}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-[#FF3B7C] via-[#FF6247] to-[#7B5CF0] hover:brightness-110 text-white font-black text-sm sm:text-base shadow-[0_10px_25px_rgba(255,59,124,0.35)] transition-all flex items-center justify-center gap-2.5 transform hover:-translate-y-1 active:scale-95 cursor-pointer border-2 border-white/60"
          >
            <Brain className="w-5 h-5 text-amber-300 animate-bounce-short" />
            <span>🤖 아리와 함께 퀴즈 만들기 (AI 스튜디오)</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          SECTION 3 (MODAL / TOGGLE PANEL): 신규 코넬 노트 작성 및 AI 심화 요약 폼
         ========================================================================= */}
      {showNoteForm && (
        <div className="bg-white rounded-[36px] p-7 sm:p-12 shadow-[0_20px_60px_rgba(123,92,240,0.18)] border-4 border-[#7B5CF0] space-y-8 animate-fadeIn relative">
          <button
            onClick={() => setShowNoteForm(false)}
            className="absolute top-6 right-6 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <X className="w-4 h-4" />
            <span>작성창 닫기</span>
          </button>

          <div className="border-b-2 border-purple-100 pb-5">
            <div className="inline-flex items-center gap-1.5 bg-[#7B5CF0]/10 text-[#7B5CF0] px-3.5 py-1 rounded-full text-xs font-black mb-2">
              <BookOpen className="w-4 h-4" />
              <span>Cornell Note-Taking System & AI 세특 연결</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-headline font-black text-[#1A1626]">
              ✍️ 중·고등 및 고교학점제 맞춤 코넬 학습 노트 작성
            </h3>
            <p className="text-xs sm:text-sm font-semibold text-[#5C5672] mt-1 break-keep">
              학교급과 과목 영역을 골라 추천 단원 칩을 터치하세요! 작성된 요약은 <strong>과목별 스티커 보드</strong>에 깔끔히 추가됩니다.
            </p>
          </div>

          <form onSubmit={handleCreateCornellNote} className="space-y-7">
            
            {/* 1. 학교급 선택 (중학교 공통/선택 vs 고등학교 고교학점제) */}
            <div className="space-y-3">
              <label className="text-xs sm:text-sm font-black text-[#3B364C] block flex items-center gap-2">
                <span>🏫 1단계: 회원님의 학교급 및 교과과정을 선택하세요</span>
                <span className="text-xs text-[#7B5CF0] font-bold">(교육과정 자동 연계)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SCHOOL_LEVEL_INFO.map((level) => {
                  const isSelected = selectedSchoolLevel === level.id;
                  return (
                    <div
                      key={level.id}
                      onClick={() => setSelectedSchoolLevel(level.id as "high" | "middle")}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                        isSelected
                          ? "bg-[#F7F4FF] border-[#7B5CF0] shadow-md scale-[1.01]"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-base text-[#1A1626]">{level.label}</h4>
                        <span className={`text-[11px] px-2.5 py-1 rounded-full font-black ${isSelected ? 'bg-[#7B5CF0] text-white' : 'bg-slate-200 text-slate-600'}`}>
                          {level.badge}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-600 leading-relaxed">{level.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. 과목 영역(카테고리) 및 과목명 입력 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-purple-50">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-black text-[#3B364C] block">
                  🏷️ 2단계: 교과 영역 분류
                </label>
                <select
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className="w-full h-14 px-4 rounded-2xl bg-[#F8F6FF] border-2 border-[#E1DAFA] font-extrabold text-sm text-[#1A1626] focus:border-[#7B5CF0] focus:outline-none shadow-inner"
                >
                  {SUBJECT_CATEGORIES.filter(c => c !== "전체").map((c, idx) => (
                    <option key={idx} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 md:col-span-2">
                <label className="text-xs sm:text-sm font-black text-[#3B364C] block flex items-center justify-between">
                  <span>📚 3단계: 과목명 및 세부 단원 / 범위</span>
                  <span className="text-[11px] font-bold text-[#6240D5]">💡 하단 추천 과목을 클릭하면 입력됩니다</span>
                </label>
                <input
                  type="text"
                  placeholder="예: 물리학 I - 신소재 열역학, 혹은 통합사회 - 세계시민과 인권"
                  value={subjectInput}
                  onChange={(e) => setSubjectInput(e.target.value)}
                  className="w-full h-14 px-5 rounded-2xl bg-[#F8F6FF] border-2 border-[#E1DAFA] font-bold text-sm text-[#1A1626] placeholder:text-[#908A9E] focus:border-[#7B5CF0] focus:outline-none shadow-inner"
                />

                {/* 교육과정별 추천 과목 칩 */}
                <div className="bg-[#FAF8FF] p-4 rounded-2xl border border-purple-100 space-y-2">
                  <span className="text-[11px] font-black text-[#6E6A80] block">
                    ✨ [{selectedSchoolLevel === "high" ? "고교학점제" : "중등 교과"}] {categoryInput} 영역 추천 과목 (클릭 시 자동 입력):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(RECOMMENDED_SUBJECTS[selectedSchoolLevel]?.[categoryInput] || ["직접 입력"]).map((chip, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSubjectInput(chip)}
                        className="text-xs font-black bg-white hover:bg-[#7B5CF0] hover:text-white text-[#5A4D8C] px-3 py-1.5 rounded-xl border border-[#DED7FC] shadow-2xs transition-all duration-150 transform active:scale-95 cursor-pointer"
                      >
                        + {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. 학습 주제 및 핵심 키워드 (코넬 좌측 란) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-purple-50">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-black text-[#3B364C] block">
                  🎯 4단계: 오늘의 핵심 탐구 주제 (Topic)
                </label>
                <input
                  type="text"
                  placeholder="예: 양자 역학 이론을 활용한 첨단 모빌리티 열변형 제어"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  className="w-full h-14 px-5 rounded-2xl bg-[#F8F6FF] border-2 border-[#E1DAFA] font-bold text-sm text-[#1A1626] placeholder:text-[#908A9E] focus:border-[#7B5CF0] focus:outline-none shadow-inner"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-black text-[#3B364C] block">
                  🔑 5단계: 핵심 키워드 3~5개 (Cornell Cues 란)
                </label>
                <input
                  type="text"
                  placeholder="예: 열역학 제2법칙, 엔트로피 제어, 초전도체, 융합사고"
                  value={keywordsInput}
                  onChange={(e) => setKeywordsInput(e.target.value)}
                  className="w-full h-14 px-5 rounded-2xl bg-[#F8F6FF] border-2 border-[#E1DAFA] font-bold text-sm text-[#1A1626] placeholder:text-[#908A9E] focus:border-[#7B5CF0] focus:outline-none shadow-inner"
                />
              </div>
            </div>

            {/* 4. 학습 요약 (코넬 메인 란) */}
            <div className="space-y-2 pt-2 border-t border-purple-50">
              <label className="text-xs sm:text-sm font-black text-[#3B364C] block">
                📝 6단계: 나의 학습 요약 &amp; 심화 고찰 (Cornell Notes 란)
              </label>
              <textarea
                rows={4}
                placeholder="학교 수업, 인터넷 강좌, 혹은 동아리 탐구를 통해 배우고 느낀 점, 의문점이나 융합 확장 아이디어를 적어보세요! AI가 '희망 직급 세특용 요약'을 자동 덧붙여 줍니다."
                value={summaryInput}
                onChange={(e) => setSummaryInput(e.target.value)}
                className="w-full p-5 rounded-2xl bg-[#F8F6FF] border-2 border-[#E1DAFA] font-semibold text-sm text-[#1A1626] placeholder:text-[#908A9E] focus:border-[#7B5CF0] focus:outline-none shadow-inner leading-relaxed"
              />
            </div>

            {/* 버튼 컨트롤 */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-4 border-t-2 border-purple-100">
              <button
                type="button"
                onClick={() => setShowNoteForm(false)}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-sm transition-all"
              >
                작성 취소 및 닫기
              </button>
              <button
                type="submit"
                disabled={isAiGenerating}
                className="w-full sm:w-auto py-4 px-10 rounded-2xl bg-gradient-to-r from-[#7B5CF0] via-[#5C32D9] to-[#008A90] hover:brightness-110 text-white font-black text-base border-2 border-white shadow-[0_10px_25px_rgba(123,92,240,0.3)] hover:shadow-[0_15px_35px_rgba(123,92,240,0.45)] transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <Sparkles className={`w-6 h-6 text-amber-300 ${isAiGenerating ? "animate-spin" : ""}`} />
                <span>{isAiGenerating ? "AI가 세특 심화 정리본 도출 중..." : "✨ AI 스마트 정리본 도출 및 보관함에 즉시 누적"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          SECTION 4: 과목별 학습 요약 스티커 보드 & 아코디언 세부 열기
         ========================================================================= */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-purple-100 pb-5">
          <div>
            <h3 className="text-2xl font-headline font-black text-[#1A1626] flex items-center gap-2.5">
              <FolderCheck className="w-8 h-8 text-[#008A90]" />
              <span>🗂️ 과목별 학습 요약 보드 &amp; 코넬 노트 보관함</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#5C5672] font-semibold mt-1">
              학습 노트가 과목별 <strong>요약 스티커 형태</strong>로 제공되어 전체 현황이 한눈에 보입니다! 카드를 눌러 <strong>[아코디언 세부 고찰]</strong>을 확인하세요.
            </p>
          </div>

          {/* 카테고리 필터 탭 바 */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> 필터:
            </span>
            {SUBJECT_CATEGORIES.map((cat) => {
              const count = cat === "전체" ? notes.length : notes.filter(n => normalizeCategory(n.category) === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm transition-all shadow-sm flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#7B5CF0] text-white scale-105 shadow-md"
                      : "bg-white text-[#6E6A80] border border-purple-200 hover:bg-[#FAF6FF]"
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 노트 리스트 렌더링 (전체 모드 vs 단편 과목 모드) */}
        {filteredNotes.length === 0 ? (
          <div className="w-full py-20 text-center bg-white rounded-[36px] border-2 border-dashed border-purple-200 space-y-3 shadow-sm">
            <span className="text-5xl block">📭</span>
            <p className="text-lg font-extrabold text-[#7B5CF0]">선택하신 교과 영역에 등록된 학습 노트가 없습니다.</p>
            <p className="text-xs font-bold text-[#8A859C]">상단 [ ✨ 새로운 학습 기록하기 ] 버튼을 눌러 중·고교 교목 노트를 채워보세요!</p>
          </div>
        ) : selectedCategory === "전체" ? (
          /* [전체 탭 모드]: 과목 섹션별 요약 스티커 카드 보드 (과목당 최대 3개 표시 + 더보기 버튼) */
          <div className="space-y-10">
            {activeCategories.map((catName) => {
              const catNotes = notes.filter(n => normalizeCategory(n.category) === catName);
              const displayNotes = catNotes.slice(0, 3);
              const remainingCount = catNotes.length - 3;

              return (
                <div key={catName} className="bg-[#FAF8FF]/60 p-6 sm:p-8 rounded-[36px] border-2 border-[#EADFFF] shadow-xs space-y-6">
                  {/* 과목 섹션 헤더 & 과목별 취합 퀴즈 생성 버튼 */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-200 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl sm:text-2xl font-black text-[#1A1626]">
                        {catName}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-[#7B5CF0] text-white text-xs font-black shadow-xs">
                        총 {catNotes.length}개 기록
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleStartQuiz(catNotes)}
                        className="px-4 py-2 rounded-xl bg-[#008A90] hover:bg-[#00757A] text-white font-black text-xs shadow-sm transition-transform transform hover:scale-105 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Brain className="w-4 h-4 text-amber-300 animate-pulse" />
                        <span>⚡ 이 과목 ({catNotes.length}건) 전체 취합 퀴즈</span>
                      </button>
                      
                      <button
                        onClick={() => setSelectedCategory(catName)}
                        className="px-4 py-2 rounded-xl bg-white hover:bg-purple-50 text-[#7B5CF0] border border-purple-200 font-black text-xs transition-all flex items-center gap-1"
                      >
                        <span>과목 모아보기</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* 스티커 카드 그리드 (한눈에 보기) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayNotes.map((note) => {
                      const isExpanded = !!expandedNoteIds[note.id];
                      return (
                        <div
                          key={note.id}
                          className={`rounded-[28px] transition-all duration-300 border-2 flex flex-col justify-between relative overflow-hidden ${
                            isExpanded 
                              ? "col-span-1 md:col-span-2 lg:col-span-3 bg-white border-[#7B5CF0] shadow-2xl scale-[1.005]" 
                              : "bg-[#FFFDF9] border-[#E8DFC8] hover:border-[#7B5CF0] shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:shadow-lg"
                          }`}
                        >
                          {/* 3공 타공 구멍 & 스티커 테두리 느낌 */}
                          <div className="w-full py-2 bg-[#F5EEDC] flex items-center justify-center gap-4 border-b border-[#DFD3B6] shadow-inner">
                            {[...Array(isExpanded ? 12 : 5)].map((_, i) => (
                              <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#3D3522]/30 shadow-inner border border-white/70" />
                            ))}
                          </div>

                          {/* 요약 스티커 상단 정보 (항상 표시) */}
                          <div className="p-5 sm:p-6 space-y-4 flex-grow flex flex-col justify-between">
                            <div className="space-y-2.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] font-black px-3 py-1 rounded-full bg-[#008A90] text-white shadow-2xs">
                                  {note.subject}
                                </span>
                                <span className="text-[11px] font-bold text-[#6E6A80] bg-[#F3ECE0] px-2.5 py-1 rounded-lg">
                                  📅 {note.date}
                                </span>
                              </div>

                              <h4 className="text-base sm:text-lg font-black text-[#1A1626] leading-snug tracking-tight">
                                🎯 {note.topic}
                              </h4>

                              {/* 키워드 칩 */}
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {note.keywords.split(',').map((kw, kIdx) => (
                                  <span key={kIdx} className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-md bg-[#FFFBF0] text-[#D97706] border border-[#FDE68A]">
                                    #{kw.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* 요약 미리보기 (접혀 있을 때만 간략 표시) */}
                            {!isExpanded && (
                              <div className="p-3.5 rounded-2xl bg-[#F8F6FF] border border-purple-100 space-y-1 mt-3">
                                <span className="text-[10px] font-black text-[#7B5CF0] flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-amber-400" /> AI 세특 요약 미리보기:
                                </span>
                                <p className="text-xs font-bold text-[#4B465C] line-clamp-2 leading-relaxed">
                                  {note.aiSummary || note.mySummary}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* =========================================================
                              아코디언 펼치기 영역 (세부 코넬 노트 & AI 심화)
                             ========================================================= */}
                          {isExpanded && (
                            <div className="border-t-2 border-purple-150 bg-[#FAF8FF] animate-fadeIn">
                              <div className="flex flex-col lg:flex-row">
                                {/* 좌측 란: Cues / 핵심 키워드 */}
                                <div className="w-full lg:w-1/3 bg-[#FFFBF0] p-6 sm:p-8 lg:border-r-[3px] border-b lg:border-b-0 border-[#FCA5A5] space-y-3">
                                  <div className="inline-flex items-center gap-1.5 bg-[#FEF2F2] text-[#DC2626] px-3 py-1 rounded-lg text-xs font-black border border-red-200">
                                    <span>📌 Cues (핵심 키워드 & 개념)</span>
                                  </div>
                                  <p className="text-sm font-extrabold text-[#3F3952] leading-relaxed break-keep">
                                    {note.keywords}
                                  </p>
                                  <div className="p-4 rounded-2xl bg-white border border-amber-200 space-y-1 mt-4">
                                    <span className="text-[11px] font-black text-amber-700 block">💡 코넬 기법 활용 팁:</span>
                                    <span className="text-xs font-bold text-slate-600 leading-relaxed block">
                                      좌측 키워드를 보며 우측 본문 내용을 떠올려보는 인출 연습이 기억 고착화에 효과적입니다.
                                    </span>
                                  </div>
                                </div>

                                {/* 메인 란: Notes / 나의 학습 요약 & 고찰 */}
                                <div className="w-full lg:w-2/3 bg-[#FFFDFC] p-6 sm:p-8 space-y-3">
                                  <div className="inline-flex items-center gap-1.5 bg-[#F0FDF4] text-[#15803D] px-3 py-1 rounded-lg text-xs font-black border border-green-200">
                                    <span>📝 Notes (나의 학업 요약 & 심화 고찰)</span>
                                  </div>
                                  <p className="text-sm sm:text-base font-bold text-[#1A1626] leading-relaxed whitespace-pre-wrap break-keep">
                                    {note.mySummary}
                                  </p>
                                </div>
                              </div>

                              {/* 하단 란: Summary / AI 스마트 세특 심화 정리본 */}
                              {note.aiSummary && (
                                <div className="w-full border-t-[3px] border-t-[#A5B4FC] bg-gradient-to-r from-[#EEF2FF] via-[#F5F3FF] to-[#FAF5FF] p-6 sm:p-8 space-y-3">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="inline-flex items-center gap-2 bg-[#4338CA] text-white px-4 py-1.5 rounded-full text-xs font-black shadow-md">
                                      <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
                                      <span>💡 AI 스마트 심화 정리 및 세특 매칭</span>
                                    </div>
                                    <span className="text-xs font-black text-[#4338CA] bg-white px-3 py-1 rounded-full border border-indigo-200 shadow-sm">
                                      ⚡ "{targetJobName}" 진료 역량 98% 부합
                                    </span>
                                  </div>
                                  <p className="text-sm sm:text-base font-extrabold text-[#1E1B4B] leading-relaxed break-keep pt-1">
                                    {note.aiSummary}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* 하단 인터랙티브 컨트롤 버튼 (아코디언 토글 & 단독 퀴즈) */}
                          <div className="p-4 bg-[#F8F6FF] border-t border-[#DFD3B6] flex items-center justify-between gap-3">
                            <button
                              onClick={() => toggleNoteExpand(note.id)}
                              className={`flex-grow py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
                                isExpanded 
                                  ? "bg-[#7B5CF0] text-white shadow-md" 
                                  : "bg-white hover:bg-purple-100 text-[#7B5CF0] border border-[#DCD3FA]"
                              }`}
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="w-4 h-4 text-white stroke-[3]" />
                                  <span>🔼 요약 스티커로 접기</span>
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-4 h-4 text-[#7B5CF0] stroke-[3]" />
                                  <span>🔽 세부 내용 및 AI 심화정리 펼치기</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleStartQuiz([note])}
                              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF3B7C] to-[#FF7043] hover:brightness-110 text-white font-black text-xs shadow-md transition-all flex items-center gap-1 shrink-0"
                            >
                              <Brain className="w-4 h-4 text-white" />
                              <span>🧠 단독 퀴즈</span>
                            </button>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                  {/* "더보기" 탭 이동 바 (3개 이상 누적 시 표시) */}
                  {remainingCount > 0 && (
                    <div className="text-center pt-2">
                      <button
                        onClick={() => setSelectedCategory(catName)}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#7B5CF0] hover:bg-[#6340D5] text-white font-black text-sm shadow-md hover:shadow-xl transition-all inline-flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                      >
                        <Bookmark className="w-4 h-4 text-amber-300" />
                        <span>+ '{catName}' 과목의 학습 노트 {remainingCount}개 더보기 (단원별 모아보기 탭으로 이동) &rarr;</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* [과목 특정 탭 모드]: 선택된 교과 영역 내 모든 노트를 단원별로 클러스터링하여 표시 */
          <div className="space-y-12">
            <div className="p-6 rounded-3xl bg-[#F7F4FF] border-2 border-[#E1DAFA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black bg-[#7B5CF0] text-white px-3 py-1 rounded-full inline-block mb-1">
                  단원별 집중 탐험 모드
                </span>
                <h4 className="text-2xl font-black text-[#1A1626]">
                  {selectedCategory} 교과 전수 누적 (총 {filteredNotes.length}건)
                </h4>
                <p className="text-xs font-bold text-slate-500">
                  이 교과목에 누적하신 모든 노트를 단원별로 확인하고 통합 퀴즈로 테스트해 보세요!
                </p>
              </div>

              <button
                onClick={() => handleStartQuiz(filteredNotes)}
                className="px-6 py-3.5 rounded-2xl bg-[#008A90] hover:bg-[#007379] text-white font-black text-sm shadow-md transition-transform transform hover:scale-105 flex items-center gap-2"
              >
                <Brain className="w-5 h-5 text-amber-300 animate-pulse" />
                <span>⚡ {selectedCategory} 전과목/단원 취합 퀴즈 생성 ({filteredNotes.length}과목)</span>
              </button>
            </div>

            {/* 단원별 그룹핑 렌더링 */}
            {(() => {
              // 과목/단원명(e.g., '물리학 I', '통합과학', '정보')을 추출해 클러스터링
              const grouped: Record<string, CornellNote[]> = {};
              filteredNotes.forEach(n => {
                const unitName = n.subject.split(/[-&(/]/)[0].trim() || n.subject;
                if (!grouped[unitName]) grouped[unitName] = [];
                grouped[unitName].push(n);
              });

              return Object.entries(grouped).map(([unit, unitNotes]) => (
                <div key={unit} className="space-y-4">
                  <div className="flex items-center justify-between border-b-2 border-purple-150 pb-2 pl-2">
                    <h5 className="text-lg font-black text-[#3F3952] flex items-center gap-2">
                      <Bookmark className="w-5 h-5 text-[#7B5CF0]" />
                      <span>📑 {unit} 단원 / 세목 (총 {unitNotes.length}건)</span>
                    </h5>
                    <button
                      onClick={() => handleStartQuiz(unitNotes)}
                      className="text-xs font-black text-[#7B5CF0] bg-purple-50 hover:bg-[#7B5CF0] hover:text-white px-3.5 py-1.5 rounded-xl border border-purple-200 transition-colors flex items-center gap-1"
                    >
                      <span>🧠 이 단원 통합 퀴즈 &rarr;</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {unitNotes.map(note => {
                      const isExpanded = !!expandedNoteIds[note.id];
                      return (
                        <div
                          key={note.id}
                          className={`rounded-[28px] transition-all duration-300 border-2 flex flex-col justify-between relative overflow-hidden ${
                            isExpanded 
                              ? "col-span-1 md:col-span-2 lg:col-span-3 bg-white border-[#7B5CF0] shadow-2xl scale-[1.005]" 
                              : "bg-[#FFFDF9] border-[#E8DFC8] hover:border-[#7B5CF0] shadow-[0_8px_25px_rgba(0,0,0,0.06)] hover:shadow-lg"
                          }`}
                        >
                          <div className="w-full py-2 bg-[#F5EEDC] flex items-center justify-center gap-4 border-b border-[#DFD3B6] shadow-inner">
                            {[...Array(isExpanded ? 12 : 5)].map((_, i) => (
                              <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#3D3522]/30 shadow-inner border border-white/70" />
                            ))}
                          </div>

                          <div className="p-5 sm:p-6 space-y-4 flex-grow flex flex-col justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-black px-3 py-1 rounded-full bg-[#008A90] text-white">
                                  {note.subject}
                                </span>
                                <span className="text-[11px] font-bold text-[#6E6A80] bg-[#F3ECE0] px-2.5 py-1 rounded-lg">
                                  📅 {note.date}
                                </span>
                              </div>
                              <h4 className="text-base font-black text-[#1A1626] leading-snug">🎯 {note.topic}</h4>
                              <div className="flex flex-wrap gap-1 pt-1">
                                {note.keywords.split(',').map((kw, kIdx) => (
                                  <span key={kIdx} className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-[#FFFBF0] text-[#D97706] border border-[#FDE68A]">
                                    #{kw.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {!isExpanded && (
                              <div className="p-3.5 rounded-2xl bg-[#F8F6FF] border border-purple-100 space-y-1 mt-3">
                                <span className="text-[10px] font-black text-[#7B5CF0] flex items-center gap-1">
                                  <Sparkles className="w-3 h-3 text-amber-400" /> AI 세특 요약 미리보기:
                                </span>
                                <p className="text-xs font-bold text-[#4B465C] line-clamp-2 leading-relaxed">
                                  {note.aiSummary || note.mySummary}
                                </p>
                              </div>
                            )}
                          </div>

                          {isExpanded && (
                            <div className="border-t-2 border-purple-150 bg-[#FAF8FF] animate-fadeIn">
                              <div className="flex flex-col lg:flex-row">
                                <div className="w-full lg:w-1/3 bg-[#FFFBF0] p-6 sm:p-8 lg:border-r-[3px] border-b lg:border-b-0 border-[#FCA5A5] space-y-3">
                                  <div className="inline-flex items-center gap-1.5 bg-[#FEF2F2] text-[#DC2626] px-3 py-1 rounded-lg text-xs font-black border border-red-200">
                                    <span>📌 Cues (핵심 키워드)</span>
                                  </div>
                                  <p className="text-sm font-extrabold text-[#3F3952] leading-relaxed break-keep">
                                    {note.keywords}
                                  </p>
                                </div>
                                <div className="w-full lg:w-2/3 bg-[#FFFDFC] p-6 sm:p-8 space-y-3">
                                  <div className="inline-flex items-center gap-1.5 bg-[#F0FDF4] text-[#15803D] px-3 py-1 rounded-lg text-xs font-black border border-green-200">
                                    <span>📝 Notes (탐구 요약 & 심화 고찰)</span>
                                  </div>
                                  <p className="text-sm sm:text-base font-bold text-[#1A1626] leading-relaxed whitespace-pre-wrap break-keep">
                                    {note.mySummary}
                                  </p>
                                </div>
                              </div>
                              {note.aiSummary && (
                                <div className="w-full border-t-[3px] border-t-[#A5B4FC] bg-gradient-to-r from-[#EEF2FF] via-[#F5F3FF] to-[#FAF5FF] p-6 sm:p-8 space-y-3">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="inline-flex items-center gap-2 bg-[#4338CA] text-white px-4 py-1.5 rounded-full text-xs font-black shadow-md">
                                      <Sparkles className="w-4 h-4 text-amber-300" />
                                      <span>💡 AI 스마트 심화 정리 및 세특 매칭</span>
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
                          )}

                          <div className="p-4 bg-[#F8F6FF] border-t border-[#DFD3B6] flex items-center justify-between gap-3">
                            <button
                              onClick={() => toggleNoteExpand(note.id)}
                              className={`flex-grow py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
                                isExpanded 
                                  ? "bg-[#7B5CF0] text-white shadow-md" 
                                  : "bg-white hover:bg-purple-100 text-[#7B5CF0] border border-[#DCD3FA]"
                              }`}
                            >
                              {isExpanded ? "🔼 요약 스티커로 접기" : "🔽 세부 내용 및 AI 심화정리 펼치기"}
                            </button>

                            <button
                              onClick={() => handleStartQuiz([note])}
                              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF3B7C] to-[#FF7043] text-white font-black text-xs shadow-md hover:brightness-110 transition-all flex items-center gap-1 shrink-0"
                            >
                              <Brain className="w-4 h-4 text-white" />
                              <span>🧠 단독 퀴즈</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ));
            })()}
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL 1: 실전 지식 점검 AI 퀴즈 셀프 테스트 아레나 (Self-Test Arena)
         ========================================================================= */}
      {activeQuizNotes && activeQuizNotes.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-gradient-to-b from-white via-[#FAF7FF] to-[#F2EEFF] w-full max-w-4xl rounded-[40px] p-8 sm:p-12 shadow-[0_25px_80px_rgba(0,0,0,0.55)] border-4 border-white relative max-h-[90vh] overflow-y-auto space-y-8">
            
            <button
              onClick={() => setActiveQuizNotes(null)}
              className="absolute top-6 right-6 p-2.5 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 transition-colors shadow-sm cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* 퀴즈 모달 상단 헤더 */}
            <div className="text-center space-y-3 border-b-2 border-purple-100 pb-6">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-xs font-black bg-[#FF3B7C] text-white px-4 py-1.5 rounded-full shadow-md inline-flex items-center gap-1.5">
                  <Brain className="w-4 h-4 text-amber-300" />
                  <span>AI 맞춤 셀프 테스트 아레나</span>
                </span>
                <span className="text-xs font-black bg-[#4338CA] text-white px-3.5 py-1.5 rounded-full shadow-md">
                  ⚡ {activeQuizNotes.length === 1 ? "단일 과목 딥다이브 모드" : `${activeQuizNotes.length}과목 취합·종합 융합 테스트`}
                </span>
              </div>

              <h3 className="text-2xl sm:text-4xl font-black text-[#1A1626] tracking-tight">
                🧠 [{activeQuizNotes.length === 1 ? activeQuizNotes[0].subject : `${activeQuizNotes.map(n => n.subject.split('-')[0].trim()).slice(0, 2).join(", ")} 등 ${activeQuizNotes.length}과목 종합`}] 실전 점검!
              </h3>
              <p className="text-xs sm:text-sm font-extrabold text-[#5C5672] break-keep">
                {activeQuizNotes.length === 1 ? "해당 단일 코넬 노트" : `선택하신 ${activeQuizNotes.length}개의 노트를 통합 취합`}하여 AI가 생성한 <strong>맞춤 문제</strong>입니다. 터치하여 해설과 마일리지를 획득하세요!
              </p>
            </div>

            {/* 퀴즈 렌더링 혹은 로딩 스피너 */}
            {quizLoading ? (
              <div className="py-20 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-[#7B5CF0] text-white text-3xl flex items-center justify-center mx-auto animate-spin-slow shadow-xl">
                  ✨
                </div>
                <h4 className="text-xl font-black text-[#6240D5]">
                  AI 멘토 아리가 {activeQuizNotes.length > 1 ? `${activeQuizNotes.length}과목의 지식을 취합하여 융합` : '노트 데이터를 Deep Analysis하여'} 퀴즈를 출제 중입니다...
                </h4>
                <p className="text-xs text-slate-500 font-bold">고경학점제 및 진로 세특 시나리오 적용 중...</p>
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
                          if (isCorrect) btnStyle = "bg-[#E2FDEC] text-[#007A3E] border-2 border-[#54E297] font-black shadow-md";
                          else if (isSelected && !isCorrect) btnStyle = "bg-[#FFE8EF] text-[#D3184E] border-2 border-[#FFA1BC]";
                        } else if (isSelected) {
                          btnStyle = "bg-[#7B5CF0] text-white border-2 border-[#5B32D6] font-black shadow-md";
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => !showResults && setUserAnswers({ ...userAnswers, [idx]: oIdx })}
                            disabled={showResults}
                            className={`w-full py-4 px-6 rounded-2xl text-left font-bold text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {showResults && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 ml-2" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* 정답 확인 시 해설 노출 */}
                    {showResults && (
                      <div className="mt-4 p-5 rounded-2xl bg-[#F4F9FF] border border-[#C5DFFB] text-xs sm:text-sm font-extrabold text-[#1F5F9F] space-y-1">
                        <span className="text-[11px] bg-[#1F5F9F] text-white px-2.5 py-0.5 rounded-md inline-block mr-2">💡 AI 멘토 해설</span>
                        <span>{q.explanation}</span>
                      </div>
                    )}
                  </div>
                ))}

                {/* 하단 제어 바 */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-2 border-purple-100">
                  <span className="text-xs sm:text-sm font-black text-[#6E6A80]">
                    💡 문제를 모두 다 풀고 정답을 제출하면 진로 탐구 마일리지가 적립됩니다!
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
                      className="w-full sm:w-auto py-4 px-10 rounded-2xl bg-[#008A90] hover:bg-[#007379] text-white font-black text-base shadow-xl transition-transform transform hover:scale-105 cursor-pointer"
                    >
                      💯 정답 채점 및 AI 해설 즉시 확인!
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveQuizNotes(null)}
                      className="w-full sm:w-auto py-4 px-10 rounded-2xl bg-[#7B5CF0] hover:bg-[#6340D5] text-white font-black text-base shadow-xl transition-transform transform hover:scale-105 cursor-pointer"
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
          MODAL 2: 아리와 함께 퀴즈 만들기 스튜디오 (단독 퀴즈 OR 다중 취합 종합 퀴즈)
         ========================================================================= */}
      {showQuizStudioModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-gradient-to-b from-white via-[#FAF7FF] to-[#F2EEFF] w-full max-w-3xl rounded-[40px] p-7 sm:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.55)] border-4 border-white relative max-h-[90vh] overflow-hidden flex flex-col space-y-6">
            
            <button
              onClick={() => setShowQuizStudioModal(false)}
              className="absolute top-6 right-6 p-2.5 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 transition-colors shadow-sm cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center space-y-3 border-b-2 border-purple-100 pb-5 flex-shrink-0">
              <div className="w-16 h-16 rounded-3xl bg-white p-1.5 mx-auto shadow-xl border-2 border-purple-200 flex items-center justify-center animate-float">
                <img src={ARI_BLOB_URL} alt="Ari Mascot" className="w-full h-full object-contain filter drop-shadow-md" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-[#1A1626] tracking-tight">
                🤖 아리와 함께 문제 만들기 <span className="text-[#7B5CF0]">(AI 퀴즈 스튜디오)</span>
              </h3>
              <p className="text-xs sm:text-sm font-extrabold text-[#5C5672] break-keep leading-relaxed">
                한 과목을 집중 점검하는 <strong>[단독 퀴즈]</strong>는 물론, 여러 노트를 묶어 융합 역량을 시험하는 <strong>[취합 종합 퀴즈]</strong>를 자유롭게 선택해 보세요!
              </p>

              {/* 모드 전환 탭 (단일 vs 취합) */}
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setQuizStudioTab("multi")}
                  className={`px-6 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 ${
                    quizStudioTab === "multi"
                      ? "bg-[#FF3B7C] text-white shadow-lg scale-105"
                      : "bg-slate-100 hover:bg-purple-50 text-slate-600 border border-slate-200"
                  }`}
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>🧩 여러 노트 취합 종합 퀴즈 (추천)</span>
                </button>

                <button
                  onClick={() => setQuizStudioTab("single")}
                  className={`px-6 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 ${
                    quizStudioTab === "single"
                      ? "bg-[#7B5CF0] text-white shadow-lg scale-105"
                      : "bg-slate-100 hover:bg-purple-50 text-slate-600 border border-slate-200"
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  <span>📌 단일 노트 맞춤 퀴즈</span>
                </button>
              </div>
            </div>

            {/* 노트 리스트 & 선택 영역 */}
            {notes.length === 0 ? (
              <div className="py-12 text-center text-slate-500 font-bold space-y-2">
                <span className="text-4xl block">📭</span>
                <p>아직 작성된 학습 노트가 없어요! 메인 화면에서 요약 노트를 먼저 등록해 주세요.</p>
              </div>
            ) : (
              <div className="flex-grow overflow-y-auto pr-1 space-y-4">
                
                {quizStudioTab === "multi" && (
                  <div className="flex items-center justify-between bg-purple-50 p-3.5 rounded-2xl border border-purple-200 text-xs font-black text-[#6240D5]">
                    <span>✨ 취합하고 싶은 과목들을 체크하고 하단 출제 버튼을 눌러주세요!</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedQuizNoteIds(notes.map(n => n.id))}
                        className="bg-white px-3 py-1 rounded-lg shadow-2xs hover:bg-[#7B5CF0] hover:text-white transition-colors"
                      >
                        전체 선택
                      </button>
                      <button
                        onClick={() => setSelectedQuizNoteIds([])}
                        className="bg-white px-3 py-1 rounded-lg shadow-2xs hover:bg-rose-500 hover:text-white transition-colors text-rose-600"
                      >
                        선택 해제
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
                  {notes.map((note) => {
                    const isChecked = selectedQuizNoteIds.includes(note.id);

                    const handleClickCard = () => {
                      if (quizStudioTab === "single") {
                        setShowQuizStudioModal(false);
                        handleStartQuiz([note]);
                      } else {
                        // 다중 취합 모드에서는 체크박스 토글
                        if (isChecked) {
                          setSelectedQuizNoteIds(prev => prev.filter(id => id !== note.id));
                        } else {
                          setSelectedQuizNoteIds(prev => [...prev, note.id]);
                        }
                      }
                    };

                    return (
                      <div
                        key={note.id}
                        onClick={handleClickCard}
                        className={`p-5 rounded-[26px] transition-all duration-200 border-2 cursor-pointer flex flex-col justify-between gap-3 transform hover:-translate-y-1 ${
                          isChecked && quizStudioTab === "multi"
                            ? "bg-[#FFF4F8] border-[#FF3B7C] shadow-lg scale-[1.01]"
                            : "bg-white hover:bg-[#FAF6FF] border-[#E1DAFA] hover:border-[#7B5CF0] shadow-sm"
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black bg-[#008A90] text-white px-2.5 py-0.5 rounded-full">
                              {note.subject}
                            </span>
                            {quizStudioTab === "multi" ? (
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center border ${isChecked ? 'bg-[#FF3B7C] border-[#FF3B7C] text-white' : 'bg-slate-100 border-slate-300 text-transparent'}`}>
                                ✓
                              </div>
                            ) : (
                              <span className="text-[10px] bg-purple-100 text-[#7B5CF0] font-black px-2 py-0.5 rounded-md">
                                단독 출제 &rarr;
                              </span>
                            )}
                          </div>
                          
                          <h4 className="text-base font-black text-[#1A1626] line-clamp-1 tracking-tight">
                            🎯 {note.topic}
                          </h4>
                          
                          <p className="text-xs font-bold text-[#6E6A80] line-clamp-2 bg-[#F8F6FF] p-2 rounded-xl border border-purple-50">
                            📌 {note.keywords}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-black text-slate-400 pt-2 border-t border-slate-100">
                          <span>📅 {note.date}</span>
                          <span className="text-[#7B5CF0]">
                            {quizStudioTab === "single" ? "🧠 클릭 시 즉시 도전" : (isChecked ? "✨ 취합 목록 포함됨" : "+ 터치하여 취합 추가")}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* 다중 취합 모드 하단 실행 바 */}
            {quizStudioTab === "multi" && (
              <div className="pt-4 border-t-2 border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 bg-white p-4 rounded-3xl shadow-lg border">
                <div className="text-center sm:text-left">
                  <span className="text-sm font-black text-[#1A1626] block">
                    ✨ 현재 <strong className="text-[#FF3B7C] text-lg">{selectedQuizNoteIds.length}개</strong>의 학습 기록이 선택되었습니다.
                  </span>
                  <span className="text-xs font-bold text-slate-500">2개 이상 선택 시, 과목 간 융합 역량 퀴즈가 생성됩니다.</span>
                </div>

                <button
                  onClick={() => {
                    if (selectedQuizNoteIds.length === 0) {
                      alert("취합하여 퀴즈를 출제할 학습 노트를 1개 이상 체크해 주세요!");
                      return;
                    }
                    const selectedNotes = notes.filter(n => selectedQuizNoteIds.includes(n.id));
                    setShowQuizStudioModal(false);
                    handleStartQuiz(selectedNotes);
                  }}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-[#FF3B7C] via-[#FF6247] to-[#7B5CF0] hover:brightness-110 text-white font-black text-base shadow-xl transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-amber-300 animate-bounce-short" />
                  <span>🚀 선택한 {selectedQuizNoteIds.length}개 노트 통합 퀴즈 출제!</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default StarRoadmap;
