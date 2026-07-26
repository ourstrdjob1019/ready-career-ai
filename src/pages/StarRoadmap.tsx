import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Card, MascotAri } from "../components";
import { useAuth } from "../context";
import { executeAiPrompt } from "../services/aiService";
import { Sparkles, Star, CheckCircle2, Play, RefreshCw, Layers, Zap } from "lucide-react";

interface QuestItem {
  id: string;
  title: string;
  expReward: number;
  status: "locked" | "active" | "done";
}

interface ConstellationNode {
  id: string;
  label: string;
  desc?: string;
  x: number; // 15 to 85 (%)
  y: number; // 15 to 85 (%)
  quests: QuestItem[];
}

interface ConstellationEdge {
  from: string;
  to: string;
}

interface ConstellationData {
  constellationName: string;
  nodes: ConstellationNode[];
  edges: ConstellationEdge[];
}

export const StarRoadmap: React.FC = () => {
  const { session } = useAuth();
  const [viewMode, setViewMode] = useState<"canvas" | "list">("canvas");
  const [loading, setLoading] = useState(true);
  const [constellation, setConstellation] = useState<ConstellationData | null>(null);
  const [selectedNode, setSelectedNode] = useState<ConstellationNode | null>(null);
  const [totalExp, setTotalExp] = useState(450);
  const [completedQuestsCount, setCompletedQuestsCount] = useState(2);
  const [toastMsg, setToastMsg] = useState("");

  // 실제 학생의 자기이해 및 꿈 데이터 감지
  const dreamJob = (session as any)?.targetJob || localStorage.getItem("readycareer_target_job") || "AI 로봇 융합 연구원";
  const riasec = session?.riasecCode || localStorage.getItem("readycareer_interest_type") || "RI";

  useEffect(() => {
    fetchConstellationFromAi();
  }, [dreamJob, riasec]);

  const fetchConstellationFromAi = async () => {
    setLoading(true);
    try {
      const res = await executeAiPrompt({
        promptType: "generate_constellation",
        targetJob: dreamJob,
        riasecCode: riasec,
      });

      if (res && res.json && res.json.nodes) {
        setConstellation(res.json);
        setSelectedNode(res.json.nodes[0] || null);
      } else {
        // 안전 폴백 구조 생성 (별자리 고유 매핑)
        const defaultData: ConstellationData = {
          constellationName: `[${riasec} 유형 맞춤] ${dreamJob}의 반짝이는 북극성 궤적`,
          nodes: [
            {
              id: "star-1",
              label: "1단계 • 인공지능 기초 알고리즘 이해",
              desc: "프로그래밍 논리 체계와 기초 공학 도서를 독보하며 진로 기틀을 쌓는 첫 별입니다.",
              x: 20,
              y: 75,
              quests: [
                { id: "q1", title: "AI 기본 문헌 3권 정독 및 독후 일지", expReward: 50, status: "done" },
                { id: "q2", title: "파이썬 및 기초 코드 5문제 완수", expReward: 50, status: "active" },
              ],
            },
            {
              id: "star-2",
              label: "2단계 • 자율주행·로보틱스 융합 탐구",
              desc: "하드웨어 센서와 SW 엔진이 어떻게 교감하는지 실험 리포트로 증명합니다.",
              x: 35,
              y: 48,
              quests: [
                { id: "q3", title: "교내 과학탐구 '로보틱스와 환경' 토론 참여", expReward: 80, status: "active" },
                { id: "q4", title: "센서 조작 실험 영상 첨부", expReward: 70, status: "locked" },
              ],
            },
            {
              id: "star-3",
              label: "3단계 • 공공 데이터 활용 및 통계 시뮬레이션",
              desc: "공공 빅데이터를 수집하여 미래 산업 예측 모델을 작성합니다.",
              x: 55,
              y: 30,
              quests: [
                { id: "q5", title: "공공 데이터 포털 API 활용 분석표 구축", expReward: 100, status: "locked" },
              ],
            },
            {
              id: "star-4",
              label: "4단계 • 고등 과학기술 전공 연계 프로젝트",
              desc: "대학 및 기업 오픈소스 자원과 교과 발달 사항을 하나로 융합합니다.",
              x: 75,
              y: 45,
              quests: [
                { id: "q6", title: "전공 학술지 논문 서류 감평문 2 건", expReward: 100, status: "locked" },
              ],
            },
            {
              id: "star-5",
              label: "5단계 • 최종 캡스톤 진로 포트폴리오 헌정",
              desc: "별들의 힘을 결집하여 교육부 2026 기재요령에 완결시킬 나만의 대장정입니다.",
              x: 82,
              y: 72,
              quests: [
                { id: "q7", title: "최종 진로 융합 3D 보고서 NEIS 제출 완결", expReward: 200, status: "locked" },
              ],
            },
          ],
          edges: [
            { from: "star-1", to: "star-2" },
            { from: "star-2", to: "star-3" },
            { from: "star-3", to: "star-4" },
            { from: "star-4", to: "star-5" },
          ],
        };
        setConstellation(defaultData);
        setSelectedNode(defaultData.nodes[0]);
      }
    } catch (err) {
      console.error("Constellation generator err:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteQuest = (nodeId: string, questId: string, reward: number) => {
    if (!constellation) return;
    
    const updatedNodes = constellation.nodes.map((n) => {
      if (n.id === nodeId) {
        const updatedQuests = n.quests.map((q) => {
          if (q.id === questId) {
            return { ...q, status: "done" as const };
          }
          return q;
        });
        return { ...n, quests: updatedQuests };
      }
      return n;
    });

    setConstellation({ ...constellation, nodes: updatedNodes });
    setTotalExp((prev) => prev + reward);
    setCompletedQuestsCount((prev) => prev + 1);

    const current = updatedNodes.find((x) => x.id === nodeId) || null;
    setSelectedNode(current);

    setToastMsg(`🌟 축하합니다! 한입 퀘스트 완수로 EXP +${reward} 획득 및 뱃지 오오라가 상승했습니다!`);
    setTimeout(() => setToastMsg(""), 4000);
  };

  const renderSvgEdges = () => {
    if (!constellation) return null;
    return constellation.edges.map((edge, idx) => {
      const fromNode = constellation.nodes.find((n) => n.id === edge.from);
      const toNode = constellation.nodes.find((n) => n.id === edge.to);
      if (!fromNode || !toNode) return null;

      return (
        <line
          key={`edge-${idx}`}
          x1={`${fromNode.x}%`}
          y1={`${fromNode.y}%`}
          x2={`${toNode.x}%`}
          y2={`${toNode.y}%`}
          stroke="rgba(123, 92, 240, 0.7)"
          strokeWidth="3"
          strokeDasharray="6 4"
          className="animate-pulse"
        />
      );
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-8 animate-fade-in pb-20">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-[#7B5CF0] text-white font-headline font-black px-6 py-4 rounded-3xl shadow-3d-ambient flex items-center gap-3 border border-white/30 animate-bounce">
          <Sparkles className="w-6 h-6 text-yellow-300 animate-spin" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-[#E3E1E9]">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#7B5CF0]/10 text-[#7B5CF0] px-4 py-1.5 rounded-full text-xs font-headline font-black mb-3 border border-[#7B5CF0]/20">
            <Sparkles className="w-4 h-4" />
            <span>AI 맞춤 커리어 별자리 로드맵</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#1A1626] font-headline tracking-tight">
            밤하늘 진로 별자리
          </h1>
          <p className="text-sm text-[#5B556D] max-w-2xl mt-2 leading-relaxed">
            학생의 <strong>[{dreamJob}]</strong> 꿈과 <strong>[{riasec}]</strong> 진단 성향에 맞춰 AI가 밤하늘에 별을 띄웠습니다.<br />
            반짝이는 별(노드)을 터치하고 <strong>한입 퀘스트</strong>를 실천해 EXP를 모아보세요!
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-[32px] border border-[#E3E1E9] shadow-[0_15px_30px_rgba(123,92,240,0.06)] flex-shrink-0">
          <MascotAri pose="roadmap" size="sm" rotate={false} />
          <div className="flex flex-col">
            <span className="text-[11px] text-[#7B5CF0] font-extrabold uppercase tracking-wide">누적 진로 별빛 포인트</span>
            <span className="text-2xl font-headline font-black text-[#1A1626]">
              {totalExp} <small className="text-xs text-[#5B556D] font-bold">EXP (Lv.2)</small>
            </span>
            <span className="text-[10px] text-teal-600 font-bold">🎯 한입 퀘스트 {completedQuestsCount}개 실천 성공</span>
          </div>
        </div>
      </div>

      {/* View Mode & Ai Refresh Control */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-[32px] border border-[#E3E1E9] shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("canvas")}
            className={`px-5 py-2.5 rounded-2xl font-headline font-bold text-xs flex items-center gap-2 transition-all ${
              viewMode === "canvas"
                ? "bg-[#7B5CF0] text-white shadow-md font-extrabold"
                : "bg-surface-container-low text-[#5B556D] hover:bg-surface-container"
            }`}
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>🌌 우주 밤하늘 별자리 뷰어 (추천)</span>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-5 py-2.5 rounded-2xl font-headline font-bold text-xs flex items-center gap-2 transition-all ${
              viewMode === "list"
                ? "bg-[#7B5CF0] text-white shadow-md font-extrabold"
                : "bg-surface-container-low text-[#5B556D] hover:bg-surface-container"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>📋 시간순 타임라인 명단</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchConstellationFromAi}
            icon={<RefreshCw className={`w-4 h-4 text-[#7B5CF0] ${loading ? "animate-spin" : ""}`} />}
            className="text-xs font-black text-[#7B5CF0] border-[#7B5CF0]/40"
          >
            AI 별자리 재고도화
          </Button>
          <Link to="/self-report">
            <Button variant="teal" size="sm" className="font-black text-xs">
              내 자기이해 진단 리포트 열기 &rarr;
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="min-h-[480px] bg-[#0B0A1A] rounded-[32px] border border-white/10 flex flex-col items-center justify-center p-8 text-center text-white space-y-4 shadow-[0_30px_60px_rgba(11,10,26,0.6)]">
          <MascotAri pose="celebrate" size="md" className="animate-bounce" />
          <p className="font-headline font-extrabold text-lg text-yellow-300">
            🌌 AI 아리가 학생의 '{dreamJob}' 고유 별자리를 계산하여 밤하늘에 띄우는 중입니다...
          </p>
          <p className="text-xs text-white/60">잠시만 기다려주세요! 실시간 2D 좌표 연산 및 한입 퀘스트 매칭 중...</p>
        </div>
      ) : constellation && viewMode === "canvas" ? (
        /* ============================
         * ✨ 2D STARRY NIGHT CANVAS
         * ============================ */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Night Sky Canvas (2 Columns on Large Screens) */}
          <div className="lg:col-span-2 relative h-[520px] md:h-[600px] rounded-[32px] bg-gradient-to-b from-[#060511] via-[#120F2B] to-[#1F174D] border-2 border-[#7B5CF0]/30 shadow-[0_25px_60px_rgba(11,10,26,0.7)] overflow-hidden select-none">
            
            {/* Background Stars / Nebula effect */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#7B5CF0]/20 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-8 left-8 text-white/30 text-xs font-headline font-bold uppercase tracking-widest pointer-events-none">
              ✨ CONSTELLATION SECTOR: {constellation.constellationName}
            </div>
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-[11px] text-white/50 bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 pointer-events-none">
              <span>💡 반짝이는 별 노드를 터치하면 해당 별자리의 <strong>[한입 퀘스트]</strong>가 우측 패널에 열립니다!</span>
              <span className="text-yellow-300 font-bold">좌표 매핑 수량: {constellation.nodes.length} STAR</span>
            </div>

            {/* SVG Constellation Lines Layer */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {renderSvgEdges()}
            </svg>

            {/* Star Nodes Render */}
            {constellation.nodes.map((node, index) => {
              const isSelected = selectedNode?.id === node.id;
              const allDone = node.quests.every((q) => q.status === "done");
              
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all duration-300 z-20"
                >
                  {/* Glowing halo */}
                  <div className={`absolute -inset-4 rounded-full blur-md transition-all duration-300 ${
                    isSelected ? "bg-[#7B5CF0]/80 scale-125 animate-pulse" : allDone ? "bg-teal-400/50" : "bg-yellow-300/30 group-hover:scale-110"
                  }`} />

                  {/* Star Icon Button */}
                  <div className={`relative w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center border-2 transition-transform duration-200 group-hover:scale-110 shadow-lg ${
                    isSelected
                      ? "bg-[#7B5CF0] border-yellow-300 scale-110 text-white shadow-[0_0_20px_rgba(255,235,59,0.8)]"
                      : allDone
                        ? "bg-teal-600 border-white text-white"
                        : "bg-[#1B1638] border-yellow-300/80 text-yellow-300"
                  }`}>
                    {allDone ? <CheckCircle2 className="w-7 h-7 stroke-[2.5]" /> : <Star className="w-7 h-7 fill-current animate-pulse" />}
                  </div>

                  {/* Node Label Tooltip on Canvas */}
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 rounded-full text-[11px] font-headline font-black whitespace-nowrap backdrop-blur-md transition-all border ${
                    isSelected ? "bg-white text-[#7B5CF0] border-yellow-300 shadow-lg scale-105" : "bg-black/70 text-white/90 border-white/20 group-hover:bg-black"
                  }`}>
                    ★ {index + 1}. {node.label.split("•")[1] || node.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bite-sized Quest Interaction Panel (1 Column on Large Screens) */}
          <div className="bg-white rounded-[32px] border border-[#E3E1E9] p-6 md:p-8 shadow-[0_20px_40px_rgba(123,92,240,0.08)] flex flex-col gap-6">
            {selectedNode ? (
              <>
                <div className="space-y-2 border-b border-[#E3E1E9] pb-4">
                  <span className="text-xs bg-[#7B5CF0]/10 text-[#7B5CF0] font-black px-3 py-1 rounded-full border border-[#7B5CF0]/20">
                    🎯 선택된 별자리 노드 상세
                  </span>
                  <h3 className="text-xl font-headline font-black text-[#1A1626]">
                    {selectedNode.label}
                  </h3>
                  <p className="text-xs text-[#5B556D] leading-relaxed">
                    {selectedNode.desc || "이 별자리 노드의 실천 과제들을 완료하여 EXP 보상을 획득하고, 생기부 초안 데이터를 충전하세요!"}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-headline font-bold text-[#1A1626]">
                    <span className="flex items-center gap-1 text-[#7B5CF0]">
                      <Zap className="w-4 h-4 fill-current" /> 한입 퀘스트 명단
                    </span>
                    <span>보상: 각 50~100 EXP</span>
                  </div>

                  <div className="space-y-3">
                    {selectedNode.quests.map((q) => {
                      const isDone = q.status === "done";
                      return (
                        <div
                          key={q.id}
                          className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                            isDone
                              ? "bg-teal-50/70 border-teal-500/40 text-teal-900"
                              : "bg-[#FBF8FF] border-[#E3E1E9] hover:border-[#7B5CF0]/60 text-[#1A1626]"
                          }`}
                        >
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              {isDone ? <CheckCircle2 className="w-4 h-4 text-teal-600 flex-shrink-0" /> : <Play className="w-3.5 h-3.5 text-[#7B5CF0] flex-shrink-0" />}
                              <span className={`text-xs font-black font-headline ${isDone ? "line-through text-teal-700/70" : "text-[#1A1626]"}`}>
                                {q.title}
                              </span>
                            </div>
                            <span className="text-[11px] text-[#7B5CF0] font-extrabold block pl-5">
                              ✨ 보상: +{q.expReward} EXP
                            </span>
                          </div>

                          {!isDone ? (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleCompleteQuest(selectedNode.id, q.id, q.expReward)}
                              className="text-[11px] px-3.5 py-1.5 font-extrabold shadow-md flex-shrink-0"
                            >
                              실천 완수!
                            </Button>
                          ) : (
                            <span className="text-[11px] font-extrabold text-teal-600 bg-teal-100/80 px-3 py-1 rounded-full flex-shrink-0">
                              ✓ 획득됨
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2">
                  <Link to="/portfolio">
                    <Button variant="outline" size="sm" fullWidth className="font-bold text-xs">
                      📁 이 활동 내역 포트폴리오로 AI 정리하기 &rarr;
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <div className="py-16 text-center space-y-4">
                <MascotAri pose="sticker" size="sm" className="mx-auto" />
                <p className="text-sm font-extrabold text-[#5B556D]">
                  좌측 밤하늘에서 반짝이는 별자리 노드를 터치해 주세요!
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ============================
         * 📋 TIMELINE LIST VIEW
         * ============================ */
        <div className="relative flex flex-col gap-6 pl-4 md:pl-8 before:content-[''] before:absolute before:left-[31px] md:before:left-[47px] before:top-6 before:bottom-6 before:w-1.5 before:bg-[#7B5CF0]/30 before:rounded-full">
          {constellation?.nodes.map((node, i) => {
            const allDone = node.quests.every((q) => q.status === "done");
            return (
              <div key={node.id} className="relative flex items-start gap-6 md:gap-8 group">
                <div className={`relative z-10 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-4 flex-shrink-0 shadow-md ${
                  allDone ? "bg-teal-500 border-white text-white" : "bg-[#7B5CF0] border-white text-white"
                }`}>
                  {allDone ? <CheckCircle2 className="w-5 h-5 stroke-[2.5]" /> : <Star className="w-5 h-5 fill-white animate-pulse" />}
                </div>

                <Card variant="surface" padding="md" className="flex-grow bg-white border border-[#E3E1E9] shadow-[0_15px_35px_rgba(123,92,240,0.06)] rounded-[32px] space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-[#E3E1E9] pb-3">
                    <div>
                      <span className="text-[11px] font-extrabold bg-[#7B5CF0]/10 text-[#7B5CF0] px-3 py-0.5 rounded-full">
                        ★ STEP {i + 1} • 밤하늘 별 노드
                      </span>
                      <h4 className="text-lg font-headline font-black text-[#1A1626] mt-1">{node.label}</h4>
                    </div>
                    <span className="text-xs font-bold text-[#5B556D]">{node.quests.length}개 한입 퀘스트 구성</span>
                  </div>

                  <p className="text-xs text-[#5B556D] leading-relaxed">{node.desc}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {node.quests.map((q) => (
                      <div key={q.id} className="p-3 bg-[#FBF8FF] rounded-2xl border border-[#E3E1E9] flex items-center justify-between text-xs font-bold">
                        <span>• {q.title}</span>
                        {q.status === "done" ? (
                          <span className="text-teal-600">✓ 완료</span>
                        ) : (
                          <button onClick={() => handleCompleteQuest(node.id, q.id, q.expReward)} className="text-[#7B5CF0] underline font-black">
                            +EXP 받기
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
