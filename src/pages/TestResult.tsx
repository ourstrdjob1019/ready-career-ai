import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, MascotAri } from "../components";
import { Award, ArrowRight, Brain, Plus, CheckCircle2, Sparkles, Compass } from "lucide-react";
import configData from "../data/assessment_config.json";
import { useSelfUnderstanding } from "../context";

interface JobData {
  name: string;
  image: string;
  category: string;
  summary?: string;
}

export const TestResult: React.FC = () => {
  const navigate = useNavigate();
  const { completeAssessment, assessments } = useSelfUnderstanding();
  const [resultCode, setResultCode] = useState("SI");
  const [primaryType, setPrimaryType] = useState("S");
  const [customJob, setCustomJob] = useState("");
  const [savedJobs, setSavedJobs] = useState<JobData[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const code = localStorage.getItem("riasec_result_code") || "SI";
    const primary = localStorage.getItem("riasec_primary") || "S";
    setResultCode(code);
    setPrimaryType(primary);

    const clusters: JobData[] = (configData.job_clusters as any)[primary] || (configData.job_clusters as any)["I"] || [];
    setSavedJobs(clusters);
    if (clusters.length > 0) {
      setSelectedJob(clusters[0]);
    }

    // 진단 허브 1번 항목(흥미무드) 완료 실시간 동기화
    completeAssessment("test-interest", 100, `Holland RIASEC [${code}] 흥미무드 진단 완수 (${primary} 유형)`);
  }, []);

  // 남은 2종 진단까지 모두 완료했는지 체크 (테스트 2, 3번이 완료됨 상태인지)
  const otherTestsDone = assessments.filter(a => a.id !== "test-interest").every(a => a.status === "완료됨");
  const allTestsDone = otherTestsDone; // 흥미검사는 현재 페이지 진입 시 완료됨

  const interpText = (configData.interpretation_templates as any)[primaryType] || configData.interpretation_templates.S;

  const handleAddCustomJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customJob.trim()) return;
    const newJob: JobData = {
      name: customJob.trim(),
      image: "🌟",
      category: "나만의 직접 입력",
      summary: "내가 스스로 주도하여 개척하기로 결심한 2026 맞춤형 융합 커리어 비전 목표입니다.",
    };
    setSavedJobs((prev) => [newJob, ...prev]);
    setSelectedJob(newJob);
    setIsConfirmed(false);
    setCustomJob("");
  };

  const handleConfirmCareer = () => {
    setIsConfirmed(true);
    if (selectedJob) {
      localStorage.setItem("confirmed_career_goal", JSON.stringify(selectedJob));
      localStorage.setItem("my_interested_jobs", JSON.stringify(savedJobs));
    }
  };

  const handleFinish = () => {
    localStorage.setItem("my_interested_jobs", JSON.stringify(savedJobs));
    
    // 마이페이지에 활동 리포트 실천 내역으로 자동 저장
    const existingActs = JSON.parse(localStorage.getItem("readycareer_student_activities_v1") || "[]");
    const newAct = {
      id: "act-riasec-" + Date.now(),
      title: `[자기이해 진단 1/3] Holland RIASEC 흥미무드 진단 완수 (${resultCode} 유형)`,
      category: "자기이해 진단",
      exp: "+50 EXP",
      date: new Date().toLocaleDateString("ko-KR"),
      reflection: interpText
    };
    localStorage.setItem("readycareer_student_activities_v1", JSON.stringify([newAct, ...existingActs]));

    // 항상 진단 3가지 선택하는 허브 페이지로 돌아가서 남은 진단 또는 최종 종합 직업 선택을 진행
    navigate("/self-understanding?onboarding=true");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10 selection:bg-primary/20 animate-fadeIn">
      
      {/* Title Header */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 bg-secondary/15 text-secondary px-4 py-1 rounded-full text-xs font-headline font-black shadow-inner whitespace-nowrap">
          <Brain className="w-4 h-4 text-secondary-spot animate-pulse flex-shrink-0" />
          <span>Holland RIASEC 실전 6유형 진단 분석 완료</span>
        </span>
        <h1 className="text-4xl md:text-5xl font-headline font-black text-text-primary tracking-tight">
          회원님은 <span className="text-transparent bg-clip-text gradient-hero-card">[{resultCode}] 유형</span>에 가깝습니다!
        </h1>
        <p className="text-sm md:text-base text-text-muted font-body-md max-w-2xl mx-auto leading-relaxed">
          {interpText}
        </p>
      </div>

      {/* Mascot Interpretation Card */}
      <Card variant="hero" padding="lg" className="shadow-3d-ambient bg-gradient-to-r from-point to-white border-2 border-primary/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <span className="text-xs font-headline font-extrabold text-primary block whitespace-nowrap">🤖 아리(Ari)의 맞춤 해석 리포트</span>
            <h2 className="text-2xl font-headline font-black text-text-primary">
              나에게 꼭 맞는 직업군을 선택하고 별자리 로드맵으로 떠나볼까요?
            </h2>
            <p className="text-xs md:text-sm text-text-muted leading-relaxed font-body-md">
              하단 그리드의 추천 직업군을 클릭해 상세 정보(`jobs.summary`)를 열람해 보세요. <strong>"없으면 직접 입력해도 좋아요!"</strong> 진로를 확정하면 +20 EXP 보너스와 함께 마이페이지 및 AI 생기부 로드맵에 연동됩니다.
            </p>
          </div>
          <MascotAri
            pose="celebrate"
            size="md"
            rotate={true}
            bubbleTitle={`💎 ${resultCode} 유형 커리어 개척자!`}
            bubbleMessage="아래 그리드에서 직업을 터치해 상세 설명과 꿈을 확인해 봐요!"
          />
        </div>
      </Card>

      {/* Interested Jobs Selection Grid & Custom Input - Only visible when all 3 diagnostic tests are completed */}
      {!allTestsDone ? (
        <Card variant="hero" padding="lg" className="bg-gradient-to-br from-primary-fixed/20 via-surface-container to-surface-container-low border-2 border-primary/40 text-center space-y-5 shadow-lg">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-1.5 rounded-full font-headline font-black text-sm shadow-sm">
            <span>⏳ [진단 1/3 완료] 남은 2개 진단(다중지능, 학습스타일)을 마쳐야 최종 추천 직업군이 해금됩니다!</span>
          </div>
          <h3 className="text-xl md:text-2xl font-headline font-black text-text-primary">
            🎉 1단계 흥미무드 검사 완수! 이제 진단 허브로 복귀하여 남은 2가지 검사를 이어가볼까요?
          </h3>
          <p className="text-xs md:text-sm text-text-muted max-w-2xl mx-auto leading-relaxed font-medium">
            본 프로그램을 100% 활용하기 위해서는 <strong>진단 검사 3종(흥미무드, 다중지능, 학습스타일)</strong>을 반드시 먼저 모두 완수해야 합니다.<br />
            하단의 <strong>[리포트 마이페이지에 저장하고 남은 진단 마저 하기]</strong> 버튼을 누르면 이 결과가 실시간 마이페이지에 누적되고, 진단 선택 허브로 이동합니다!
          </p>
        </Card>
      ) : (
        <>
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-variant/40 pb-3">
              <div>
                <h3 className="text-2xl font-headline font-black text-text-primary flex items-center gap-2">
                  <Award className="w-6 h-6 text-secondary flex-shrink-0" />
                  <span>추천 직업군 및 내 관심 직업</span>
                </h3>
                <span className="text-xs text-text-muted whitespace-nowrap">클릭하여 직업 상세 정보를 열람하고 대표 진로로 설정할 수 있습니다.</span>
              </div>

              {/* Custom job form */}
              <form onSubmit={handleAddCustomJob} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="예: 스포츠 데이터 전문 분석사"
                  value={customJob}
                  onChange={(e) => setCustomJob(e.target.value)}
                  className="px-4 py-2 bg-surface-container-lowest border border-surface-variant/60 rounded-2xl text-xs md:text-sm focus:ring-2 focus:ring-primary font-bold w-52 md:w-64 shadow-inner"
                />
                <Button variant="primary" size="sm" type="submit" icon={<Plus className="w-4 h-4 flex-shrink-0" />} className="font-extrabold whitespace-nowrap shadow-sm">
                  + 직접 작성 추가
                </Button>
              </form>
            </div>

            {/* Job Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {savedJobs.map((job, idx) => {
                const isSelected = selectedJob?.name === job.name;
                return (
                  <div
                    key={`${job.name}-${idx}`}
                    onClick={() => {
                      setSelectedJob(job);
                      setIsConfirmed(false);
                    }}
                    className={`p-5 rounded-3xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-center text-center justify-between gap-3 shadow-3d-base ${
                      isSelected
                        ? "bg-secondary/15 border-secondary scale-105 shadow-md"
                        : "bg-surface-container-low border-surface-variant/50 hover:border-primary/50 hover:bg-surface-container"
                    }`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-3xl shadow-sm">
                      {job.image}
                    </div>
                    <div>
                      <span className="text-[10px] font-headline font-extrabold text-secondary-spot bg-surface-container px-2.5 py-0.5 rounded-full inline-block mb-1 whitespace-nowrap border border-surface-variant/30">
                        {job.category}
                      </span>
                      <strong className="text-sm md:text-base font-headline font-black text-text-primary block leading-tight">
                        {job.name}
                      </strong>
                    </div>
                    {isSelected ? (
                      <span className="w-full py-1.5 px-2 rounded-xl bg-secondary text-white text-[11px] font-black shadow-sm whitespace-nowrap text-center">
                        ★ 선택됨 (아래 상세 열람)
                      </span>
                    ) : (
                      <span className="w-full py-1.5 px-2 rounded-xl bg-surface-container-high text-text-muted text-[11px] font-bold whitespace-nowrap text-center">
                        터치하여 상세 보기
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* DETAILED CAREER VIEW */}
          {selectedJob && (
            <section className="bg-white rounded-[32px] p-8 border-2 border-primary/30 shadow-[0_20px_45px_rgba(123,92,240,0.12)] space-y-8 animate-fadeIn relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#7af1fc]/20 to-transparent rounded-bl-full pointer-events-none" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-surface-variant/50 pb-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 bg-[#7af1fc]/30 text-secondary px-3.5 py-1 rounded-full text-xs font-headline font-black border border-secondary/20 whitespace-nowrap">
                    <Sparkles className="w-3.5 h-3.5 text-secondary-spot flex-shrink-0" />
                    <span>ReadyCareer AI &middot; 직업 상세 정보 (Detailed Career View)</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-[#1A1626] flex items-center gap-3">
                    <span className="text-4xl">{selectedJob.image}</span>
                    <span>{selectedJob.name}</span>
                  </h2>
                  <p className="text-sm text-text-primary font-medium leading-relaxed bg-surface-container-low p-4 rounded-2xl border border-surface-variant/40">
                    💡 <strong>직무 개요 (`jobs.summary`):</strong> {selectedJob.summary || "청소년의 미래 비전과 맞춤 역량이 발아하는 2026 핵심 선도 직군입니다. 내 흥미 강점을 극대화하여 전문적인 진로 탐색을 떠나보세요."}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={handleConfirmCareer}
                    className={`px-7 py-4 rounded-full font-headline font-black text-sm transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap flex items-center gap-2 ${
                      isConfirmed
                        ? "bg-[#006970] text-white shadow-[0_10px_25px_rgba(0,105,112,0.3)] ring-4 ring-[#7af1fc]/50"
                        : "bg-gradient-to-r from-primary to-[#8E70F7] text-white shadow-[0_10px_25px_rgba(98,64,213,0.35)]"
                    }`}
                  >
                    <Compass className="w-4 h-4 flex-shrink-0" />
                    <span>{isConfirmed ? "✨ 진로 확정 완료 (별자리 로드맵 활성화)" : "🚀 이 진로로 확정하고 꿈 켜기 (+20 EXP 획득!)"}</span>
                  </button>
                </div>
              </div>

              {/* Confirmation Celebration */}
              {isConfirmed && (
                <div className="bg-gradient-to-r from-primary-container to-secondary p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-bounce-once border-2 border-white/30">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-4xl shadow-inner flex-shrink-0">
                      🏆
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black bg-white text-primary px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-sm">
                          +20 EXP 획득! 🌟
                        </span>
                        <span className="text-xs font-black text-secondary-container">누적 EXP 보증서 지급됨</span>
                      </div>
                      <h4 className="text-lg font-black leading-tight">진로 확정 성공! '{selectedJob.name}' 별자리가 밝혀졌습니다.</h4>
                      <p className="text-xs text-white/90 leading-relaxed">
                        마이페이지 및 AI 생기부 별자리 로드맵에 선택하신 비전 목표가 저장되어 맞춤 퀘스트가 실시간 추천됩니다!
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/mypage")}
                    className="font-extrabold whitespace-nowrap bg-white text-primary border-white shadow-md hover:bg-white/90"
                  >
                    🏅 누적 마이페이지 확인 &rarr;
                  </Button>
                </div>
              )}

              <div className="bg-surface-container p-5 rounded-2xl border border-surface-variant/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-bold text-text-muted">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-secondary-spot flex-shrink-0" />
                  <span>선택한 직무(`riasec_code: {primaryType}`)는 현장 박람회 AI 서버리스 진로 분석 및 생기부 초안 가이드에 자동 연결됩니다.</span>
                </span>
                <span className="bg-white px-3 py-1 rounded-full text-text-primary border border-surface-variant/40 whitespace-nowrap font-black">
                  ● ReadyCareer AI &middot; 데모 온보딩 완료
                </span>
              </div>
            </section>
          )}
        </>
      )}

      {/* Main CTA to proceed */}
      <div className="pt-6 flex justify-center">
        <Button
          variant="teal"
          size="lg"
          onClick={handleFinish}
          icon={<ArrowRight className="w-6 h-6 flex-shrink-0" />}
          className="font-headline font-extrabold px-10 py-5 shadow-2xl hover:scale-105 transition-transform text-lg whitespace-nowrap"
        >
          {!allTestsDone
            ? "💾 리포트 생성 및 마이페이지에 저장 후, 남은 진단 마저 하기 (목록 복귀) →"
            : "💾 리포트 마이페이지에 저장 후 3종 종합 선택 창으로 이동 →"}
        </Button>
      </div>

    </div>
  );
};

export default TestResult;
