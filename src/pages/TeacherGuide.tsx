import React, { useState } from "react";
import { Button, Card, Chip, MascotAri } from "../components";
import { Sparkles, Users, Search, Download, ShieldCheck, Edit3, Layers } from "lucide-react";

interface Student {
  id: string;
  name: string;
  grade: string;
  cluster: string;
  activitiesCount: number;
  aiScore: number;
  draftStatus: "완성됨" | "생성 중" | "검토 전";
  seoteoSample: string;
}

export const TeacherGuide: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCluster, setFilterCluster] = useState("전체");

  const clusters = ["전체", "인공지능·공학", "바이오·메디컬", "문화 콘텐츠·디자인", "기초과학·연구"];

  const students: Student[] = [
    {
      id: "std-1",
      name: "김수진",
      grade: "3학년 2반",
      cluster: "인공지능·공학",
      activitiesCount: 12,
      aiScore: 98,
      draftStatus: "완성됨",
      seoteoSample: "[인공지능·공학 융합 탐구 역량] 자율주행과 기후위기 토론 대회에서 데이터 시각화 라이브러리를 직접 활용하여 환경 개선 통계를 훌륭히 도축함. 3학기에 걸쳐 AI 윤리 책 3권을 완독하고 관련 학술제에 참가하는 등 미래지향적 공학 커리어에 대한 열정과 성취도 극히 뛰어남."
    },
    {
      id: "std-2",
      name: "박도현",
      grade: "3학년 2반",
      cluster: "바이오·메디컬",
      activitiesCount: 9,
      aiScore: 94,
      draftStatus: "완성됨",
      seoteoSample: "[바이오·메디컬 데이터 분석] 유전체 시퀀싱 데이터 정제 실무 체험 스터디를 주도하며 생물학적 호기심을 알고리즘적 사고로 해결하는 능력을 보여줌. 성찰 지수가 뛰어나고 학과 간 융합 사고가 두드러짐."
    },
    {
      id: "std-3",
      name: "이윤지",
      grade: "3학년 2반",
      cluster: "문화 콘텐츠·디자인",
      activitiesCount: 8,
      aiScore: 89,
      draftStatus: "생성 중",
      seoteoSample: "[XR 메타버스 UI/UX 기획] 감성 융합형 인터랙티브 3D 그래픽 설계를 목표로 하여 학생들의 진로 무드검사를 인포그래픽으로 다변화함."
    },
    {
      id: "std-4",
      name: "최준혁",
      grade: "3학년 2반",
      cluster: "기초과학·연구",
      activitiesCount: 5,
      aiScore: 82,
      draftStatus: "검토 전",
      seoteoSample: "기본 과학교과 실험에 성실히 임하며 ESG 가치 실현을 위한 기초 데이터 기록을 수행함."
    }
  ];

  const currentStudent = selectedStudent || students[0];

  const filteredStudents = students.filter(s => 
    s.name.includes(searchTerm) && (filterCluster === "전체" || s.cluster === filterCluster)
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 md:py-12 flex flex-col gap-8">
      {/* Teacher Desktop Pro Hero Header (Matching 2560x2048 high density Stitch screen) */}
      <div className="bg-surface-container-lowest border-2 border-primary/20 rounded-[32px] p-6 md:p-10 shadow-3d-ambient relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex flex-col gap-3 max-w-3xl">
          <div className="inline-flex items-center self-start gap-2 bg-secondary/15 text-secondary-spot px-4 py-1 rounded-full text-xs font-headline font-black">
            <ShieldCheck className="w-4 h-4 text-secondary" />
            <span>교사 전용 고해상도 Pro 도구 (3D 한글)</span>
          </div>
          <h1 className="text-headline-lg md:text-display-lg font-extrabold text-text-primary font-headline tracking-tight">
            학생부 기재 AI 스마트 가이드
          </h1>
          <p className="text-text-muted font-body-md text-sm md:text-base leading-relaxed">
            학생들의 ‘별자리 로드맵’ 및 ‘진로 포트폴리오’ 기록 실시간 통합 열람! <br />
            AI 문체 번역 엔진을 통해 **세부능력 및 특기사항(세특)**과 **창의적체험활동** 모범 초안을 단 1초 만에 최적화하여 내보냅니다.
          </p>

          <div className="flex items-center gap-4 mt-3 pt-4 border-t border-surface-variant/40 text-xs font-semibold text-text-primary flex-wrap">
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-primary" /> 관리 학급: 3학년 2반 (총 28명)</span>
            <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-secondary" /> AI 세특 정확도: 99.4%</span>
            <span className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-primary" /> 교육청 표준 기재 요약 규격 준수</span>
          </div>
        </div>

        <div className="flex-shrink-0 flex flex-col items-center justify-center bg-surface-container-low p-6 rounded-[28px] border border-surface-variant/40 min-w-[280px]">
          <MascotAri pose="avatar" size="md" rotate={false} />
          <Button variant="hero" size="sm" className="mt-4 w-full font-extrabold shadow-md" icon={<Download className="w-4 h-4" />}>
            전체 학급 NEIS 일괄 내보내기
          </Button>
        </div>
      </div>

      {/* Main 2-Column Pro Interface: Student List Table (Left) & AI Editor (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Student Roster & Filters (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <Card variant="activity" padding="md" className="shadow-3d-base border-surface-variant/40">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="font-headline font-bold text-title-md text-text-primary flex items-center gap-2">
                  <span>🧑‍🎓 학급 학생 목록</span>
                  <span className="bg-primary/10 text-primary text-xs font-black px-2.5 py-0.5 rounded-full">{filteredStudents.length}명</span>
                </h2>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-4 top-3.5 text-text-muted" />
                <input
                  type="text"
                  placeholder="학생 이름 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 bg-input-fill rounded-full text-sm font-body-md border border-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Cluster Chips */}
              <div className="flex overflow-x-auto gap-2 no-scrollbar pb-1">
                {clusters.map((cl) => (
                  <Chip
                    key={cl}
                    size="sm"
                    active={filterCluster === cl}
                    onClick={() => setFilterCluster(cl)}
                  >
                    {cl}
                  </Chip>
                ))}
              </div>

              {/* Student Cards List */}
              <div className="flex flex-col gap-3 mt-1 max-h-[520px] overflow-y-auto pr-1 no-scrollbar">
                {filteredStudents.map((std) => {
                  const isSelected = currentStudent.id === std.id;
                  return (
                    <div
                      key={std.id}
                      onClick={() => setSelectedStudent(std)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-center justify-between ${
                        isSelected
                          ? "bg-primary/10 border-primary font-bold shadow-sm translate-x-1"
                          : "bg-surface-container-low/60 border-surface-variant/30 hover:bg-surface-container-low"
                      }`}
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-headline font-extrabold text-base text-text-primary">{std.name}</span>
                          <span className="text-[11px] bg-white px-2 py-0.5 rounded-md border text-text-muted font-semibold">{std.grade}</span>
                        </div>
                        <span className="text-xs text-secondary-spot font-extrabold">
                          ● {std.cluster}
                        </span>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                          std.draftStatus === "완성됨" ? "bg-secondary/15 text-secondary-spot" : "bg-surface-variant text-text-muted"
                        }`}>
                          {std.draftStatus}
                        </span>
                        <span className="text-xs text-primary font-headline font-black">AI 99점</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: AI Seotek Editor & Generator (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card variant="activity" padding="lg" className="shadow-3d-ambient border-primary/20 relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-surface-variant/30">
              <div>
                <span className="text-xs font-bold text-secondary bg-secondary/10 px-3 py-1 rounded-full uppercase tracking-wide">
                  Selected Student Record
                </span>
                <h2 className="text-headline-lg font-headline font-extrabold text-text-primary mt-2">
                  {currentStudent.name} 학생 <small className="text-sm font-semibold text-text-muted">({currentStudent.cluster})</small>
                </h2>
                <span className="text-xs text-text-muted block mt-0.5">누적 활동 퀘스트: {currentStudent.activitiesCount}건 완결</span>
              </div>

              <div className="flex gap-2">
                <Button variant="teal" size="sm" icon={<Sparkles className="w-4 h-4" />}>
                  AI 맞춤 다시 생성
                </Button>
                <Button variant="primary" size="sm" icon={<Edit3 className="w-4 h-4" />}>
                  수동 수정
                </Button>
              </div>
            </div>

            {/* AI Seoteo Generator Output Canvas */}
            <div className="mt-6 flex flex-col gap-4">
              <div className="flex justify-between items-center px-1">
                <span className="font-headline font-extrabold text-title-md text-primary flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5 text-secondary-spot" />
                  AI 자동 생성 세무능력 및 특기사항 초안
                </span>
                <span className="text-xs text-secondary-spot font-bold bg-secondary/15 px-3 py-1 rounded-full">
                  NEIS 복사 준비됨
                </span>
              </div>

              <div className="bg-input-fill p-6 rounded-[28px] border-2 border-primary/20 text-text-primary font-body-md leading-relaxed text-sm md:text-base shadow-inner relative">
                <p className="whitespace-pre-line leading-8">
                  {currentStudent.seoteoSample}
                </p>

                <div className="mt-6 pt-4 border-t border-surface-variant/30 flex justify-between items-center text-xs text-text-muted font-bold">
                  <span>● 글자 수: 공백 포함 284자 / 500자 (NEIS 기준 안전)</span>
                  <button className="text-primary hover:underline flex items-center gap-1">
                    클립보드에 바로 복사 &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* AI Partner hint on teacher view */}
            <div className="mt-6">
              <MascotAri
                pose="avatar"
                size="sm"
                bubbleTitle="Ari's 교사용 AI 피칭 분석"
                bubbleMessage="이 학생의 '인간의 일 독후감' 활동을 세특 초안 3문장에 병행 배치하면 논리력과 감수성 평가 지수가 15% 상승합니다."
              />
            </div>
          </Card>

          {/* Quick Guidance Rules & Caution Card */}
          <Card variant="surface" padding="md" className="bg-surface-container-low/80 border border-surface-variant/30 flex items-center justify-between gap-4 text-xs font-body-md text-text-muted">
            <div>
              <strong className="text-text-primary block mb-1">📢 2026학년도 학생부 기재 유의사항 (자동 감지 활성)</strong>
              사설 대회 수상 실적, 교외 인증 시험 점수 등 금지 문자열이 탐지될 경우 AI가 자동으로 필터링하여 합법적인 학교 생활 중심 언어로 전환합니다.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
