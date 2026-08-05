export interface RankLevel {
  levelNum: number;
  lvTitle: string;
  title: string;
  badge: string;
  glow: string;
  textColor: string;
  border: string;
}

export const getRankFromXP = (xp: number): RankLevel => {
  if (xp >= 400) {
    return {
      levelNum: 5,
      lvTitle: "Lv.5",
      title: "👑 최상위 마스터 랭크",
      badge: "[ 👑 Lv.5 마스터 ]",
      glow: "from-emerald-500 to-purple-600",
      textColor: "text-emerald-500 font-black",
      border: "border-emerald-400"
    };
  } else if (xp >= 300) {
    return {
      levelNum: 4,
      lvTitle: "Lv.4",
      title: "💎 다이아 엑스퍼트",
      badge: "[ 💎 Lv.4 다이아 ]",
      glow: "from-cyan-500 to-blue-600",
      textColor: "text-cyan-600",
      border: "border-cyan-400"
    };
  } else if (xp >= 200) {
    return {
      levelNum: 3,
      lvTitle: "Lv.3",
      title: "🥇 골드 프로젝트 리더",
      badge: "[ 🥇 Lv.3 골드 ]",
      glow: "from-amber-400 to-amber-600",
      textColor: "text-amber-600",
      border: "border-amber-400"
    };
  } else if (xp >= 100) {
    return {
      levelNum: 2,
      lvTitle: "Lv.2",
      title: "🥈 실버 지식 융합러",
      badge: "[ 🥈 Lv.2 실버 ]",
      glow: "from-slate-400 to-slate-600",
      textColor: "text-slate-600",
      border: "border-slate-400"
    };
  }
  return {
    levelNum: 1,
    lvTitle: "Lv.1",
    title: "🥉 브론즈 탐구어",
    badge: "[ 🥉 Lv.1 브론즈 ]",
    glow: "from-amber-600 to-amber-800",
    textColor: "text-amber-700",
    border: "border-amber-400"
  };
};

export const getCurrentXP = (): number => {
  const stored = localStorage.getItem("readycareer_student_xp_v1");
  if (stored !== null) {
    const parsed = parseInt(stored, 10);
    return isNaN(parsed) ? 0 : Math.min(500, Math.max(0, parsed));
  }
  // 기본 초기 경험치 (기존 활동 기반 계산 백업)
  const allActivities = JSON.parse(localStorage.getItem("readycareer_student_activities_v1") || "[]");
  const practiceActivities = allActivities.filter((a: any) => !a.id?.startsWith("act-riasec-") && !a.id?.startsWith("act-star-"));
  const isNewStudentClean = localStorage.getItem("is_new_student_clean_state") === "true";
  const initialXP = isNewStudentClean ? (practiceActivities.length * 60) : Math.min(500, (practiceActivities.length * 60));
  localStorage.setItem("readycareer_student_xp_v1", String(initialXP));
  return initialXP;
};

export const rewardXP = (amount: number, reason: string) => {
  const oldXp = getCurrentXP();
  const oldRank = getRankFromXP(oldXp);

  const newXp = Math.min(500, oldXp + amount);
  localStorage.setItem("readycareer_student_xp_v1", String(newXp));
  const newRank = getRankFromXP(newXp);

  const eventDetail = {
    addedXp: amount,
    newXp,
    reason,
    oldRank,
    newRank,
    isLevelUp: newRank.levelNum > oldRank.levelNum
  };

  window.dispatchEvent(new CustomEvent("readycareer_xp_reward", { detail: eventDetail }));
};
