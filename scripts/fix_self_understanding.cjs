const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/pages/self/SelfUnderstanding.tsx');
let content = fs.readFileSync(targetPath, 'utf8');

const startStr1 = 'const defaultTests: DiagnosticTest[] = [';
const endStr1 = 'setTests(defaultTests);';

const startIndex1 = content.indexOf(startStr1);
const endIndex1 = content.indexOf(endStr1);

const newDefaultTests = `const defaultTests: DiagnosticTest[] = [
        {
          id: "test-riasec",
          title: "K-RIASEC 진로흥미검사",
          category: "흥미/성향",
          timeEst: "약 3분 소요",
          desc: "가입 시 완료한 진단입니다. 홀랜드 6대 성형 이론을 현대 인공지능 산업 역량과 결합하여 나의 최적 진로 무드를 분석합니다.",
          status: "completed",
          resultType: "나의 진로 흥미 유형",
          scoreSummary: "내 프로필 결과 보기",
          reportDetails: {
            summary: "가입 시 진행한 진로흥미검사 결과가 반영되어 있습니다. 메인 대시보드와 로드맵에서 나만의 추천 직업을 훈련 중입니다.",
            scores: [],
            recommendedActivities: [],
            aiCareerComment: \`입사관이 가장 먼저 확인하는 기본 성향으로, **'\${targetJobName}'** 성장에 훌륭한 밑거름이 됩니다.\`
          }
        },
        {
          id: "test-multiple-intelligences",
          title: "다중지능 강점 프로파일",
          category: "지능/강점",
          timeEst: "약 4분 소요 (32문항)",
          desc: "하워드 가드너의 다중지능 이론을 기반으로, 내가 타고난 8가지 지능 중 가장 뛰어난 마스터 역량을 발굴합니다.",
          status: "pending",
          reportDetails: { summary: "", scores: [], recommendedActivities: [], aiCareerComment: "" }
        },
        {
          id: "test-growth-mindset",
          title: "성장 마인드셋 프로파일",
          category: "심리/태도",
          timeEst: "약 3분 소요 (32문항)",
          desc: "어려운 문제에 직면했을 때 나의 뇌가 어떻게 반응하는지, 도전을 성장의 기회로 삼는 마인드셋 지수를 진단합니다.",
          status: "pending",
          reportDetails: { summary: "", scores: [], recommendedActivities: [], aiCareerComment: "" }
        },
        {
          id: "test-via-strengths",
          title: "VIA 성격강점 자기이해",
          category: "인성/성격",
          timeEst: "약 4분 소요 (36문항)",
          desc: "긍정심리학 기반 24개 핵심 강점 중, 나를 가장 나답고 빛나게 만드는 대표 성격 강점 5가지를 도출합니다.",
          status: "pending",
          reportDetails: { summary: "", scores: [], recommendedActivities: [], aiCareerComment: "" }
        },
        {
          id: "test-time-management",
          title: "시간관리 역량 프로파일",
          category: "학업/역량",
          timeEst: "약 3분 소요 (32문항)",
          desc: "목표 설정부터 우선순위 파악, 실행 및 통제까지 나의 시간을 주도적으로 지배하고 있는지를 평가합니다.",
          status: "pending",
          reportDetails: { summary: "", scores: [], recommendedActivities: [], aiCareerComment: "" }
        },
        {
          id: "test-ai-literacy",
          title: "AI 디지털 리터러시 진단",
          category: "미래/기술",
          timeEst: "약 3분 소요 (30문항)",
          desc: "인공지능 도구를 얼마나 친숙하게 다루고 기술의 한계와 윤리를 올바르게 이해하고 있는지 현대적 AI 수용도를 측정합니다.",
          status: "pending",
          reportDetails: { summary: "", scores: [], recommendedActivities: [], aiCareerComment: "" }
        },
        {
          id: "test-resilience",
          title: "회복탄력성 프로파일",
          category: "심리/태도",
          timeEst: "약 3분 소요 (30문항)",
          desc: "스트레스 상황이나 역경을 마주했을 때 꺾이지 않고 다시 튀어오르는 내면의 멘탈 방어력과 긍정성을 측정합니다.",
          status: "pending",
          reportDetails: { summary: "", scores: [], recommendedActivities: [], aiCareerComment: "" }
        },
        {
          id: "test-career-maturity",
          title: "진로성숙도 프로파일",
          category: "진로/탐색",
          timeEst: "약 3분 소요 (32문항)",
          desc: "자신의 미래 직업에 대해 얼마나 확신을 갖고 주도적으로 탐색 및 준비하고 있는지 종합적인 성숙도를 진단합니다.",
          status: "pending",
          reportDetails: { summary: "", scores: [], recommendedActivities: [], aiCareerComment: "" }
        }
      ];
      
      `;

content = content.substring(0, startIndex1) + newDefaultTests + content.substring(endIndex1);

const startStr2 = 'const handleTakeTest = (test: DiagnosticTest) => {';
const endStr2 = 'const handleAnswerQuickTest = () => {';

const startIndex2 = content.indexOf(startStr2);
const endIndex2 = content.indexOf(endStr2);

const newHandleTakeTest = `const handleTakeTest = (test: DiagnosticTest) => {
    if (test.status === "completed") {
      alert("이미 완료한 검사입니다!");
      return;
    }
    navigate(\`/diagnostics/\${test.id.replace('test-', '')}\`);
  };

  const handleStartOrRetakeTest = (test: DiagnosticTest, isRetake = false) => {
    if (isRetake && !window.confirm(\`'\${test.title}' 검사를 초기화하고 다시 재검사를 진행하시겠습니까?\`)) {
      return;
    }
    if (test.status === "completed" && !isRetake) {
      alert("이미 완료된 검사입니다. 리포트를 확인해주세요!");
      return;
    }
    handleTakeTest(test);
  };

  // 쾌속 즉석 진단 답변 선택 및 완료 처리 (legacy)
  `;

content = content.substring(0, startIndex2) + newHandleTakeTest + content.substring(endIndex2);

fs.writeFileSync(targetPath, content);
console.log('Fixed SelfUnderstanding.tsx properly!');
