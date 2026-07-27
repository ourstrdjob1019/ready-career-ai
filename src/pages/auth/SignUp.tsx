import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card } from "../../components";
import { useAuth } from "../../context";
import type { UserRole } from "../../context";
import { UserPlus, School, KeyRound, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface SchoolItem {
  school_code?: string;
  name: string;
  region?: string;
  level?: string;
}

export const SignUp: React.FC = () => {
  const [role, setRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  
  // Supabase 실시간 학교 검색 상태
  const [schoolInput, setSchoolInput] = useState("");
  const [searchResults, setSearchResults] = useState<SchoolItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSchoolConfirmed, setIsSchoolConfirmed] = useState(false);
  const [confirmedSchoolCode, setConfirmedSchoolCode] = useState("SEOUL-701");
  const [confirmedSchoolName, setConfirmedSchoolName] = useState("서울창의고등학교");

  const [inviteCode, setInviteCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { register, signupOpen } = useAuth();
  const navigate = useNavigate();

  // Supabase 학교 검색 효과
  useEffect(() => {
    if (!schoolInput.trim() || isSchoolConfirmed) {
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
          .ilike("name", `%${schoolInput.trim()}%`)
          .limit(15);

        if (!error && data) {
          setSearchResults(data);
        } else {
          setSearchResults([]);
        }
      } catch (e) {
        console.error(e);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [schoolInput, isSchoolConfirmed]);

  const handleSelectSchool = (item: SchoolItem) => {
    setSchoolInput(item.name);
    setIsSchoolConfirmed(true);
    setConfirmedSchoolCode(item.school_code || "OFFICIAL-CODE");
    setConfirmedSchoolName(item.name);
    setSearchResults([]);
    setErrorMsg("");
  };

  const handleSchoolInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSchoolInput(e.target.value);
    setIsSchoolConfirmed(false);
    setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !name) {
      setErrorMsg("이메일과 실명을 정확하게 입력해 주세요.");
      return;
    }

    if (!isSchoolConfirmed || !schoolInput.trim()) {
      setErrorMsg("❌ 학교는 임의로 작성할 수 없습니다. 검색된 Supabase 공식 학교 명단 중 정확한 학교를 터치하여 선택해 주세요.");
      return;
    }

    if (!inviteCode.trim()) {
      setErrorMsg("슈퍼관리자 또는 담임 선생님으로부터 받은 B2B 초대코드를 입력해야 합니다.");
      return;
    }

    const res = await register(name, email, role, confirmedSchoolName, confirmedSchoolCode, inviteCode);
    if (res.success) {
      setSuccessMsg("🎉 학교 마스터코드 승인 및 회원가입이 100% 성공했습니다!");
      
      // 신규 가입 학생 초기화 (0점 출발)
      localStorage.setItem("readycareer_student_name", name.trim());
      localStorage.setItem("readycareer_student_school", confirmedSchoolName);
      localStorage.removeItem("my_star_roadmap");
      localStorage.removeItem("my_habits_v2");
      localStorage.removeItem("readycareer_student_activities_v1");

      setTimeout(() => {
        navigate(role === "teacher" ? "/teacher" : "/");
      }, 1000);
    } else {
      setErrorMsg(res.message || "회원가입에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10 bg-surface">
      <div className="max-w-md w-full space-y-6">

        {/* Title */}
        <div className="text-center space-y-2">
          <Link to="/start" className="text-xs font-bold text-text-muted hover:text-primary transition-colors block">
            &larr; 스타트(체험) 화면으로 돌아가기
          </Link>
          <h1 className="text-3xl font-headline font-black text-text-primary tracking-tight">
            학교 승인코드 신규가입
          </h1>
          <p className="text-xs text-text-muted font-body-md">
            Supabase 공식 학교 명단에서 학교를 자동 검색하여 터치 선택하고 발급된 <strong>초대코드</strong>를 입력하세요. (자유입력 차단)
          </p>
        </div>

        {!signupOpen ? (
          <Card variant="hero" padding="md" className="bg-error-container/20 border border-error/40 text-center py-8 space-y-4">
            <AlertCircle className="w-12 h-12 text-error mx-auto animate-bounce" />
            <h3 className="font-headline font-black text-lg text-text-primary">현재 회원가입 기간이 마감되었습니다</h3>
            <p className="text-xs text-text-muted">
              AI 서버리스 API 사용량 통제 정책(B2B)에 따라 현재 <strong>슈퍼관리자</strong>가 정식 가입 기간을 마감했습니다.<br />
              박람회 방문객이시라면 [스타트 체험 화면]에서 1초 체험 버튼을 클릭해 주세요!
            </p>
            <Link to="/start">
              <Button variant="primary" size="md" fullWidth>
                🎪 박람회 1초 체험 화면으로 즉시 이동
              </Button>
            </Link>
          </Card>
        ) : (
          <Card variant="surface" padding="lg" className="border border-surface-variant/50 shadow-3d-base relative overflow-visible">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Role Selection */}
              <div className="space-y-2">
                <span className="text-xs font-headline font-bold text-text-muted block">가입 계정 역할 선택</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={`p-3 rounded-2xl font-headline font-extrabold text-xs flex items-center justify-center gap-2 border transition-all ${role === "student"
                        ? "bg-primary text-on-primary border-primary shadow-sm"
                        : "bg-surface-container-low text-text-muted border-surface-variant/40 hover:bg-surface-container"
                      }`}
                  >
                    <span>🧑‍🎓 학생 계정</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("teacher")}
                    className={`p-3 rounded-2xl font-headline font-extrabold text-xs flex items-center justify-center gap-2 border transition-all ${role === "teacher"
                        ? "bg-secondary text-white border-secondary shadow-sm"
                        : "bg-surface-container-low text-text-muted border-surface-variant/40 hover:bg-surface-container"
                      }`}
                  >
                    <span>👨‍🏫 학교관리자(교직원)</span>
                  </button>
                </div>
              </div>

              {/* Realtime Supabase School Code Selection (NO FREE INPUT per §5.1) */}
              <div className="space-y-2 relative">
                <label className="text-xs font-headline font-bold text-text-primary flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><School className="w-3.5 h-3.5 text-primary" /> 소속 학교 검색 및 필수 선택</span>
                  {isSchoolConfirmed ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-teal-700 font-extrabold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>공식 명단 연계 완료</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-error font-black">자유입력 금지 (명단 클릭 필수)</span>
                  )}
                </label>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="예: 구로 (학교명을 2자 이상 입력해 주세요)"
                    value={schoolInput}
                    onChange={handleSchoolInputChange}
                    className={`w-full px-4 py-3 rounded-2xl border-2 text-sm font-bold placeholder:font-normal focus:outline-none transition-all pl-11 ${
                      isSchoolConfirmed
                        ? "bg-teal-50/60 border-teal-500 text-teal-950 shadow-inner"
                        : "bg-surface-container-lowest border-surface-variant focus:border-primary focus:bg-white focus:shadow-md text-text-primary"
                    }`}
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                    {isSearching ? (
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    ) : (
                      <School className={`w-5 h-5 ${isSchoolConfirmed ? "text-teal-600" : "text-primary"}`} />
                    )}
                  </div>
                </div>

                {!isSchoolConfirmed && schoolInput.trim().length > 0 && (
                  <div className="absolute top-16 left-0 right-0 z-50 bg-white rounded-2xl border-2 border-primary/50 shadow-[0_10px_30px_rgba(0,0,0,0.18)] max-h-56 overflow-y-auto overflow-x-hidden divide-y divide-slate-100 animate-fadeIn">
                    {isSearching ? (
                      <div className="p-3 text-center text-xs font-bold text-primary flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Supabase DB 실시간 검색 중...</span>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="p-1">
                        <div className="px-3 py-1 bg-slate-100 text-[10px] font-black text-slate-600 rounded-md m-1">
                          👇 하단 학교 리스트에서 우리 학교를 클릭하세요!
                        </div>
                        {searchResults.map((item, index) => (
                          <button
                            key={item.school_code || index}
                            type="button"
                            onClick={() => handleSelectSchool(item)}
                            className="w-full text-left p-2.5 hover:bg-teal-50/80 active:bg-teal-100 transition-colors flex items-center justify-between group rounded-xl my-0.5"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-black text-[11px] group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                {item.level ? item.level : "🏫"}
                              </span>
                              <div>
                                <div className="font-extrabold text-xs text-slate-800 group-hover:text-teal-900 transition-colors">
                                  {item.name}
                                </div>
                                <div className="text-[10px] font-semibold text-slate-500">
                                  {item.region || "전국 공식 학교"} {item.school_code ? `(#${item.school_code})` : ""}
                                </div>
                              </div>
                            </div>
                            <span className="text-[11px] font-bold text-teal-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-teal-100 px-2 py-0.5 rounded">
                              선택 ✔
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 text-center text-xs text-red-600 font-extrabold">
                        "{schoolInput}"에 해당하는 학교를 찾을 수 없습니다.<br />
                        <span className="text-[10px] text-slate-500 font-normal">공식 학교명을 끝까지(예: OO고등학교) 입력해 보세요.</span>
                      </div>
                    )}
                  </div>
                )}
                <p className="text-[11px] text-text-muted">💡 나이스(NEIS) 교육정보 및 Supabase DB에 등록된 정식 학교만 연동 가능합니다.</p>
              </div>

              {/* Name & Email */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-headline font-bold text-text-primary block mb-1">실명 (또는 학교 사용 닉네임)</label>
                  <input
                    type="text"
                    placeholder="예: 김수진"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface-container-lowest border border-surface-variant/50 rounded-2xl text-sm focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-headline font-bold text-text-primary block mb-1">학교 이메일 또는 구글 ID</label>
                  <input
                    type="email"
                    placeholder="student@seoul-high.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface-container-lowest border border-surface-variant/50 rounded-2xl text-sm focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Invite Code Input Gate */}
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-headline font-bold text-text-primary flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-secondary-spot"><KeyRound className="w-3.5 h-3.5" /> 초대코드 (Invite Code) 필수</span>
                  <button
                    type="button"
                    onClick={() => setInviteCode(role === "teacher" ? "TEACHER-SEOUL" : "EXPO-2026")}
                    className="text-[11px] font-black text-secondary underline"
                  >
                    데모 코드 자동 채우기 &rarr;
                  </button>
                </label>
                <input
                  type="text"
                  placeholder="예: EXPO-2026 또는 T-VIP-900"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="w-full px-4 py-2.5 bg-secondary/5 border-2 border-secondary/40 rounded-2xl text-sm text-secondary font-headline font-black uppercase placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-secondary text-center tracking-widest shadow-sm"
                />
              </div>

              {/* Messages */}
              {errorMsg && (
                <div className="p-3 bg-error-container/20 border border-error/30 rounded-xl text-xs text-error font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-primary/10 border border-primary/30 rounded-xl text-xs text-primary font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <Button
                variant="teal"
                size="lg"
                fullWidth
                type="submit"
                icon={<UserPlus className="w-5 h-5" />}
                className="font-headline font-extrabold py-4 mt-2 shadow-md"
              >
                학교 코드 검증 후 30초 회원가입 완료
              </Button>
            </form>
          </Card>
        )}

        <div className="text-center">
          <span className="text-xs text-text-muted">이미 학교 코드로 등록하셨나요? </span>
          <Link to="/login" className="text-xs font-bold text-primary underline ml-1">
            로그인 화면 이동
          </Link>
        </div>

      </div>
    </div>
  );
};
