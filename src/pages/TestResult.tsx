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
  const [showSpecialistDetail, setShowSpecialistDetail] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [activeCurriculumYear, setActiveCurriculumYear] = useState<number>(1);

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
                  setShowSpecialistDetail(true);
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

      {/* Stitch 3D Specialist Career Details & Curriculum (정보보안 전문가 Prototype) */}
      {showSpecialistDetail && (
        <section className="bg-white rounded-[32px] p-8 border-2 border-[#E3E1E9] shadow-[0_20px_45px_rgba(123,92,240,0.12)] space-y-8 animate-fadeIn relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#7af1fc]/20 to-transparent rounded-bl-full pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E3E1E9]/80 pb-6">
            <div className="space-y-1">
              <span className="text-xs font-black text-[#006970] uppercase tracking-wider bg-[#7af1fc]/30 px-3 py-1 rounded-full inline-block mb-1 border border-[#006970]/20">
                ⭐ STITCH 3D CAREER DEEP-DIVE &middot; 실무 추천
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-[#1A1626] flex items-center gap-2">
                <span>🔒 정보보안 전문가 (AI 3D 커리큘럼 로드맵)</span>
              </h2>
              <p className="text-xs md:text-sm text-[#6E6A80]">사이버 위협으로부터 첨단 정보 시스템을 보호하는 디지털 가디언. 고교 3개년 맞춤 세특 및 학과 설계!</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsConfirmed(!isConfirmed)}
                className={`px-6 py-3.5 rounded-full font-black text-sm transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 ${
                  isConfirmed
                    ? "bg-[#006970] text-white shadow-[0_10px_25px_rgba(0,105,112,0.3)] ring-4 ring-[#7af1fc]/50"
                    : "bg-gradient-to-r from-[#8E70F7] to-[#6240d5] text-white shadow-[0_10px_25px_rgba(98,64,213,0.35)]"
                }`}
              >
                <span>{isConfirmed ? "✨ 진로 확정 완료 (별자리 연동됨)" : "🚀 이 진로로 확정하고 3D 애니메이션 띄우기"}</span>
              </button>
              <button
                onClick={() => setShowSpecialistDetail(false)}
                className="w-10 h-10 rounded-full bg-[#efedf5] text-[#484554] hover:bg-[#ffdad6] hover:text-[#ba1a1a] transition-colors flex items-center justify-center font-bold text-base"
                title="상세 닫기"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Confirmation Celebration Animation Message */}
          {isConfirmed && (
            <div className="bg-gradient-to-r from-[#7B5CF0] to-[#006970] p-6 rounded-[24px] text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-bounce-once">
              <div className="flex items-center gap-4">
                <span className="text-4xl">🎉</span>
                <div>
                  <h4 className="text-lg font-black leading-tight">진로 확정 성공! '정보보안 전문가' 궤도에 돌입했습니다.</h4>
                  <p className="text-xs text-white/80 mt-0.5">밤하늘 별자리 로드맵 노드에 화이트해커, 암호학, 클라우드 보안 세특 퀘스트가 실시간 동기화되었습니다.</p>
                </div>
              </div>
              <span className="text-xs font-black bg-white text-[#1A1626] px-4 py-2 rounded-full whitespace-nowrap shadow-md">
                오오라: 🛡️ 사이버 쉴드 수여!
              </span>
            </div>
          )}

          {/* Year Curriculum Toggle (1학년 / 2학년 / 3학년) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[#1A1626]">📚 학년별 정보보안 생기부·동아리 맞춤 커리큘럼 가이드</h3>
              <div className="flex gap-2 bg-[#EFEDF5] p-1 rounded-2xl">
                {[1, 2, 3].map((year) => (
                  <button
                    key={year}
                    onClick={() => setActiveCurriculumYear(year)}
                    className={`px-4 py-1.5 rounded-xl font-black text-xs transition-all ${
                      activeCurriculumYear === year
                        ? "bg-[#7B5CF0] text-white shadow-md"
                        : "text-[#6E6A80] hover:text-[#1A1626]"
                    }`}
                  >
                    {year}학년 과정
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {activeCurriculumYear === 1 && (
                <>
                  <div className="p-5 rounded-2xl bg-[#f4f2fa] border border-[#cac4d7]/40 space-y-2">
                    <span className="text-[11px] font-black text-[#7B5CF0] uppercase">1학년 전공 기초 탐구</span>
                    <strong className="text-base font-extrabold text-[#1A1626] block">파이썬 기반 네트워크 통신 개론</strong>
                    <p className="text-xs text-[#5B556D] leading-relaxed">TCP/IP 패킷 분석 툴을 실습하고 안전한 데이터 통신 프로토콜의 중요성을 탐구 보고서로 제출</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#f4f2fa] border border-[#cac4d7]/40 space-y-2">
                    <span className="text-[11px] font-black text-[#006970] uppercase">1학년 동아리 추천</span>
                    <strong className="text-base font-extrabold text-[#1A1626] block">교내 사이버 윤리 및 보안 스터디</strong>
                    <p className="text-xs text-[#5B556D] leading-relaxed">해킹 피해 방지 대책 캠페인을 주도하고 학교 홈페이지 취약점 모의 분석을 진행</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#f4f2fa] border border-[#cac4d7]/40 space-y-2">
                    <span className="text-[11px] font-black text-[#6240d5] uppercase">1학년 독서 융합</span>
                    <strong className="text-base font-extrabold text-[#1A1626] block">암호학과 AI 윤리 고전 필독</strong>
                    <p className="text-xs text-[#5B556D] leading-relaxed">현대 암호 체계(RSA 등)의 기초 수학과 인공지능 기반 탐지 시스템에 관한 비판적 책읽기</p>
                  </div>
                </>
              )}
              {activeCurriculumYear === 2 && (
                <>
                  <div className="p-5 rounded-2xl bg-[#f4f2fa] border border-[#cac4d7]/40 space-y-2">
                    <span className="text-[11px] font-black text-[#7B5CF0] uppercase">2학년 심화 탐구</span>
                    <strong className="text-base font-extrabold text-[#1A1626] block">AI 머신러닝 이상행위 탐지 모델</strong>
                    <p className="text-xs text-[#5B556D] leading-relaxed">로그 데이터를 학습하여 DDoS 및 인프라 침해 위협을 실시간 판별하는 미니 프로토타입 구현</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#f4f2fa] border border-[#cac4d7]/40 space-y-2">
                    <span className="text-[11px] font-black text-[#006970] uppercase">2학년 자율활동</span>
                    <strong className="text-base font-extrabold text-[#1A1626] block">정보경시 및 워드프레스 보안 실습</strong>
                    <p className="text-xs text-[#5B556D] leading-relaxed">오픈소스 웹 서버의 취약점 보강 실무를 경험하고 지역 대학 보안 연수 프로그램 적극 참가</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#f4f2fa] border border-[#cac4d7]/40 space-y-2">
                    <span className="text-[11px] font-black text-[#6240d5] uppercase">2학년 세특 포인트</span>
                    <strong className="text-base font-extrabold text-[#1A1626] block">클라우드 인프라 아키텍처 이해</strong>
                    <p className="text-xs text-[#5B556D] leading-relaxed">분산 처리 환경에서의 데이터 무결성 보호 알고리즘을 물리/정보 교과와 연계하여 발표</p>
                  </div>
                </>
              )}
              {activeCurriculumYear === 3 && (
                <>
                  <div className="p-5 rounded-2xl bg-[#f4f2fa] border border-[#cac4d7]/40 space-y-2">
                    <span className="text-[11px] font-black text-[#7B5CF0] uppercase">3학년 진로 심화 프로젝트</span>
                    <strong className="text-base font-extrabold text-[#1A1626] block">제로 트러스트(Zero Trust) 보안 설계</strong>
                    <p className="text-xs text-[#5B556D] leading-relaxed">'아무도 믿지 않는' 차세대 정보보안 패러다임을 연구하여 최종 진로 종합 보고서 서술</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#f4f2fa] border border-[#cac4d7]/40 space-y-2">
                    <span className="text-[11px] font-black text-[#006970] uppercase">3학년 대입 면접 대비</span>
                    <strong className="text-base font-extrabold text-[#1A1626] block">생기부 연계 1:1 디펜스 모의 면접</strong>
                    <p className="text-xs text-[#5B556D] leading-relaxed">아리가 생성해주는 역대 보안 학과 인성 및 실무 면접 기출 질문에 대해 논리적 스피치 훈련</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#f4f2fa] border border-[#cac4d7]/40 space-y-2">
                    <span className="text-[11px] font-black text-[#6240d5] uppercase">3학년 포트폴리오 마감</span>
                    <strong className="text-base font-extrabold text-[#1A1626] block">나이스(NEIS) 최종 기재 체크리스트</strong>
                    <p className="text-xs text-[#5B556D] leading-relaxed">2026 교육부 기재요령 규정에 맞춰 위반 단어 없는 100% 모범 세특 초안 교사용 공유</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

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
