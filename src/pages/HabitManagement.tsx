import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, MascotAri } from "../components";
import { Sparkles, Flame, CheckCircle2, Plus, Calendar, FileText } from "lucide-react";

interface Habit {
  id: string;
  title: string;
  targetDays: number;
  completedDays: number[];
  category: string;
}

export const HabitManagement: React.FC = () => {
  const navigate = useNavigate();
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem("my_habits_v2");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: "h-1", title: "매일 AI 알고리즘 문제 1개 실습 · 50일 챌린지", targetDays: 50, completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], category: "코딩·AI" },
      { id: "h-2", title: "최신 STEM 저널 및 경제 뉴스 15분 정독", targetDays: 30, completedDays: [1, 2, 3, 4, 5], category: "독서·탐구" },
    ];
  });

  const [selectedHabitId, setSelectedHabitId] = useState<string>("h-1");
  const [newTitle, setNewTitle] = useState("");
  const [todayQuests, setTodayQuests] = useState([
    { id: "q1", title: "전공 서적 30분 읽기", desc: "매일 꾸준한 지식 쌓기 및 진로 역량 강화", icon: "📚", exp: "+50 EXP", completed: true },
    { id: "q2", title: "최신 진로 산업 뉴스 1건 스크랩", desc: "AI 인프라 및 전공 관련 트렌드 파악하기", icon: "📰", exp: "+40 EXP", completed: false },
    { id: "q3", title: "아리에게 진로 고민 1회 실시간 질문하기", desc: "AI 상담을 통한 세특 가이드 아이디어 탐색", icon: "🤖", exp: "+70 EXP", completed: false },
  ]);
  const [flippedQuestId, setFlippedQuestId] = useState<string | null>(null);

  const toggleQuest = (id: string) => {
    setTodayQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, completed: !q.completed } : q))
    );
  };

  const activeHabit = habits.find((h) => h.id === selectedHabitId) || habits[0];

  const handleToggleDay = (dayNo: number) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== activeHabit.id) return h;
        const exists = h.completedDays.includes(dayNo);
        const nextDays = exists
          ? h.completedDays.filter((d) => d !== dayNo)
          : [...h.completedDays, dayNo].sort((a, b) => a - b);
        const updated = { ...h, completedDays: nextDays };
        localStorage.setItem("my_habits_v2", JSON.stringify(habits));
        return updated;
      })
    );
  };

  const handleAiRecommendHabits = () => {
    const aiSuggestions: Habit = {
      id: `h-${Date.now()}`,
      title: "🔥 [AI 추천] 매주 진로 도서 1권 읽고 3줄 세특 메모 남기기 · 50일",
      targetDays: 50,
      completedDays: [1],
      category: "AI 아리 추천",
    };
    setHabits((prev) => [aiSuggestions, ...prev]);
    setSelectedHabitId(aiSuggestions.id);
    localStorage.setItem("my_habits_v2", JSON.stringify([aiSuggestions, ...habits]));
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const item: Habit = {
      id: `h-${Date.now()}`,
      title: `${newTitle} · 50일 챌린지`,
      targetDays: 50,
      completedDays: [],
      category: "자율 목표",
    };
    setHabits((prev) => [item, ...prev]);
    setSelectedHabitId(item.id);
    setNewTitle("");
    localStorage.setItem("my_habits_v2", JSON.stringify([item, ...habits]));
  };

  const successRate = Math.round((activeHabit.completedDays.length / activeHabit.targetDays) * 100);
  const currentStreak = activeHabit.completedDays.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-surface-variant/40 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-secondary/15 text-secondary px-3 py-1 rounded-full text-xs font-headline font-black mb-3">
            <Flame className="w-4 h-4 text-secondary-spot animate-bounce" />
            <span>50-Day Career Challenge &amp; Routine Tracker</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-black text-text-primary tracking-tight">
            습관 &amp; <span className="text-transparent bg-clip-text gradient-hero-card">목표 관리</span>
          </h1>
          <p className="text-sm text-text-muted mt-2 font-body-md max-w-2xl leading-relaxed">
            매일 작은 루틴을 달성하며 1~50일 그리드를 채워나가세요! 연속 성공 수치가 오를 때마다 진로 퀘스트 EXP가 누적되어 상위 캐릭터 외형을 해금합니다.
          </p>
        </div>

        {/* AI Recommend Action */}
        <div className="flex items-center gap-2">
          <Button
            variant="teal"
            size="lg"
            onClick={handleAiRecommendHabits}
            icon={<Sparkles className="w-5 h-5 animate-pulse" />}
            className="font-headline font-extrabold shadow-md whitespace-nowrap"
          >
            🤖 아리와 함께 진로 관련 습관 즉시 설계
          </Button>
        </div>
      </div>

      {/* Stitch 3D Today's Quests Interactive Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-[#7B5CF0] uppercase tracking-widest block">AI QUEST LOG &middot; CUSTOM UI</span>
            <h2 className="text-2xl font-extrabold text-[#1A1626] tracking-tight flex items-center gap-2">
              <span>🚀 오늘의 맞춤 진로 퀘스트</span>
            </h2>
          </div>
          <span className="text-xs font-bold bg-[#e6deff] text-[#6240d5] px-3.5 py-1 rounded-full border border-[#cbbeff] whitespace-nowrap">
            완료 시 캐릭터 오오라 EXP 부여 ✨
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {todayQuests.map((q) => (
            <div
              key={q.id}
              onClick={() => setFlippedQuestId(flippedQuestId === q.id ? null : q.id)}
              className="bg-white rounded-[28px] p-6 border border-[#E3E1E9] shadow-[0_15px_35px_rgba(123,92,240,0.08)] hover:shadow-[0_25px_50px_rgba(123,92,240,0.16)] hover:border-[#7B5CF0]/50 transition-all duration-300 cursor-pointer flex flex-col justify-between group min-h-[170px] relative overflow-hidden"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-[#f4f2fa] border border-[#cac4d7]/50 flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
                    {q.icon}
                  </div>
                  <span className="text-xs font-black bg-[#7af1fc]/30 text-[#006970] px-3 py-1 rounded-full border border-[#006970]/20">
                    {q.exp}
                  </span>
                </div>
                <div>
                  <h3 className={`text-lg font-extrabold transition-colors ${q.completed ? "text-[#7B5CF0] line-through" : "text-[#1A1626] group-hover:text-[#7B5CF0]"}`}>
                    {q.title}
                  </h3>
                  <p className="text-xs text-[#6E6A80] font-normal leading-relaxed mt-0.5">{q.desc}</p>
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-[#E3E1E9]/80 flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleQuest(q.id);
                  }}
                  className={`px-4 py-2 rounded-full text-xs font-black flex items-center gap-1.5 transition-all ${
                    q.completed
                      ? "bg-[#006970] text-white shadow-md"
                      : "bg-[#f4f2fa] text-[#484554] hover:bg-[#7B5CF0] hover:text-white"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{q.completed ? "퀘스트 달성 완수!" : "클릭하여 완료하기"}</span>
                </button>
                <span className="text-[11px] font-semibold text-[#7B5CF0] whitespace-nowrap">
                  {flippedQuestId === q.id ? "▲ 닫기" : "▼ 상세 가이드 보기"}
                </span>
              </div>

              {flippedQuestId === q.id && (
                <div className="mt-4 p-4 rounded-2xl bg-[#efedf5] border border-[#cac4d7]/60 text-xs text-[#1A1626] space-y-1.5 animate-fadeIn">
                  <p className="font-extrabold text-[#6240d5]">💡 AI 역량 성장 연계 정보</p>
                  <p className="text-text-muted leading-snug">이 퀘스트를 달성하면 생활기록부 '자기주도 학업역량' 및 '진로 탐색 태도' 평가 항목에 시도 포인트가 누적 기록됩니다!</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Main Grid Work area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: Habit Selector List & New Form */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-lg font-headline font-black text-text-primary flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span>진행 중인 내 챌린지 목록</span>
          </h3>

          <div className="space-y-3">
            {habits.map((h) => {
              const isSelected = h.id === activeHabit.id;
              const percent = Math.round((h.completedDays.length / h.targetDays) * 100);
              return (
                <div
                  key={h.id}
                  onClick={() => setSelectedHabitId(h.id)}
                  className={`p-4 rounded-3xl border-2 cursor-pointer transition-all duration-200 shadow-sm space-y-2.5 ${
                    isSelected
                      ? "bg-primary/10 border-primary shadow-md scale-[1.02]"
                      : "bg-surface-container-low border-surface-variant/50 hover:bg-surface-container hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-headline font-black bg-surface-container-high text-text-muted px-2 py-0.5 rounded-full">
                      #{h.category}
                    </span>
                    <span className="text-xs font-black text-primary">{h.completedDays.length} / {h.targetDays}일</span>
                  </div>
                  <strong className="text-sm md:text-base font-headline font-black text-text-primary block leading-snug">
                    {h.title}
                  </strong>
                  <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-secondary h-1.5 rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* New Habit Form */}
          <Card variant="surface" padding="md" className="border border-surface-variant/60 shadow-inner space-y-3">
            <span className="text-xs font-headline font-extrabold text-text-primary block">
              + 새 50일 챌린지 목표 생성하기
            </span>
            <form onSubmit={handleCreateHabit} className="flex gap-2">
              <input
                type="text"
                placeholder="예: 매일 영어 VOA 5분 듣기"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="flex-1 px-3 py-2 bg-surface-container-lowest border border-surface-variant/60 rounded-2xl text-xs focus:ring-2 focus:ring-primary font-bold shadow-inner"
              />
              <Button variant="secondary" size="sm" type="submit" icon={<Plus className="w-4 h-4" />} className="font-extrabold">
                추가
              </Button>
            </form>
          </Card>
        </div>

        {/* RIGHT: 1~50 Day Interactive Check Grid (§7.6 명세 100% 실무 체결) */}
        <Card variant="hero" padding="lg" className="lg:col-span-8 shadow-3d-ambient bg-gradient-to-t from-surface-container-lowest to-surface border border-surface-variant/50 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-variant/30 pb-4">
            <div>
              <span className="text-xs font-headline font-black text-secondary uppercase tracking-wider block mb-1">
                📅 50-Day Grid Checker
              </span>
              <h2 className="text-2xl font-headline font-black text-text-primary leading-tight">
                {activeHabit.title}
              </h2>
            </div>
            <div className="bg-secondary/10 px-4 py-2 rounded-2xl border border-secondary/30 flex items-center gap-2 self-start sm:self-auto shadow-sm">
              <Flame className="w-5 h-5 text-secondary-spot animate-bounce" />
              <span className="text-sm font-headline font-black text-secondary">
                현재 <strong>{currentStreak}일차</strong> 챌린지 성공! ({successRate}%)
              </span>
            </div>
          </div>

          {/* Grid interactive cells (1 to 50) */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2.5 pt-2">
            {Array.from({ length: activeHabit.targetDays }, (_, i) => i + 1).map((dayNo) => {
              const isCompleted = activeHabit.completedDays.includes(dayNo);

              return (
                <button
                  key={dayNo}
                  onClick={() => handleToggleDay(dayNo)}
                  className={`h-14 rounded-2xl font-headline font-black text-xs md:text-sm flex flex-col items-center justify-center transition-all duration-150 select-none shadow-sm ${
                    isCompleted
                      ? "bg-gradient-to-br from-primary to-secondary text-white shadow-3d-base scale-105"
                      : "bg-surface-container hover:bg-surface-container-high text-text-muted hover:text-text-primary border border-surface-variant/40"
                  }`}
                  title={`${dayNo}일차 출석 체크 전환`}
                >
                  <span className="text-[10px] opacity-80">Day</span>
                  <span>{dayNo}</span>
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 mt-0.5" />}
                </button>
              );
            })}
          </div>

          {/* Mascot praise & advice */}
          <div className="p-5 rounded-3xl bg-surface-container-low border border-surface-variant/40 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <MascotAri pose="celebrate" size="sm" rotate={false} />
              <div className="space-y-1">
                <strong className="text-sm font-headline font-extrabold text-text-primary block">
                  🎉 아리(Ari)의 힘이 되는 칭찬 코멘트
                </strong>
                <p className="text-xs text-text-muted leading-relaxed font-body-md">
                  "{activeHabit.title}" 도전을 하루도 빠짐없이 훌륭하게 수행하고 계시군요! 하루 1개의 체크가 쌓일 때마다 학교관리자(교사) 뷰에서 학생 역량 지수가 상승하여 차질없는 세특 자산이 됩니다.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="primary" size="sm" onClick={() => navigate("/activity-form")} className="font-extrabold text-xs whitespace-nowrap shadow-sm">
                <FileText className="w-3.5 h-3.5 mr-1 inline" /> ✏️ 실천 활동 기록하기 &rarr;
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/portfolio")} className="font-extrabold text-xs whitespace-nowrap bg-white shadow-sm">
                포트폴리오 보관함
              </Button>
            </div>
          </div>
        </Card>

      </div>

    </div>
  );
};

export default HabitManagement;
