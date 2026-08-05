import React, { useState, useEffect } from "react";
import { ARI_BLOB_URL } from "../assets/mascotData";
import type { RankLevel } from "../services/expService";
import { Sparkles, Award, ArrowRight, CheckCircle2, X } from "lucide-react";

interface ExpRewardEventDetail {
  addedXp: number;
  newXp: number;
  reason: string;
  oldRank: RankLevel;
  newRank: RankLevel;
  isLevelUp: boolean;
}

export const GlobalExpRewardModal: React.FC = () => {
  const [data, setData] = useState<ExpRewardEventDetail | null>(null);

  useEffect(() => {
    const handleEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ExpRewardEventDetail>;
      if (customEvent.detail) {
        setData(customEvent.detail);
        // 레벨업이 아닌 일반 EXP 획득의 경우 3.5초 뒤 자동 닫힘 (레벨업은 사용자가 확인할 수 있도록 유지)
        if (!customEvent.detail.isLevelUp) {
          setTimeout(() => {
            setData((prev) => (prev?.newXp === customEvent.detail.newXp ? null : prev));
          }, 3500);
        }
      }
    };

    window.addEventListener("readycareer_xp_reward", handleEvent);
    return () => window.removeEventListener("readycareer_xp_reward", handleEvent);
  }, []);

  if (!data) return null;

  const characterImage = localStorage.getItem("readycareer_custom_avatar_url") || ARI_BLOB_URL;
  const jobTitle = localStorage.getItem("readycareer_target_job_name") || "AI 융합 개척자";

  return (
    <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn" onClick={() => setData(null)}>
      <div 
        className="bg-white w-full max-w-lg rounded-[36px] p-8 sm:p-10 shadow-[0_30px_90px_rgba(0,0,0,0.5)] border border-slate-200 text-center relative space-y-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={() => setData(null)} 
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {data.isLevelUp ? (
          <>
            {/* 레벨업 및 직업 성장 축합 화면 */}
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#6A42ED] to-[#916EFF] text-white font-extrabold text-xs tracking-wide shadow-md">
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
                <span>🎉 LEVEL UP & CAREER EVOLUTION!</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#1F193B] tracking-tight leading-tight">
                축하합니다! <br />
                <span className="text-[#6A42ED] font-black">{data.newRank.lvTitle} {data.newRank.title}</span><br />
                <span className="text-xl sm:text-2xl text-slate-800 font-black">클래스로 승급했습니다!</span>
              </h2>
            </div>

            <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-tr from-purple-100 via-violet-50 to-indigo-50 p-4 border-4 border-purple-200 shadow-xl flex items-center justify-center relative my-4">
              <span className="absolute -top-3 right-0 bg-white text-2xl p-2 rounded-2xl shadow border border-purple-100 animate-bounce">
                👑
              </span>
              <img src={characterImage} alt="Level Up Character" className="w-full h-full object-contain filter drop-shadow-md animate-float" />
            </div>

            <div className="bg-[#F8F5FF] p-5 rounded-3xl border border-purple-100 text-left space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>달성 활동: {data.reason}</span>
                <span className="font-extrabold text-[#6A42ED] bg-purple-100/80 px-2.5 py-0.5 rounded-full border border-purple-200/60">+{data.addedXp} EXP</span>
              </div>
              <div className="flex items-center justify-center gap-3 py-1 text-sm font-black text-slate-800">
                <span className="text-slate-400 line-through">{data.oldRank.badge}</span>
                <ArrowRight className="w-4 h-4 text-[#6A42ED] stroke-[3]" />
                <span className="text-[#6A42ED] text-base font-black">{data.newRank.badge}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 font-bold">
              ⚡ 현재 선택 직업 <strong className="text-[#6A42ED]">[{jobTitle}]</strong> 마스코트와 함께 다음 레벨업을 향한 도전!
            </p>

            <button
              onClick={() => setData(null)}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#6A42ED] to-[#8A64FF] hover:brightness-105 text-white font-black text-base shadow-[0_8px_25px_rgba(106,66,237,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Award className="w-5 h-5 text-amber-300" />
              <span>✨ 승급 확인 및 퀘스트 이어가기</span>
            </button>
          </>
        ) : (
          <>
            {/* 일반 EXP 획득 팝업 */}
            <div className="space-y-3 pt-2">
              <div className="w-20 h-20 mx-auto rounded-full bg-purple-50 p-3 border-2 border-purple-200 flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-10 h-10 text-[#6A42ED]" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#6A42ED] to-[#8A64FF] text-white font-extrabold text-xs shadow-md">
                • ACTIVITY COMPLETED
              </span>
              <h3 className="text-2xl font-black text-[#1F193B]">
                +{data.addedXp} EXP 획득!
              </h3>
              <p className="text-sm font-bold text-slate-700 bg-[#F8F5FF] p-3.5 rounded-2xl border border-purple-100">
                🎯 {data.reason} <br/>
                <span className="text-xs text-[#6A42ED] font-black mt-1 block">
                  현재 누적 경험치: {data.newXp} / 500 XP
                </span>
              </p>
            </div>

            <button
              onClick={() => setData(null)}
              className="w-full py-3.5 rounded-2xl bg-[#6A42ED] hover:bg-[#5734CA] text-white font-bold text-sm shadow-[0_6px_20px_rgba(106,66,237,0.3)] transition-all"
            >
              확인
            </button>
          </>
        )}
      </div>
    </div>
  );
};
