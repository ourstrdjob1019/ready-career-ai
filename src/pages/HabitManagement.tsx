import React, { useState } from "react";
import { Button, Card, Chip, ProgressBar, MascotAri } from "../components";
import { CheckSquare, Plus, Calendar, Flame, Trash2 } from "lucide-react";

interface Habit {
  id: number;
  title: string;
  category: string;
  completed: boolean;
  streak: number;
}

export const HabitManagement: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([
    { id: 1, title: "매일 아침 IT/테크 기사 1건 스크랩 및 요약", category: "학습 습관", completed: true, streak: 12 },
    { id: 2, title: "파이썬 백준 코딩테스트 기초 문제 2개 풀기", category: "전공 역량", completed: true, streak: 7 },
    { id: 3, title: "영어 TED 테크놀로지 대담 15분 청취", category: "언어/글로벌", completed: false, streak: 4 },
    { id: 4, title: "주간 진로 탐색 일자 및 세특 메모 정리", category: "진로 진도", completed: false, streak: 2 },
  ]);

  const [newTitle, setNewTitle] = useState("");
  const [selectedCat, setSelectedCat] = useState("학습 습관");
  
  const categories = ["학습 습관", "전공 역량", "언어/글로벌", "진로 진도", "기기타 생활"];

  const toggleHabit = (id: number) => {
    setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed, streak: !h.completed ? h.streak + 1 : Math.max(1, h.streak - 1) } : h));
  };

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setHabits([
      ...habits,
      { id: Date.now(), title: newTitle, category: selectedCat, completed: false, streak: 1 }
    ]);
    setNewTitle("");
  };

  const deleteHabit = (id: number) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const completedCount = habits.filter(h => h.completed).length;
  const totalCount = habits.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-8">
      {/* Header & Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        <Card variant="hero" padding="md" className="md:col-span-2 flex flex-col justify-between shadow-3d-ambient">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-headline font-bold mb-3">
              <Calendar className="w-3.5 h-3.5 text-secondary-container" />
              <span>오늘의 데일리 습관 체크인</span>
            </div>
            <h1 className="text-headline-lg font-extrabold text-white font-headline">
              작은 성취, 커리어의 기적
            </h1>
            <p className="text-white/85 text-sm mt-1">
              꾸준한 기록이야말로 학생부 종합전형 및 미래 역량 평가에서 가장 설득력 있는 무기입니다!
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/20 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-white/80 font-bold">오늘 달성률</span>
              <span className="text-2xl font-headline font-black text-secondary-container">{completedCount} / {totalCount} 완료</span>
            </div>
            <div className="w-1/2">
              <ProgressBar value={completedCount} max={totalCount || 1} variant="teal" />
            </div>
          </div>
        </Card>

        {/* Streak & Ari Card */}
        <Card variant="activity" padding="md" className="flex flex-col items-center justify-center text-center gap-3 bg-surface-container-low shadow-3d-base">
          <div className="flex items-center gap-1 text-secondary font-headline font-black text-xl">
            <Flame className="w-7 h-7 text-secondary fill-secondary animate-bounce" />
            <span>최장 연속 12일째!</span>
          </div>
          <p className="text-xs text-text-muted font-body-md">
            대단해요! 하루만 더 달성하면 '성실의 은비늘' 배지와 추가 STAR 포인트를 획득합니다.
          </p>
          <MascotAri pose="sticker" size="sm" />
        </Card>
      </div>

      {/* Add New Habit Quick Form */}
      <Card variant="surface" padding="md" className="bg-surface-container shadow-sm border border-surface-variant/40">
        <form onSubmit={addHabit} className="flex flex-col gap-4">
          <h3 className="font-headline font-bold text-text-primary text-base flex items-center gap-1.5">
            <Plus className="w-5 h-5 text-primary" />
            새로운 습관 목표 추가
          </h3>
          
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="예: 매일 저녁 진로 독서 20분"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-grow h-12 rounded-full px-5 bg-surface-container-lowest border border-surface-variant/40 text-text-primary font-body-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button type="submit" variant="primary" size="sm" className="px-6 h-12 text-sm font-bold">
              추가하기
            </Button>
          </div>

          <div className="flex overflow-x-auto gap-2 no-scrollbar">
            {categories.map((cat) => (
              <Chip
                key={cat}
                size="sm"
                type="button"
                active={selectedCat === cat}
                onClick={() => setSelectedCat(cat)}
              >
                #{cat}
              </Chip>
            ))}
          </div>
        </form>
      </Card>

      {/* Habits List */}
      <div className="flex flex-col gap-3">
        <h2 className="font-headline font-extrabold text-title-md text-text-primary mb-1">
          📋 오늘의 루틴 리스트
        </h2>

        {habits.map((h) => (
          <div
            key={h.id}
            onClick={() => toggleHabit(h.id)}
            className={`p-5 rounded-3xl border transition-all duration-200 cursor-pointer flex items-center justify-between select-none ${
              h.completed
                ? "bg-surface-container-low border-primary/25 shadow-sm text-text-primary/70"
                : "bg-white border-surface-variant/40 shadow-3d-base hover:border-primary/50"
            }`}
          >
            <div className="flex items-center gap-4">
              <button
                type="button"
                className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                  h.completed ? "bg-primary text-on-primary shadow-sm" : "border-2 border-text-muted/40 text-transparent"
                }`}
              >
                {h.completed && <CheckSquare className="w-5 h-5" />}
              </button>
              
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-secondary px-2 py-0.5 rounded-full bg-secondary/10">
                    {h.category}
                  </span>
                  {h.streak > 5 && (
                    <span className="text-[11px] font-black text-primary flex items-center gap-0.5">
                      <Flame className="w-3 h-3 fill-primary" /> {h.streak}일 연속
                    </span>
                  )}
                </div>
                <span className={`text-base font-headline font-bold mt-1 ${h.completed ? "line-through text-text-muted" : "text-text-primary"}`}>
                  {h.title}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                deleteHabit(h.id);
              }}
              className="p-2 text-text-muted hover:text-error hover:bg-error-container/30 rounded-full transition-colors"
              title="삭제"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
