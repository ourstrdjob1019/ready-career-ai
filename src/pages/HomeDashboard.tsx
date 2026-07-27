import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components";
import { useAuth } from "../context";
import { executeAiPrompt } from "../services/aiService";
import { ARI_BLOB_URL } from "../assets/mascotData";
import {
  Sparkles,
  ArrowRight,
  Plus,
  CheckCircle2,
  Edit2,
  RefreshCw,
  Star,
  FolderCheck,
  Route,
  ListCheck
} from "lucide-react";

export const HomeDashboard: React.FC = () => {
  const { session } = useAuth();

  const [visionStatement, setVisionStatement] = useState<string>(() => {
    return localStorage.getItem("readycareer_vision_v1") || "AI 역량과 따뜻한 공감 능력으로 교육 격차를 해소하는 4차 산업 융합 디렉터가 되겠다!";
  });
  const [isEditingVision, setIsEditingVision] = useState(false);
  const [interestedJobs, setInterestedJobs] = useState<Array<{ name: string; image: string; category: string }>>([]);
  const [selectedJobIdx, setSelectedJobIdx] = useState(0);
  const [newJobInput, setNewJobInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const savedJobs = localStorage.getItem("my_interested_jobs");
    if (savedJobs) {
      try { setInterestedJobs(JSON.parse(savedJobs)); } catch (e) {}
    } else {
      setInterestedJobs([
        { name: "스마트 AI 에듀테크 진로 멘토", image: "👨‍🏫", category: "대표 관심 직업" },
        { name: "빅데이터 데이터 분석사", image: "📊", category: "AI·데이터" },
        { name: "디스플레이 및 웹 서비스 디자이너", image: "🎨", category: "디자인·IT" },
      ]);
    }
  }, []);

  const handleSaveVision = () => {
    localStorage.setItem("readycareer_vision_v1", visionStatement);
    setIsEditingVision(false);
  };

  const handleAiSuggestVision = async () => {
    setIsAiLoading(true);
    const currentTarget = interestedJobs[selectedJobIdx]?.name || "AI 융합 디렉터";
    try {
      const res = await executeAiPrompt({
        promptType: "vision_recommendation",
        targetJob: currentTarget,
      });
      if (res.content && res.provider !== "expo-demo-fallback") {
        const cleaned = res.content.replace(/^["']|["']$/g, "").trim();
        setVisionStatement(cleaned);
        localStorage.setItem("readycareer_vision_v1", cleaned);
        setIsEditingVision(false);
        setIsAiLoading(false);
        return;
      }
    } catch (e) {
      console.warn("AI 비전 통신 불완전, 로컬 추천 풀로 진행합니다.", e);
    }

    const suggestions = [
      "인공지능과 데이터 가공 기법으로 사회적 취약계층을 보호하는 정의로운 테크 혁신가!",
      "따뜻한 공감 능력으로 교실 속 아이들의 잠재력을 깨우는 최고의 맞춤형 에듀테크 리더!",
      "과학 기술 고전과 첨단 로봇 공학을 아우르는 상상력 충만한 글로벌 창업 총괄 디렉터!",
    ];
    const randomOne = suggestions[Math.floor(Math.random() * suggestions.length)];
    setVisionStatement(randomOne);
    localStorage.setItem("readycareer_vision_v1", randomOne);
    setIsEditingVision(false);
    setIsAiLoading(false);
  };

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobInput.trim()) return;
    const added = [{ name: newJobInput.trim(), image: "🌟", category: "직접 추가" }, ...interestedJobs];
    setInterestedJobs(added);
    setSelectedJobIdx(0);
    localStorage.setItem("my_interested_jobs", JSON.stringify(added));
    setNewJobInput("");
  };

  const currentJob = interestedJobs[selectedJobIdx] || { name: "AI 융합 개척자", image: "🤖", category: "탐색 중" };
  const userName = localStorage.getItem("readycareer_student_name") || (session?.name && session.name.trim() !== "" ? session.name : "신규 학생");
  const userSchool = localStorage.getItem("readycareer_student_school") || (session?.school && session.school.trim() !== "" ? session.school : "소속 학교 연동중");
  const userGrade = parseInt(localStorage.getItem("readycareer_student_grade")?.replace(/[^0-9]/g, "") || "") || session?.grade || 1;

  // 진단 완수 및 신규 유저 상태 실시간 반영 (미진단 표기 방지)
  const storedRiasec = localStorage.getItem("riasec_result_code") || localStorage.getItem("readycareer_interest_type");
  const displayRiasec = (storedRiasec && storedRiasec !== "미진단")
    ? storedRiasec
    : (session?.riasecCode && session.riasecCode !== "미진단" ? session.riasecCode : "SI");

  // 경험치 진행도 동적 계산 (신규 회원가입 후 진단 및 별자리 세팅 직후에는 실천 활동 전이므로 깨끗이 0% 0 XP로 시작)
  const isNewStudentClean = localStorage.getItem("is_new_student_clean_state") === "true";
  const allActivities = JSON.parse(localStorage.getItem("readycareer_student_activities_v1") || "[]");
  const practiceActivities = allActivities.filter((a: any) => !a.id?.startsWith("act-riasec-") && !a.id?.startsWith("act-star-"));
  const computedXP = isNewStudentClean ? (practiceActivities.length * 40) : Math.min(400, 240 + (practiceActivities.length * 40));
  const currentXP = Math.min(400, Math.max(0, computedXP));
  const maxXP = 400;
  const progressPercent = Math.round((currentXP / maxXP) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 space-y-10">
      
      {/* =========================================================================
          SECTION 1: Stitch Welcome Area
         ========================================================================= */}
      <div className="space-y-2 pl-2">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-xs font-headline font-black bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-current text-primary" />
            <span>★ 대표 꿈: {currentJob.name}</span>
          </span>
          <span className="text-xs font-black text-secondary bg-secondary/10 px-3.5 py-1 rounded-full border border-secondary/20 shadow-sm">
            RIASEC: {displayRiasec} 유형
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-headline font-extrabold text-on-surface tracking-tight">
          {userName}님, 안녕하세요! 🚀
        </h2>
        <p className="text-base font-body-md text-on-surface-variant">
          {userSchool} {userGrade}학년 · 오늘의 진로 로드맵을 힘차게 펼쳐보세요!
        </p>
      </div>

      {/* =========================================================================
          SECTION 2: Stitch Hero Card with Prominent 3D Mascot Ari & Progress
         ========================================================================= */}
      <section className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-[#8E70F7] to-[#6B45E4] shadow-[0px_8px_24px_rgba(123,92,240,0.15),0px_32px_64px_rgba(123,92,240,0.25)] text-white p-7 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 min-h-[220px] border border-white/20">
        
        <div className="space-y-6 z-10 w-full md:w-2/3">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full font-headline font-extrabold text-xs tracking-wider border border-white/30 shadow-inner">
            <span>{currentXP === 0 ? "🌱 Lv.01 진로 탐색의 싹 (0 XP 시작)" : "✨ Lv.03 커리어 탐색 개척자"}</span>
          </div>
          
          <div>
            <p className="text-[#cbbeff] text-xs font-headline uppercase tracking-wider mb-1 font-bold">
              나의 진로 여행 목표 (DREAM JOB)
            </p>
            <h3 className="text-3xl md:text-4xl font-headline font-black text-white tracking-tight leading-tight drop-shadow-sm">
              {currentJob.name}
            </h3>
          </div>

          {/* Vision Statement box inside Hero */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-headline font-bold text-[#e6deff]">
              <span>💡 맞춤 비전 선언문 (Vision Statement)</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAiSuggestVision}
                  disabled={isAiLoading}
                  className="px-2.5 py-1 rounded-lg bg-secondary text-white font-bold text-[11px] hover:brightness-110 transition-all flex items-center gap-1 shadow-sm disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isAiLoading ? "animate-spin" : ""}`} />
                  <span>AI 추천</span>
                </button>
                <button
                  onClick={() => setIsEditingVision(!isEditingVision)}
                  className="p-1 hover:text-white transition-colors"
                  title="직접 문구 수정"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            {isEditingVision ? (
              <div className="flex gap-2 mt-1">
                <input
                  type="text"
                  value={visionStatement}
                  onChange={(e) => setVisionStatement(e.target.value)}
                  className="flex-grow px-3 py-1.5 rounded-xl border border-white/40 bg-black/30 text-xs font-body-md text-white placeholder:text-white/60 focus:outline-none"
                />
                <button onClick={handleSaveVision} className="px-3 py-1 bg-white text-primary rounded-xl text-xs font-bold font-headline">
                  저장
                </button>
              </div>
            ) : (
              <p className="text-sm font-headline font-extrabold text-white italic leading-relaxed">
                "{visionStatement}"
              </p>
            )}
          </div>

          <div className="space-y-2 w-full max-w-md pt-1">
            <div className="flex justify-between text-xs font-bold text-[#e6deff]">
              <span>경험치 진행도 (XP Progress)</span>
              <span className="font-extrabold text-white">{currentXP} / {maxXP} XP ({progressPercent}%)</span>
            </div>
            <div className="h-3.5 w-full bg-black/25 rounded-full overflow-hidden shadow-inner p-0.5 border border-white/20">
              <div className="h-full bg-gradient-to-r from-[#7ef4fe] to-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.9)] transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>

        {/* PROMINENT VERCEL BLOB MASCOT ARI EXTRAS */}
        <div className="absolute -bottom-6 -right-4 md:-right-8 md:-bottom-8 w-52 h-52 md:w-80 md:h-80 z-0 transform translate-y-2 translate-x-2 md:translate-y-4 md:translate-x-4 drop-shadow-[0_25px_35px_rgba(0,0,0,0.45)] transition-transform duration-500 hover:scale-105 pointer-events-auto">
          <img
            src={ARI_BLOB_URL}
            alt="Ari the 3D Puppy Mascot"
            className="w-full h-full object-contain pointer-events-none select-none"
          />
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: Stitch Bento Grid Activities ("나의 활동" - 4 Cards Layout)
         ========================================================================= */}
      <div className="space-y-4">
        <div className="pt-2 pl-2 flex items-center justify-between">
          <h3 className="text-xl font-headline font-bold text-on-surface">나의 활동 (Core Navigation)</h3>
          <span className="text-xs font-headline font-medium text-on-surface-variant">원하는 탭을 클릭하여 활동을 시작하세요</span>
        </div>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          
          {/* Card 1: 별자리 로드맵 */}
          <Link to="/roadmap" className="block h-full">
            <div className="bg-surface rounded-[24px] p-6 shadow-[0px_4px_12px_rgba(123,92,240,0.05),0px_20px_40px_rgba(123,92,240,0.1)] hover:shadow-[0px_8px_24px_rgba(123,92,240,0.1),0px_32px_64px_rgba(123,92,240,0.15)] transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between h-full min-h-[160px] group border border-surface-variant/40 bg-[#ffffff]">
              <div className="w-12 h-12 rounded-full bg-[#7b5cf0] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Route className="w-6 h-6 text-white" />
              </div>
              <div className="mt-4">
                <h4 className="text-lg font-headline font-extrabold text-on-surface mb-1 group-hover:text-primary transition-colors">별자리 로드맵</h4>
                <p className="text-xs font-body-md text-on-surface-variant">2단계 진행 중 · 꿈 좌표 탐사</p>
              </div>
            </div>
          </Link>

          {/* Card 2: 습관 & 목표 */}
          <Link to="/habits" className="block h-full">
            <div className="bg-surface rounded-[24px] p-6 shadow-[0px_4px_12px_rgba(123,92,240,0.05),0px_20px_40px_rgba(123,92,240,0.1)] hover:shadow-[0px_8px_24px_rgba(123,92,240,0.1),0px_32px_64px_rgba(123,92,240,0.15)] transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between h-full min-h-[160px] group border border-surface-variant/40 bg-[#ffffff]">
              <div className="w-12 h-12 rounded-full bg-[#7af1fc] text-[#006970] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <ListCheck className="w-6 h-6 text-[#006970]" />
              </div>
              <div className="mt-4">
                <h4 className="text-lg font-headline font-extrabold text-on-surface mb-1 group-hover:text-secondary transition-colors">습관 &amp; 목표</h4>
                <p className="text-xs font-body-md text-on-surface-variant">7일차 연속 달성 스트릭</p>
              </div>
            </div>
          </Link>

          {/* Card 3: 진로 포트폴리오 */}
          <Link to="/portfolio" className="block h-full">
            <div className="bg-surface rounded-[24px] p-6 shadow-[0px_4px_12px_rgba(123,92,240,0.05),0px_20px_40px_rgba(123,92,240,0.1)] hover:shadow-[0px_8px_24px_rgba(123,92,240,0.1),0px_32px_64px_rgba(123,92,240,0.15)] transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between h-full min-h-[160px] group border border-surface-variant/40 bg-[#ffffff]">
              <div className="w-12 h-12 rounded-full bg-[#e4e1ee] text-[#1b1b24] flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <FolderCheck className="w-6 h-6 text-[#1b1b24]" />
              </div>
              <div className="mt-4">
                <h4 className="text-lg font-headline font-extrabold text-on-surface mb-1 group-hover:text-primary transition-colors">진로 포트폴리오</h4>
                <p className="text-xs font-body-md text-on-surface-variant">누적 보관함 &amp; AI 보고서</p>
              </div>
            </div>
          </Link>

          {/* Card 4: 신규 활동 기록 (Activity Form) */}
          <Link to="/activity-form" className="block h-full">
            <div className="bg-gradient-to-br from-[#f0ebff] to-white rounded-[24px] p-6 shadow-[0px_4px_12px_rgba(123,92,240,0.08),0px_20px_40px_rgba(123,92,240,0.15)] hover:shadow-[0px_8px_24px_rgba(123,92,240,0.15)] transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between h-full min-h-[160px] group border-2 border-primary/30">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Edit2 className="w-6 h-6 text-white" />
              </div>
              <div className="mt-4">
                <div className="inline-block px-2 py-0.5 bg-primary text-white text-[10px] font-black rounded mb-1">NEW +50 EXP</div>
                <h4 className="text-lg font-headline font-extrabold text-primary mb-1">➕ 활동 기록 작성</h4>
                <p className="text-xs font-body-md text-on-surface-variant">세특 글 작성 &amp; AI 자동 교정</p>
              </div>
            </div>
          </Link>

          {/* Card 5: 아리에게 묻기 (Full Width Span 2 Mobile, Span 4 Desktop) */}
          <Link to="/self-understanding" className="block col-span-2 md:col-span-4">
            <div className="bg-gradient-to-r from-[#efedf5] to-[#e9e7ef] rounded-[24px] p-6 shadow-[0px_4px_12px_rgba(123,92,240,0.05),0px_20px_40px_rgba(123,92,240,0.1)] hover:shadow-[0px_8px_24px_rgba(123,92,240,0.1),0px_32px_64px_rgba(123,92,240,0.15)] transition-all duration-300 cursor-pointer flex items-center justify-between border border-white/80">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden border-2 border-primary-container p-1 flex-shrink-0">
                  <img src={ARI_BLOB_URL} alt="Ari Icon" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h4 className="text-lg md:text-xl font-headline font-extrabold text-on-surface flex items-center gap-2">
                    <span>AI 자기이해 진단 및 아리 가이던스</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary text-white font-bold uppercase tracking-wider">NEW</span>
                  </h4>
                  <p className="text-xs md:text-sm font-body-md text-on-surface-variant mt-0.5">
                    6유형 RIASEC 진로 검사 결과를 확인하고 나만의 학부모·교사용 맞춤 조언 받기!
                  </p>
                </div>
              </div>
              <div className="bg-[#6240d5] text-white rounded-full w-12 h-12 flex items-center justify-center shadow-md hover:scale-105 transition-transform flex-shrink-0 ml-2">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
            </div>
          </Link>

        </section>
      </div>

      {/* =========================================================================
          SECTION 4: Interested Jobs Management (관심직업군 칩 & 카드)
         ========================================================================= */}
      <div className="bg-white rounded-[28px] p-7 md:p-8 shadow-[0px_4px_12px_rgba(123,92,240,0.05),0px_20px_40px_rgba(123,92,240,0.1)] border border-surface-variant/50 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-variant/40 pb-4">
          <div>
            <h3 className="text-lg md:text-xl font-headline font-extrabold text-on-surface flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-secondary" />
              <span>나의 관심 직업군 관리 (Career Target List)</span>
            </h3>
            <p className="text-xs text-on-surface-variant font-body-md mt-1">
              카드를 터치하면 실각적으로 상단의 대표 지망 직업(DREAM JOB)으로 변경됩니다! 새로운 직업도 자유롭게 추가해 보세요.
            </p>
          </div>

          {/* Add Job Form Bar */}
          <form onSubmit={handleAddJob} className="flex items-center gap-2 max-w-sm w-full">
            <input
              type="text"
              placeholder="예: 스포츠 전담 데이터 분석사..."
              value={newJobInput}
              onChange={(e) => setNewJobInput(e.target.value)}
              className="flex-grow h-12 text-xs md:text-sm px-4 rounded-[20px] bg-[#f7f5fd] border border-transparent focus:border-primary text-on-surface placeholder:text-text-muted/70 focus:outline-none focus:ring-2 focus:ring-primary/20 font-body-md transition-all shadow-inner"
            />
            <Button type="submit" variant="teal" size="sm" className="h-12 px-5 whitespace-nowrap font-headline font-bold rounded-full shadow-sm">
              <Plus className="w-4 h-4 mr-1" />
              추가
            </Button>
          </form>
        </div>

        {/* Interested Jobs List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {interestedJobs.map((job, idx) => {
            const isSelected = selectedJobIdx === idx;
            return (
              <div
                key={idx}
                onClick={() => setSelectedJobIdx(idx)}
                className={`p-5 rounded-[24px] border-2 cursor-pointer transition-all duration-200 flex items-center justify-between ${
                  isSelected
                    ? "bg-[#7af1fc]/20 border-[#006970] shadow-md scale-[1.02]"
                    : "bg-[#f4f2fa] border-surface-variant/40 hover:bg-[#efedf5] hover:border-primary/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2 rounded-2xl bg-white shadow-sm border border-surface-variant/30">{job.image}</span>
                  <div>
                    <strong className="text-sm font-headline font-extrabold text-on-surface block">
                      {job.name}
                    </strong>
                    <span className={`text-[11px] font-bold ${isSelected ? "text-[#006970]" : "text-text-muted"}`}>
                      {isSelected ? "★ 대표 직업 선택됨" : job.category}
                    </span>
                  </div>
                </div>
                {isSelected && <CheckCircle2 className="w-6 h-6 text-[#006970] flex-shrink-0 ml-2" />}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
export default HomeDashboard;
