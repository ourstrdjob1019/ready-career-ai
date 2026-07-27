import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Input, Chip, MascotAri } from "../components";
import { School, User, Sparkles, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context";

interface SchoolItem {
  school_code?: string;
  name: string;
  region?: string;
  level?: string;
}

export const OnboardingInfo: React.FC = () => {
  const navigate = useNavigate();
  const { session, startExpoDemo } = useAuth();
  const [name, setName] = useState(() => {
    const isNew = localStorage.getItem("is_new_student_clean_state") === "true";
    if (isNew) return "";
    return localStorage.getItem("readycareer_student_name") || "";
  });
  const [school, setSchool] = useState(() => {
    const isNew = localStorage.getItem("is_new_student_clean_state") === "true";
    if (isNew) return "";
    return localStorage.getItem("readycareer_student_school") || "";
  });
  const [grade, setGrade] = useState("3학년");
  const [targetCluster, setTargetCluster] = useState<string>("인공지능·공학");

  // Supabase 학교 검색 관련 상태
  const [searchResults, setSearchResults] = useState<SchoolItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSchoolConfirmed, setIsSchoolConfirmed] = useState(false);
  const [confirmedSchoolCode, setConfirmedSchoolCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const clusters = [
    "인공지능·공학",
    "바이오·메디컬",
    "문화 콘텐츠·디자인",
    "경제·금융 비즈니스",
    "사회서비스·교육",
    "기초과학·연구"
  ];

  // 실시간 Supabase DB 학교명 검색
  useEffect(() => {
    if (!school.trim() || isSchoolConfirmed) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const { data, error } = await supabase
          .from("schools")
          .select("school_code, name, region, level")
          .ilike("name", `%${school.trim()}%`)
          .limit(15);

        if (!error && data) {
          setSearchResults(data);
        } else {
          console.error("Supabase school search error:", error);
          setSearchResults([]);
        }
      } catch (e) {
        console.error("Failed to fetch schools:", e);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [school, isSchoolConfirmed]);

  const handleSelectSchool = (item: SchoolItem) => {
    setSchool(item.name);
    setIsSchoolConfirmed(true);
    setConfirmedSchoolCode(item.school_code || null);
    setSearchResults([]);
    setErrorMsg("");
  };

  const handleSchoolInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSchool(e.target.value);
    setIsSchoolConfirmed(false);
    setConfirmedSchoolCode(null);
    setErrorMsg("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("학생 이름을 입력해 주세요.");
      return;
    }
    if (!isSchoolConfirmed) {
      setErrorMsg("❌ 학교명은 마음대로 입력할 수 없습니다. 검색된 Supabase 공식 학교 목록 중 하나를 터치(클릭)하여 정확한 학교명을 연동해 주세요.");
      return;
    }

    // 신규 학생 깨끗한 초기 상태 보존 및 학교 정보 프로필 기록
    localStorage.setItem("readycareer_student_name", name.trim());
    localStorage.setItem("readycareer_student_school", school);
    if (confirmedSchoolCode) {
      localStorage.setItem("readycareer_student_school_code", confirmedSchoolCode);
    }
    localStorage.setItem("readycareer_student_grade", grade);
    localStorage.setItem("readycareer_student_cluster", targetCluster);

    // 신규 온보딩 시 과거 시연 데이터 클린 초기화 (0점 진단 출발 보증)
    localStorage.removeItem("my_star_roadmap");
    localStorage.removeItem("my_habits_v2");
    localStorage.removeItem("readycareer_student_activities_v1");

    if (session) {
      startExpoDemo("student", {
        ...session,
        name: name.trim(),
        school: school,
        schoolCode: confirmedSchoolCode || "STUDENT-CUSTOM",
        grade: parseInt(grade.replace(/[^0-9]/g, "")) || 1,
        targetJob: "진로 탐색 중",
        riasecCode: "미진단",
      });
    }

    navigate("/self-understanding?onboarding=true");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 flex flex-col gap-8">
      {/* Step Indicator Banner */}
      <div className="flex items-center justify-between bg-surface-container px-6 py-3 rounded-full border border-surface-variant/30">
        <span className="font-headline font-extrabold text-primary text-label-lg flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-secondary-spot" />
          온보딩 2/3: 기본 정보 설정
        </span>
        <span className="text-label-sm text-text-muted">학교 및 관심분야</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left Col: Mascot & Encouragement */}
        <div className="md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left gap-4">
          <MascotAri pose="sticker" size="lg" />
          <h2 className="text-headline-md font-headline font-bold text-text-primary">
            반가워요! 내 정보를 확인해 볼까요?
          </h2>
          <p className="text-body-md text-text-muted leading-relaxed text-sm">
            입력한 정보는 맞춤형 진로 포트폴리오 및 학생부 활동 추천 알고리즘의 기초 데이터로 활용됩니다.<br />
            <strong>⚠️ 학교명은 임의 기입을 방지하기 위해 Supabase 명단에서 직접 선택해 주세요.</strong>
          </p>
          <div className="hidden md:block w-full">
            <MascotAri
              pose="avatar"
              size="sm"
              bubbleTitle="AI 맞춤 추천"
              bubbleMessage="관심 진로 분야는 언제든 로드맵에서 자유롭게 변경할 수 있어요!"
            />
          </div>
        </div>

        {/* Right Col: Info Form */}
        <Card variant="activity" padding="lg" className="md:col-span-2 w-full shadow-3d-ambient relative overflow-visible">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
              label="이름 (학생명)"
              placeholder="예: 홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="w-5 h-5 text-primary" />}
              required
            />

            {/* Supabase School Realtime Autocomplete Field */}
            <div className="flex flex-col gap-2 relative">
              <label className="font-headline font-semibold text-label-lg text-text-primary px-1 flex items-center justify-between">
                <span>학교명 (Supabase 명단 선택 필수)</span>
                {isSchoolConfirmed ? (
                  <span className="inline-flex items-center gap-1 text-xs text-teal-700 font-bold bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>공식 명단 연동 완료</span>
                  </span>
                ) : (
                  <span className="text-xs text-secondary-spot font-extrabold">● 목록 클릭 필수 (자유입력 불가)</span>
                )}
              </label>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="예: 구로 (학교 이름을 입력하면 하단에 명단이 나타납니다)"
                  value={school}
                  onChange={handleSchoolInputChange}
                  className={`w-full px-4 py-3.5 rounded-2xl border-2 transition-all duration-200 pl-11 text-sm font-bold placeholder:font-normal focus:outline-none ${
                    isSchoolConfirmed
                      ? "bg-teal-50/50 border-teal-500 text-teal-950 shadow-sm"
                      : "bg-surface-container-low border-surface-variant focus:border-primary focus:bg-white focus:shadow-md text-text-primary"
                  }`}
                  required
                />
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                  {isSearching ? (
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  ) : (
                    <School className={`w-5 h-5 ${isSchoolConfirmed ? "text-teal-600" : "text-secondary-spot"}`} />
                  )}
                </div>
              </div>

              {/* 검색 상태 및 에러 메시지 알림 바 */}
              {errorMsg && !isSchoolConfirmed && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold flex items-center gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* 검색어는 입력되었으나 선택하지 않은 상태에서 결과 드롭다운 표시 */}
              {!isSchoolConfirmed && school.trim().length > 0 && (
                <div className="absolute top-20 left-0 right-0 z-50 bg-white rounded-2xl border-2 border-primary/40 shadow-[0_15px_35px_rgba(0,105,112,0.15)] max-h-60 overflow-y-auto overflow-x-hidden divide-y divide-slate-100 animate-fadeIn">
                  {isSearching ? (
                    <div className="p-4 text-center text-xs font-extrabold text-primary flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span>Supabase DB에서 학교 명단 검색 중...</span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="p-1">
                      <div className="px-3 py-1.5 bg-surface-container-low text-[11px] font-black text-text-muted rounded-lg m-1">
                        👇 우리 학교를 명단에서 터치하여 등록하세요
                      </div>
                      {searchResults.map((item, index) => (
                        <button
                          key={item.school_code || index}
                          type="button"
                          onClick={() => handleSelectSchool(item)}
                          className="w-full text-left p-3 hover:bg-teal-50/70 active:bg-teal-100 transition-colors flex items-center justify-between group rounded-xl my-0.5"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-black text-xs group-hover:bg-teal-600 group-hover:text-white transition-colors">
                              {item.level ? item.level : "🏫"}
                            </span>
                            <div>
                              <div className="font-extrabold text-xs sm:text-sm text-slate-800 group-hover:text-teal-900 transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[11px] font-semibold text-slate-500">
                                {item.region || "전국 공식 학교"} {item.school_code ? `(#${item.school_code})` : ""}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-teal-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-teal-100/80 px-2 py-1 rounded-md">
                            선택 완료 ✔
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center space-y-1.5 text-slate-600">
                      <p className="text-xs font-extrabold text-red-600">
                        "{school}"에 해당하는 학교 명단을 찾을 수 없습니다.
                      </p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        • 약칭 대신 공식 학교명(예: 구로중학교, 구로고등학교)을 입력해 주세요.<br />
                        • 마음대로 학교명을 칠 경우 추후 선생님 관리자와 연결되지 않으므로 목록 선택이 필수입니다.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Grade Selector */}
            <div className="flex flex-col gap-2 pt-1">
              <label className="font-headline font-semibold text-label-lg text-text-primary px-1">
                학년 선택
              </label>
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {["1학년", "2학년", "3학년"].map((g) => (
                  <Chip
                    key={g}
                    type="button"
                    active={grade === g}
                    onClick={() => setGrade(g)}
                    className="flex-1 text-center py-3"
                  >
                    {g}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Career Cluster Selector */}
            <div className="flex flex-col gap-2">
              <label className="font-headline font-semibold text-label-lg text-text-primary px-1 flex items-center justify-between">
                <span>관심 진로 융합군 (1개 필수 선택)</span>
                <span className="text-[11px] text-secondary-spot font-bold">● 추천 순도 상승</span>
              </label>
              <div className="flex flex-wrap gap-2.5 mt-1">
                {clusters.map((cl) => (
                  <Chip
                    key={cl}
                    type="button"
                    active={targetCluster === cl}
                    variant={targetCluster === cl ? "default" : "teal"}
                    onClick={() => setTargetCluster(cl)}
                  >
                    {cl}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-surface-variant/30 flex justify-end gap-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                icon={<ArrowRight className="w-5 h-5" />}
              >
                ReadyCareer AI 시작하기
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
