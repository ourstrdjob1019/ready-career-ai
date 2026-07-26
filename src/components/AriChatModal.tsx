import React, { useState } from "react";
import { ARI_BLOB_URL } from "../assets/mascotData";
import { Sparkles, X, Send, BookOpen, ChevronRight } from "lucide-react";

interface AriChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: "user" | "ari";
  text: string;
  card?: {
    tag: string;
    title: string;
    point1Title: string;
    point1Desc: string;
    point2Title: string;
    point2Desc: string;
  };
}

export const AriChatModal: React.FC<AriChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-1",
      sender: "ari",
      text: "반가워요! ReadyCareer AI 진로 어시스턴트 아리(Ari)예요. 당신의 생기부 역량과 관심사를 분석해서 가장 잘 어울리는 맞춤 솔루션을 제안해 드릴게요.",
    },
    {
      id: "m-2",
      sender: "user",
      text: "나한테 어울리는 전공이랑 퀘스트를 추천해줘!",
    },
    {
      id: "m-3",
      sender: "ari",
      text: "최근 완성한 자기이해 다중진단 데이터와 흥미 유형을 바탕으로 분석해 본 추천 학과와 학습 로드맵입니다!",
      card: {
        tag: "AI 맞춤 추천 학과",
        title: "컴퓨터·AI 융합공학과",
        point1Title: "AI 진단 매칭 포인트",
        point1Desc: "상위 1.8%의 AI 알고리즘 공간 직관력과 논리적 사고력, 문제 해결 역량이 매우 뛰어납니다.",
        point2Title: "핵심 추천 진로",
        point2Desc: "스마트 AI 에듀테크 멘토, 융합 로보틱스 엔지니어, 데이터 사이언티스트",
      },
    },
  ]);
  const [input, setInput] = useState("");

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg: Message = { id: `m-${Date.now()}`, sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `m-${Date.now() + 1}`,
          sender: "ari",
          text: "학생의 답변을 2026 교육부 생기부 기재요령 가이드에 맞추어 포트폴리오 및 생활기록부 심화 세특 초안에 실시간 동기화했습니다! 밤하늘 별자리 로드맵에서 새 퀘스트를 확인해보세요.",
        },
      ]);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1a1626]/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#fbf8ff] w-full max-w-3xl h-[85vh] max-h-[750px] rounded-[32px] border border-white/60 shadow-[0_30px_60px_rgba(123,92,240,0.2)] flex flex-col overflow-hidden relative">
        
        {/* Header - Stitch Soft Minimalism */}
        <div className="bg-white/80 backdrop-blur-xl px-6 py-4 border-b border-[#E3E1E9] flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#cbbeff] bg-white p-0.5 shadow-md flex items-center justify-center">
              <img src={ARI_BLOB_URL} alt="Ari Mascot" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 bg-[#7af1fc]/30 text-[#006970] px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide mb-0.5 whitespace-nowrap border border-[#006970]/20">
                <Sparkles className="w-3 h-3" />
                <span>AI CAREER ASSISTANT</span>
              </div>
              <h2 className="text-xl font-extrabold text-[#1A1626] tracking-tight flex items-center gap-1.5">
                아리에게 묻기 <span className="text-xs text-[#7B5CF0] font-normal">(실시간 상담)</span>
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#efedf5] text-[#484554] hover:bg-[#ffdad6] hover:text-[#ba1a1a] transition-colors flex items-center justify-center focus:outline-none shadow-inner"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[radial-gradient(at_0%_0%,rgba(123,92,240,0.05)_0px,transparent_50%),radial-gradient(at_100%_100%,rgba(0,105,112,0.05)_0px,transparent_50%)]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 items-start ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              } transition-all duration-300`}
            >
              {msg.sender === "ari" && (
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#cbbeff] bg-white flex-shrink-0 shadow-sm mt-1 p-0.5">
                  <img src={ARI_BLOB_URL} alt="Ari" className="w-full h-full object-contain" />
                </div>
              )}
              <div className={`max-w-[82%] space-y-3 ${msg.sender === "user" ? "items-end" : ""}`}>
                <div
                  className={`px-5 py-4 rounded-[26px] shadow-sm font-body-md text-sm sm:text-base leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-[#8E70F7] to-[#6240d5] text-white rounded-tr-sm font-medium shadow-md"
                      : "bg-white border border-[#E3E1E9] text-[#1A1626] rounded-tl-sm shadow-[0_10px_25px_rgba(123,92,240,0.06)]"
                  }`}
                >
                  {msg.text}
                </div>

                {/* Optional Stitch Card Attachment */}
                {msg.card && (
                  <div className="bg-white rounded-[24px] p-6 border border-[#E3E1E9] shadow-[0_15px_35px_rgba(123,92,240,0.1)] space-y-5 transform transition hover:scale-[1.01]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#e6deff] flex items-center justify-center text-[#6240d5] shadow-inner font-black text-xl">
                        💡
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#6240d5] uppercase tracking-wider block">
                          {msg.card.tag}
                        </span>
                        <h3 className="text-lg font-extrabold text-[#1A1626]">{msg.card.title}</h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-4 rounded-2xl bg-[#f4f2fa] border border-[#cac4d7]/40 space-y-1">
                        <p className="text-[11px] font-extrabold text-[#7B5CF0]">{msg.card.point1Title}</p>
                        <p className="text-xs text-[#1A1626] leading-relaxed font-medium">{msg.card.point1Desc}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-[#f4f2fa] border border-[#cac4d7]/40 space-y-1">
                        <p className="text-[11px] font-extrabold text-[#006970]">{msg.card.point2Title}</p>
                        <p className="text-xs text-[#1A1626] leading-relaxed font-medium">{msg.card.point2Desc}</p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#7B5CF0]/10 to-[#006970]/10 border border-[#7B5CF0]/20 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1A1626] flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-[#7B5CF0]" />
                        <span>생기부 및 별자리 로드맵에 반영하기</span>
                      </span>
                      <button className="text-xs bg-[#7B5CF0] text-white font-extrabold px-3 py-1.5 rounded-full shadow-md flex items-center gap-0.5 hover:bg-[#6240d5]">
                        <span>즉시 연결</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-[#E3E1E9] flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="아리에게 학과 추천, 생기부 가이드나 퀘스트를 물어보세요..."
            className="flex-1 bg-[#f4f2fa] border border-[#cac4d7]/40 rounded-full px-6 py-3.5 text-sm text-[#1A1626] placeholder-[#6E6A80] focus:outline-none focus:border-[#7B5CF0] focus:ring-2 focus:ring-[#7B5CF0]/20 font-body-md transition-all"
          />
          <button
            type="submit"
            className="w-12 h-12 rounded-full bg-[#7B5CF0] hover:bg-[#6240d5] text-white flex items-center justify-center shadow-lg transform hover:scale-105 transition-all flex-shrink-0"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AriChatModal;
