import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, MascotAri } from "../components";
import { Award, ArrowRight, Brain, Plus } from "lucide-react";
import configData from "../data/assessment_config.json";

export const TestResult: React.FC = () => {
  const navigate = useNavigate();
  const [resultCode, setResultCode] = useState("SI");
  const [primaryType, setPrimaryType] = useState("S");
  const [customJob, setCustomJob] = useState("");
  const [savedJobs, setSavedJobs] = useState<Array<{ name: string; image: string; category: string }>>([]);

  useEffect(() => {
    const code = localStorage.getItem("riasec_result_code") || "SI";
    const primary = localStorage.getItem("riasec_primary") || "S";
    setResultCode(code);
    setPrimaryType(primary);

    const clusters = (configData.job_clusters as any)[primary] || (configData.job_clusters as any)["I"];
    setSavedJobs(clusters || []);
  }, []);

  const interpText = (configData.interpretation_templates as any)[primaryType] || configData.interpretation_templates.S;

  const handleAddCustomJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customJob.trim()) return;
    setSavedJobs((prev) => [{ name: customJob.trim(), image: "🌟", category: "나만의 직접 입력" }, ...prev]);
    setCustomJob("");
  };

  const handleFinish = () => {
    localStorage.setItem("my_interested_jobs", JSON.stringify(savedJobs));
    navigate("/");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 bg-secondary/15 text-secondary px-4 py-1 rounded-full text-xs font-headline font-black shadow-inner">
          <Brain className="w-4 h-4 text-secondary-spot animate-pulse" />
          <span>Holland RIASEC 6유형 검사 분석 완료</span>
        </span>
        <h1 className="text-4xl md:text-5xl font-headline font-black text-text-primary tracking-tight">
          OO친구는 <span className="text-transparent bg-clip-text gradient-hero-card">[{resultCode}] 유형</span>에 가깝습니다!
        </h1>
        <p className="text-sm md:text-base text-text-muted font-body-md max-w-2xl mx-auto leading-relaxed">
          {interpText}
        </p>
      </div>

      {/* Mascot Interpretation Card */}
      <Card variant="hero" padding="lg" className="shadow-3d-ambient bg-gradient-to-r from-point to-white border-2 border-primary/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <span className="text-xs font-headline font-extrabold text-primary block">🤖 아리(Ari)의 맞춤 해석 리포트</span>
            <h2 className="text-2xl font-headline font-black text-text-primary">
              나에게 꼭 맞는 직업군을 선택하고 로드맵으로 떠나볼까요?
            </h2>
            <p className="text-xs md:text-sm text-text-muted leading-relaxed font-body-md">
              추천된 하단 직업군을 확인해보세요. <strong>"없으면 직접 적어봐도 좋아요!"</strong> 선택된 직업군은 홈 대시보드와 AI 별자리 로드맵, 생기부 가이드안에서 메인 목표로 맹활약하게 됩니다.
            </p>
          </div>
          <MascotAri
            pose="celebrate"
            size="md"
            rotate={true}
            bubbleTitle={`💎 ${resultCode} 유형 커리어 개척자!`}
            bubbleMessage="아래 그리드에서 관심 직업을 살펴보고 나만의 비전 꿈꾸기를 시작해봐요!"
          />
        </div>
      </Card>

      {/* Interested Jobs Selection Grid & Custom Input */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-variant/40 pb-3">
          <div>
            <h3 className="text-2xl font-headline font-black text-text-primary flex items-center gap-2">
              <Award className="w-6 h-6 text-secondary" />
              <span>추천 직업군 및 내 관심 직업</span>
            </h3>
            <span className="text-xs text-text-muted">클릭하여 메인 관심 직업으로 지정하거나 새롭게 입력하세요.</span>
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
            <Button variant="primary" size="sm" type="submit" icon={<Plus className="w-4 h-4" />} className="font-extrabold whitespace-nowrap shadow-sm">
              + 직접 작성 추가
            </Button>
          </form>
        </div>

        {/* Job Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {savedJobs.map((job, idx) => {
            const isPrimary = idx === 0;
            return (
              <div
                key={`${job.name}-${idx}`}
                onClick={() => {
                  const newArray = [...savedJobs];
                  const selected = newArray.splice(idx, 1)[0];
                  setSavedJobs([selected, ...newArray]);
                }}
                className={`p-5 rounded-3xl border-2 cursor-pointer transition-all duration-200 flex flex-col items-center text-center justify-between gap-3 shadow-3d-base ${
                  isPrimary
                    ? "bg-secondary/10 border-secondary scale-105 shadow-md"
                    : "bg-surface-container-low border-surface-variant/50 hover:border-primary/50 hover:bg-surface-container"
                }`}
              >
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-3xl shadow-sm">
                  {job.image}
                </div>
                <div>
                  <span className="text-[10px] font-headline font-extrabold text-secondary-spot bg-surface-container px-2 py-0.5 rounded-full block mb-1">
                    {job.category}
                  </span>
                  <strong className="text-sm md:text-base font-headline font-black text-text-primary block leading-tight">
                    {job.name}
                  </strong>
                </div>
                {isPrimary ? (
                  <span className="w-full py-1 rounded-xl bg-secondary text-white text-[11px] font-black shadow-sm">
                    ★ 대표 관심 직업 (Primary)
                  </span>
                ) : (
                  <span className="w-full py-1 rounded-xl bg-surface-container-high text-text-muted text-[11px] font-bold">
                    터치하여 대표 설정
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Main CTA */}
      <div className="pt-6 flex justify-center">
        <Button
          variant="teal"
          size="lg"
          onClick={handleFinish}
          icon={<ArrowRight className="w-6 h-6" />}
          className="font-headline font-extrabold px-10 py-5 shadow-2xl hover:scale-105 transition-transform text-lg"
        >
          직업군 선택 저장하고 커리어 홈 대시보드 진입 &rarr;
        </Button>
      </div>

    </div>
  );
};

export default TestResult;
