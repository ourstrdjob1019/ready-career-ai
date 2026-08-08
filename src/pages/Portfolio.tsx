import React, { useState, useEffect } from "react";
import { useAuth } from "../context";
import { executeAiPrompt } from "../services/aiService";
import { ARI_BLOB_URL } from "../assets/mascotData";
import { rewardXP } from "../services/expService";
import {
  Sparkles,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Calendar,
  Image as ImageIcon,
  X,
  Save,
  Trophy,
  Filter
} from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  dateRange: string;
  content: string;
  tags: string[];
  aiFeedback?: string;
  photoUrl?: string;
  isSelfReport?: boolean;
}

// AI ë§ì¶¤ ì§„ë¡œ ?œë™ ?¤ì–‘??ì¶”ì²œ ?€ (?ˆë¡œê³ ì¹¨ ??ë¡œí…Œ?´ì…˜)
const RECOMMENDED_POOLS = [
  [
    {
      title: "KAIST AI ?Œí”„?¸ì›¨???°í•™ ?µí•© ë©”ê????„ì „",
      category: "?™ì•„ë¦?·ì??(ì°½ì‘)",
      dateRange: "2026.05.01 ~ 2026.06.15",
      content: "?€???¸ê³µì§€???°êµ¬??ë©˜í† ë§ì„ ?µí•´ ?¤í”ˆ?ŒìŠ¤ ? ê²½ë§?ê¸°ë°˜ ?¬íšŒë¬¸ì œ ?´ê²° ?„ë¡œ?íŠ¸ ?„í‚¤?ì²˜ë¥?êµ¬ì¶•?˜ê³  ?œì œ?ˆì„ ì¶œí’ˆ??",
      tags: ["?°í•™?‘ë ¥", "AI?´ì»¤??, "?„ë¡œ?íŠ¸?„í‚¤?ì²˜"],
      aiFeedback: "?€???°êµ¬ì§„ê³¼???µí•© ?êµ¬ ?˜ì?ê°€ ê°•ì¡°?˜ë©° ?™ì—… ?±ê²© ë°??‘ì—… ë¦¬ë”???‰ê??ì„œ ê·¹ë‹¨?ì¸ ?ŒëŸ¬???”ì¸?¼ë¡œ ?‘ìš©?©ë‹ˆ??"
    },
    {
      title: "êµ??ê³µì¸ ADsP (?°ì´?°ë¶„??ì¤€?„ë¬¸ê°€) ?ê²©ì¦?ì·¨ë“",
      category: "?… ?ê²©ì¦?,
      dateRange: "2026.04.01 ~ 2026.05.20",
      content: "ë¹…ë°?´í„° ê°€ê³??µê³„ ?´ë¡ ê³?R/Python ?°ì´??ëª¨ë¸ë§??™ìŠµ??50?¼ê°„ ë§¤ì§„?˜ì—¬ ?°ì´??ë¶„ì„ ê³µì¸ ?ê²©ì¦ì„ ê³ ë“?ìœ¼ë¡?ì·¨ë“??",
      tags: ["êµ??ê³µì¸?ê²©ì¦?, "ADsP", "ë¹…ë°?´í„°ê³µìœ "],
      aiFeedback: "ê³ êµ?ìœ¼ë¡œì„œ ?¤ì¦???µê³„ ?°ì´??ê²€ì¦??„ë¬¸?±ì„ ?ë“?ˆë‹¤???•ê³ ??ì§„ë¡œ ?„ë¬¸??ì§€?œì…?ˆë‹¤!"
    },
    {
      title: "ESG ì¹œí™˜ê²??„ì†Œ ?ì›?œí™˜ ? ì†Œ???„ì´?”ì–´ ê³µëª¨??,
      category: "ì§„í•™Â·?êµ¬ (êµê³¼)",
      dateRange: "2026.05.15 ~ 2026.07.10",
      content: "ê¸°í›„?„ê¸°ë¥?ê·¹ë³µ?˜ê¸° ?„í•œ ë¯¸ìƒë¬??Œë¼???µí•© ? ì¬???”í•©ë¬??œê°??ê¸°íš?œë? ?‘ì„±?˜ì—¬ ?™ìˆ  ?Œë…„ ê³¼ì œ?„ì— ì¶œí’ˆ??",
      tags: ["ESG?„ì†Œì¤‘ë¦½", "? ì†Œ?¬ê³µ??, "?µí•©?¬ê³ ??],
      aiFeedback: "?¬íšŒ???„ì•ˆ(ESG)??ê³¼í•™ê³µí•™??ì§€?ìœ¼ë¡?êµ¬ì²´?”í•œ ?êµ¬ë¡? êµê³¼ ?¸ë??¥ë ¥ ë°??¹ê¸°?¬í•­???¸ìš©?˜ê¸° ?Œë??©ë‹ˆ??"
    }
  ],
  [
    {
      title: "êµ¬ê? ?ì„œ?Œë¡œ??TensorFlow) ?¥ëŸ¬???„ë¬¸ê°€ ê³¼ì • ?˜ë£Œ",
      category: "?… ?ê²©ì¦?,
      dateRange: "2026.03.10 ~ 2026.06.25",
      content: "ê¸€ë¡œë²Œ IT ê¶Œìœ„ ?¸ì¦??TensorFlow Developer ê³¼ì •???¨ë¼??ìº í¼?¤ë? ?µí•´ ?„ë‹´ 100% ?¤ë¬´ ì½”ë”© ?„ë¡œ?íŠ¸ë¡??„ìˆ˜??",
      tags: ["TensorFlow", "ê¸€ë¡œë²Œ?ê²©ì¦?, "AI?”ì??ˆì–´"],
      aiFeedback: "?¸ê³„ê°€ ?¸ì •?˜ëŠ” AI ?„ë ˆ?„ì›Œ???œì–´ ?¥ë ¥???´ìˆ˜?˜ì—¬ ?¸ê³µì§€??SW ?™ê³¼ ?™ì¢… ?œë¥˜ ?µê³¼ 1?œìœ„ ??Ÿ‰??ê°–ì·„?µë‹ˆ??"
    },
    {
      title: "êµë‚´ ?Œê³¼?™Â·ë¡œë³´í‹±???µí•© ?™ìˆ  ë°œì œ???€??,
      category: "?…ì„œÂ·?ˆìˆ ",
      dateRange: "2026.04.10 ~ 2026.06.05",
      content: "SF ê³ ì „ê³??Œê³¼???€??10ê¶Œì„ ?°ê³„ ë¶„ì„?˜ì—¬ ??ê¸°ê³„ ?µì‹ (BMI)??ì´ˆë˜??ë¯¸ë˜ ?¤ë¦¬ ê°•ë ¹ ?…ê±´?ˆì„ ?™ìˆ ì§€???¤ìŒ.",
      tags: ["?Œê³¼?™ìœµ??, "?™ìˆ ì§€ë°œì œ", "?¸ë¬¸ê³µí•™êµì–‘"],
      aiFeedback: "?´ê³µê³??¸ì¬ë¡œì„œ ë³´ê¸° ?œë¬¸ ì² í•™??ê¹Šì´?€ ë¬¸í•´?¥ì„ ë³´ìœ ?˜ê³  ?ˆìŒ???…ì‚¬ê´€?ê²Œ ?•ì‹¤??ê°ì¸?œí‚µ?ˆë‹¤."
    },
    {
      title: "ì²?†Œ??ê³¼í•™ì°½ì˜?€???€?œë?êµ?ì´ì¥??ë°??Œì´??êµìœ¡ ê¸°ë?",
      category: "?™ì•„ë¦?·ì??(ì°½ì‘)",
      dateRange: "2026.05.01 ~ 2026.07.28",
      content: "ì§€???„ë™?¼í„° ì´ˆë“±?™ìƒ?¤ì—ê²?AI ì½”ë”©ê³?ë¸”ë¡ ì½”ë”© ê¸°ì´ˆë¥?8ì£¼ê°„ ?¬ëŠ¥ ê¸°ë??˜ê³ , ê³µëª¨???¥ë ¤ ë³´ìƒ???¨ê»˜ ?±ì·¨??",
      tags: ["êµìœ¡ê¸°ë?ë´‰ì‚¬", "SWë©˜í† ë§?, "?¸ì„±?‰ê?ë§Œì "],
      aiFeedback: "ì§€???˜ëˆ”???¤ì²œ?˜ëŠ” ?°ëœ»???¸ì„± ??Ÿ‰ê³??•ì‹¤??ì£¼ë„???Œí†µ ë¦¬ë”??„ ?ê¸°ë¶€ ?‰íŠ¹???ìƒ?˜ê²Œ ê¸°ë¡?????ˆìŠµ?ˆë‹¤!"
    }
  ]
];

export const Portfolio: React.FC = () => {
  const { session } = useAuth();

  const targetJobName = localStorage.getItem("readycareer_target_job_name") || session?.targetJob || "ë¡œë´‡ê³µí•™??;
  const customAvatarUrl = localStorage.getItem("readycareer_custom_avatar_url") || ARI_BLOB_URL;

  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("?„ì²´ ë³´ê¸°");
  
  // ì¶”ì²œ ?œë™ ???íƒœ ë°??¨ê? ì²˜ë¦¬(Progressive Disclosure) ? ê?
  const [recPoolIdx, setRecPoolIdx] = useState(0);
  const [showRecPool, setShowRecPool] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  // ?¤ìŠ¤ë¡?ì§ì ‘ ?…ë ¥ (?œë™ ê¸°ë¡ ??& AI êµì •) ?íƒœ
  const [showInputForm, setShowInputForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState("ì§„í•™Â·?êµ¬ (êµê³¼)");
  const [customCategoryInput, setCustomCategoryInput] = useState("");
  const [startDate, setStartDate] = useState("2026-05-10");
  const [endDate, setEndDate] = useState("2026-07-28");
  const [formContent, setFormContent] = useState("");
  const [formTags, setFormTags] = useState("");
  const [uploadedPhoto, setUploadedPhoto] = useState<string | undefined>(undefined);
  const [isPhotoCompressing, setIsPhotoCompressing] = useState(false);
  const [isAiRefining, setIsAiRefining] = useState(false);

  // ëª¨ë‹¬ ?íƒœ (?ì„¸ë³´ê¸° ë·?ëª¨ë‹¬ & ?˜ì • ëª¨ë‹¬)
  const [viewingItem, setViewingItem] = useState<PortfolioItem | null>(null);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

  // ì´ˆê¸° ?¬íŠ¸?´ë¦¬??ë¶ˆëŸ¬?¤ê¸°
  useEffect(() => {
    const saved = localStorage.getItem("readycareer_portfolio_items_v2");
    if (saved) {
      try { setItems(JSON.parse(saved)); } catch (e) {}
    } else {
      const initial: PortfolioItem[] = [
        {
          id: "pf-101",
          title: "AI ë°?ê¸°ê³„?™ìŠµ ëª¨ë¸???µí•œ ë§ì¶¤??êµìœ¡ ê²©ì°¨ ?´ì†Œ ?°êµ¬",
          category: "ì§„í•™Â·?êµ¬ (êµê³¼)",
          dateRange: "2026.04.15 ~ 2026.06.28",
          content: "?¤ì–‘??ê³µê³µ ?™ìŠµ ?°ì´?°ì…‹???Œì´?¬ìœ¼ë¡?ê°€ê³µí•˜???€?Œë“ì¸??™ìƒ?¤ì˜ êµê³¼ ?±ì·¨ë¥??’ì´???ë™ ë§ì¶¤??ë©˜í† ë§?ì±—ë´‡ ?Œê³ ë¦¬ì¦˜ ê¸°íš?œë? êµë‚´ ?™ìˆ ?œì— ?œì¶œ??",
          tags: ["AIêµìœ¡?Œê³ ë¦¬ì¦˜", "?°ì´?°ë¶„??, "?¬íšŒ?ì•½?ë³´??],
          aiFeedback: "?˜ê³µê³??°ì´?°ì…‹ ?µí•© ?œìš©?™ì´?¼ëŠ” ê°ê????¤ì¦ ê·¼ê±° ?œì‹œê°€ ?°ìˆ˜?˜ë©° ?¸íŠ¹ ??Ÿ‰ ì¤?ê°€???’ì? ?˜ì°½???µì°°?¥â€?ê¸°ì???ì¶©ì¡±?©ë‹ˆ??",
        },
        {
          id: "pf-102",
          title: "AI ?°ì´??ë¶„ì„ ë°?ë¹…ë°?´í„° ì¤€?„ë¬¸ê°€ (ADsP) ìµœì¢… ?ë“",
          category: "?… ?ê²©ì¦?,
          dateRange: "2026.03.01 ~ 2026.05.15",
          content: "R/Python ë°??µê³„ ê°€ê³?ë¶„ì„ ê¸°ë²•??ë§¤ì¼ 2?œê°„???êµ¬?˜ì—¬ ?°ì´???„ì²˜ë¦?ë°?ë¶„ë¥˜ ?ˆì¸¡ ê¸°ê³„?™ìŠµ ?´ë¡  ê³µì¸ êµ??ê¸°ê? ?¸ì¦ ?ê²©???¹ë‹¹???±ì·¨??",
          tags: ["ADsP", "êµ??ê³µì¸", "?°ì´?°ë¶„?ì??„ë¬¸ê°€"],
          aiFeedback: "ê³ ë“±?™êµ ?™ì—… ì¤??¤ë¬´ê¶Œìœ„??êµ??ê³µì¸ ?°ì´???ê²©???±ì·¨?˜ì—¬ ?…ì‚¬ê´€ ë°?ë©´ì ‘ê´€?ê²Œ ?•ì‹¤???¤ì „ SW ê²€ì¦ì„ ë³´ì¼ ???ˆìŠµ?ˆë‹¤!",
        },
        {
          id: "pf-103",
          title: "ì²?†Œ???ìœ¨ ?™ì•„ë¦?'ë¯¸ë˜ ëª¨ë¹Œë¦¬í‹° ?°êµ¬?? ?„ë¡œ?íŠ¸ ?™ìˆ ??,
          category: "?™ì•„ë¦?·ì??(ì°½ì‘)",
          dateRange: "2026.05.01 ~ 2026.07.20",
          content: "?ìœ¨ì£¼í–‰ RCì¹´ì— ?¼ì¦ˆë² ë¦¬ ?Œì´?€ ì¹´ë©”???¼ì„œë¥?ë¶€ì°©í•˜??ì°¨ì„  ?„ë°˜ ê°ì? ? ê²½ë§ì„ ?¸ë ˆ?´ë‹?˜ê³ , ì§€???°ê³„ ?™ì•„ë¦?ë°•ëŒ?Œì—???°ìˆ˜ ?œì—°?ì„ ?˜ìƒ??",
          tags: ["?ìœ¨ì£¼í–‰RCì¹?, "?¼ì¦ˆë² ë¦¬?Œì´", "?‘ì—…ë¦¬ë”??],
          aiFeedback: "ì£¼ë„?ìœ¼ë¡?HW?€ SWë¥??µí•© ?œì–´?????ìƒ???„ë¡œ?íŠ¸ ë¡œê·¸ë¡? ê³µë? ë°??¸ê³µì§€???™ê³¼ ?©ê²©??ë³´ì¦?˜ëŠ” ë§Œì  ?œë™?…ë‹ˆ??",
        }
      ];
      setItems(initial);
      localStorage.setItem("readycareer_portfolio_items_v2", JSON.stringify(initial));
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3200);
  };

  // Canvasë¥??´ìš©???¬ì§„ ?…ë¡œ??ë°??ë™ ?©ëŸ‰ ì¤„ì´ê¸?ìµœì ??  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsPhotoCompressing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 700;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = Math.round(img.height * scaleSize);

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.75);
        if (isEdit && editingItem) {
          setEditingItem({ ...editingItem, photoUrl: compressedDataUrl });
        } else {
          setUploadedPhoto(compressedDataUrl);
        }
        setIsPhotoCompressing(false);
        showToast("???¬ì§„ ?©ëŸ‰????88% ?ë™ ìµœì ??ì¶•ì†Œ?˜ì–´ ?„ë²½???¥ì°©?˜ì—ˆ?µë‹ˆ??");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // AI ë¬¸êµ¬ ?ë™ êµì • ë°??¸íŠ¹ ìµœì ??  const handleAiRefineForm = async () => {
    if (!formContent.trim()) {
      alert("êµì •ë°›ì„ ?œë™ ?´ìš©??ë¨¼ì? ì¡°ê¸ˆ?´ë¼???‘ì„±?´ì£¼?¸ìš”!");
      return;
    }
    setIsAiRefining(true);
    let refined = `??026 NEIS ?¸íŠ¹ ê¸°ì¬?”ë ¹ 100% ë°˜ì˜ AI êµì •ë³¸ã€?n'${formTitle || "?¬í™” ?êµ¬"}' ?˜í–‰ ê³¼ì •?ì„œ êµ¬ì²´???¤í—˜ ê·¼ê±°?€ ?µí•©???„ë¡œ? í?????Ÿ‰???…ì¦?? ?¹íˆ ?˜í–‰ ê¸°ê°„(${startDate} ~ ${endDate}) ?™ì•ˆ ë³¸ì¸??ì£¼ë„?ìœ¼ë¡?ê°€?¤ì„ ?˜ë¦½?˜ê³  ê¸°ê³„?™ìŠµ/?êµ¬ ë¶„ì„?¥ì„ ?‘ëª©?˜ì—¬ ì§ë¬´ ?„ê³µ??'${targetJobName}')ê³??°ì–´??ë°œì „ ê°ìˆ˜?±ì„ ?„ì¶œ??`;
    
    try {
      const res = await executeAiPrompt({
        promptType: "refine_text",
        text: formContent,
        targetJob: targetJobName,
      } as any);
      if (res.content && res.provider !== "expo-demo-fallback") {
        refined = res.content.replace(/^["']|["']$/g, "").trim();
      }
    } catch(err) {}

    setTimeout(() => {
      setFormContent(refined);
      setIsAiRefining(false);
      showToast("??AIê°€ ?¸íŠ¹ ?‰ê? ê¸°ì? ìµœê³ ?ì— ë§ì¶° ?œë™ ?´ì—­??ìµœì ??êµì •?ˆìŠµ?ˆë‹¤!");
    }, 800);
  };

  // ? ê·œ ì§„ë¡œ ê²½í—˜ ?€??  const handleSaveNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) {
      alert("?œë™ ?œëª©ê³??´ìš©???…ë ¥??ì£¼ì„¸??");
      return;
    }

    const finalCat = formCategory === "?› ï¸?ê¸°í?(ì§ì ‘?…ë ¥)" ? (customCategoryInput.trim() || "?ìœ  ?ìƒ‰") : formCategory;
    const dateStr = `${startDate.replace(/-/g, ".")} ~ ${endDate.replace(/-/g, ".")}`;
    
    const newItem: PortfolioItem = {
      id: "pf-" + Date.now(),
      title: formTitle.trim(),
      category: finalCat,
      dateRange: dateStr,
      content: formContent.trim(),
      tags: formTags.split(",").map(t => t.trim()).filter(t => t),
      photoUrl: uploadedPhoto,
      aiFeedback: `?’¡ ['${targetJobName}' AI ??Ÿ‰ ?‰ê?]: ???œë™ ê¸°ë¡?€ ?Œì›?˜ì˜ ê¾¸ì????êµ¬ ê¸°ê°„(${dateStr})ê³?ë¶„ëª…???„ê³µ?í•©?±ì„ ?…ì‚¬ê´€?ê²Œ ëª…ì¾Œ??ë³´ì—¬ì£¼ëŠ” ìµœìš°??ë³´ê? ??ª©?…ë‹ˆ??`,
    };

    const updated = [newItem, ...items];
    setItems(updated);
    localStorage.setItem("readycareer_portfolio_items_v2", JSON.stringify(updated));
    rewardXP(60, "ì§„ë¡œ ?¬íŠ¸?´ë¦¬???¤í™ ?±ë¡!");

    setFormTitle("");
    setFormContent("");
    setFormTags("");
    setUploadedPhoto(undefined);
    setShowInputForm(false);
    showToast("?‰ ??ì§„ë¡œ ?¬íŠ¸?´ë¦¬???¤í™ ?¼ë£¸???±ê³µ?ìœ¼ë¡??€?¥ë˜?ˆìŠµ?ˆë‹¤!");
  };

  // ì¶”ì²œ ?œë™ ???¬íŠ¸?´ë¦¬?¤ë¡œ ê°€?¸ì˜¤ê¸?  const handleImportRecommendation = (rec: any) => {
    const imported: PortfolioItem = {
      id: "pf-rec-" + Date.now() + Math.random().toString(36).substring(2, 5),
      title: rec.title,
      category: rec.category,
      dateRange: rec.dateRange,
      content: rec.content,
      tags: rec.tags,
      aiFeedback: rec.aiFeedback,
    };
    const updated = [imported, ...items];
    setItems(updated);
    localStorage.setItem("readycareer_portfolio_items_v2", JSON.stringify(updated));
    rewardXP(60, `[${rec.title}] ì§„ë¡œ ?œë™ ë³´ê????¥ì°©!`);
    showToast(`??[${rec.title}] ??ª©????ì§„ë¡œ ?¬íŠ¸?´ë¦¬???¤í™ ?¼ë£¸?¼ë¡œ ì¦‰ì‹œ ?´ë™?˜ì—ˆ?µë‹ˆ??`);
  };

  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    
    const updated = items.map(it => it.id === editingItem.id ? editingItem : it);
    setItems(updated);
    localStorage.setItem("readycareer_portfolio_items_v2", JSON.stringify(updated));
    
    if (viewingItem && viewingItem.id === editingItem.id) {
      setViewingItem(editingItem);
    }
    
    setEditingItem(null);
    showToast("?ï¸ ?¬íŠ¸?´ë¦¬????ª©???˜ì • ?„ë£Œ?˜ì—ˆ?µë‹ˆ??");
  };

  const handleDeleteItem = (id: string) => {
    if (!window.confirm("?•ë§ ???¬íŠ¸?´ë¦¬???¤í™ ê¸°ë¡???? œ?˜ì‹œê² ìŠµ?ˆê¹Œ?")) return;
    const updated = items.filter(it => it.id !== id);
    setItems(updated);
    localStorage.setItem("readycareer_portfolio_items_v2", JSON.stringify(updated));
    if (viewingItem && viewingItem.id === id) setViewingItem(null);
    showToast("?—‘ï¸???ª©??ê¹”ë”?˜ê²Œ ?? œ?˜ì—ˆ?µë‹ˆ??");
  };

  const categoriesList = ["?„ì²´ ë³´ê¸°", "ì§„í•™Â·?êµ¬ (êµê³¼)", "?™ì•„ë¦?·ì??(ì°½ì‘)", "?…ì„œÂ·?ˆìˆ ", "?… ?ê²©ì¦?, "?› ï¸?ê¸°í?(ì§ì ‘?…ë ¥)"];
  
  const filteredItems = selectedCategory === "?„ì²´ ë³´ê¸°" ? items : items.filter(it => {
    if (selectedCategory === "?› ï¸?ê¸°í?(ì§ì ‘?…ë ¥)") {
      return !["ì§„í•™Â·?êµ¬ (êµê³¼)", "?™ì•„ë¦?·ì??(ì°½ì‘)", "?…ì„œÂ·?ˆìˆ ", "?… ?ê²©ì¦?].includes(it.category);
    }
    return it.category.includes(selectedCategory.split(" ")[0]) || it.category.includes(selectedCategory);
  });

  const currentRecPool = RECOMMENDED_POOLS[recPoolIdx % RECOMMENDED_POOLS.length];

  // ?¤í™ ?µê³„ ê³„ì‚°
  const certCount = items.filter(it => it.category.includes("?ê²©ì¦?)).length;
  const studyCount = items.filter(it => it.category.includes("ì§„í•™") || it.category.includes("?êµ¬")).length;
  const clubCount = items.filter(it => it.category.includes("?™ì•„ë¦?) || it.category.includes("?ìœ¨") || it.category.includes("ì°½ì‘")).length;
  const photoCount = items.filter(it => !!it.photoUrl).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 space-y-10 selection:bg-[#D946EF]/20 selection:text-[#D946EF] relative">
      
      {toastMsg && (
        <div className="fixed bottom-10 right-10 z-50 bg-[#008A90] text-white px-6 py-4 rounded-3xl font-black text-sm sm:text-base shadow-[0_15px_35px_rgba(0,138,144,0.4)] flex items-center gap-3 animate-bounce-short border-2 border-white">
          <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* =========================================================================
          SECTION 1: HERO (ì§„ë¡œ ?¤í™ ?¼ë£¸ & ?¥í¼??ë§ˆì  ?€ ?ì—… ?´ì • ?Œë§ˆ)
         ========================================================================= */}
      <div className="rounded-[36px] bg-gradient-to-r from-[#1E114D] via-[#4A20D2] to-[#D946EF] text-white p-8 sm:p-12 shadow-[0_20px_60px_rgba(217,70,239,0.25)] border-4 border-white/25 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        <div className="space-y-4 max-w-2xl z-10 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-black bg-[#FF3B7C] text-white px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-md animate-pulse">
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>?€?™Â·ê¸°???œì¶œ ?¤í™ ?¥ì‹??(Showroom)</span>
            </span>
            <span className="text-xs font-black bg-[#7AF1FC] text-[#006970] px-3.5 py-1.5 rounded-full shadow-md">
              ?¯ ëª©í‘œ ì§ì—…: {targetJobName}
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-headline font-black tracking-tight leading-tight">
            ?’¼ ì§„ë¡œ ì»¤ë¦¬???±ê³¼ ?¥ì‹??&amp; <br className="hidden sm:block"/> 3D ?¤í™ ?„ì¹´?´ë¹™
          </h1>
          <p className="text-sm sm:text-base font-semibold text-[#F0E6FF] leading-relaxed">
            ?˜ì˜ ì§„ë¡œ ?œë™ê³??ê²©ì¦? ?¸ì¦ ?¬ì§„(88% ?•ì¶• ìµœì ?????¸ë? ê°¤ëŸ¬ë¦??•íƒœë¡??„ì‹œ?˜ì„¸?? AI ?¸íŠ¹ êµì •ê³??¨ê»˜ <strong>?…í•™?¬ì •ê´€ ë°?ì±„ìš©ê´€??ë§¤ë£Œ?œí‚¬ ?¬íŠ¸?´ë¦¬??/strong>ê°€ ?„ì„±?©ë‹ˆ??
          </p>
        </div>

        <div className="flex-shrink-0 z-10 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-32 h-32 rounded-3xl bg-white/20 backdrop-blur-md p-2.5 border-2 border-white/50 shadow-xl hidden sm:flex items-center justify-center transform hover:rotate-6 transition-all">
            <img src={customAvatarUrl} alt="Target Avatar" className="w-full h-full object-contain filter drop-shadow-lg" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          [? ê·œ ?‘ì¬] SECTION 0: ?† ì§„ë¡œ ?±ê³¼ ?¥ì‹??& ?¤í™ ?„í™© ë©”íŠ¸ë¦?(Stats Bar)
         ========================================================================= */}
      <div className="bg-gradient-to-br from-[#F8F5FF] via-white to-[#FAF0FF] rounded-[36px] p-7 sm:p-10 border-2 border-[#E9D5FF] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-150 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#7B5CF0]/15 text-[#7B5CF0] px-3 py-1 rounded-full text-xs font-black mb-1">
              <Trophy className="w-3.5 h-3.5 text-[#7B5CF0]" />
              <span>Career Activity Scoreboard & Trophy Case</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-headline font-black text-[#1A1626]">
              ?† ?˜ì˜ ?„ì  ì»¤ë¦¬???±ê³¼ ?ˆì¥ ?¥ì‹??            </h2>
            <p className="text-xs sm:text-sm font-semibold text-[#6E6A80]">
              ?„ì¬ê¹Œì? ?„ì ????Ÿ‰ ì§€?œê? ?¤ì‹œê°?ì§‘ê³„?©ë‹ˆ?? ?¤ì–‘???¤í™??ì±„ì›Œ ?©ê¸ˆ ?ˆì¥???˜ë ¤ê°€?¸ìš”!
            </p>
          </div>

          <button
            onClick={() => setShowInputForm(!showInputForm)}
            className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-gradient-to-r from-[#FF3B7C] via-[#FF5C8A] to-[#7B5CF0] hover:brightness-110 text-white font-black text-sm sm:text-base shadow-[0_10px_25px_rgba(255,59,124,0.35)] transition-transform transform hover:-translate-y-1 active:scale-95 cursor-pointer border-2 border-white flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>{showInputForm ? "?…ë ¥ì°??«ê¸° ?? : "?ï¸ ??ì§„ë¡œ ?¤í™ ì§ì ‘ ì¶”ê??˜ê¸°"}</span>
          </button>
        </div>

        {/* 4?€ ?¤í™ ?ˆì¥ ë©”íŠ¸ë¦?ê·¸ë¦¬??*/}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-purple-100 shadow-sm flex items-center gap-4 transform hover:scale-[1.02] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-2xl shrink-0 border border-purple-200">
              ?”¬
            </div>
            <div>
              <span className="text-xs font-black text-[#8D88A0] block">êµê³¼Â·?¸íŠ¹ ?êµ¬</span>
              <span className="text-2xl sm:text-3xl font-black text-[#7B5CF0]">{studyCount} <span className="text-sm font-bold text-slate-500">ê±?/span></span>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-pink-100 shadow-sm flex items-center gap-4 transform hover:scale-[1.02] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-2xl shrink-0 border border-pink-200">
              ?¤
            </div>
            <div>
              <span className="text-xs font-black text-[#8D88A0] block">?™ì•„ë¦?·ì°½??/span>
              <span className="text-2xl sm:text-3xl font-black text-[#FF3B7C]">{clubCount} <span className="text-sm font-bold text-slate-500">ê±?/span></span>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-amber-100 shadow-sm flex items-center gap-4 transform hover:scale-[1.02] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl shrink-0 border border-amber-200 animate-bounce-short">
              ?…
            </div>
            <div>
              <span className="text-xs font-black text-[#8D88A0] block">ì·¨ë“ ?ê²©ì¦?/span>
              <span className="text-2xl sm:text-3xl font-black text-amber-600">{certCount} <span className="text-sm font-bold text-slate-500">ê°?/span></span>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-3xl border-2 border-cyan-100 shadow-sm flex items-center gap-4 transform hover:scale-[1.02] transition-all">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center text-2xl shrink-0 border border-cyan-200">
              ?“·
            </div>
            <div>
              <span className="text-xs font-black text-[#8D88A0] block">?¸ì¦ ?¬ì§„ ì²¨ë?</span>
              <span className="text-2xl sm:text-3xl font-black text-[#008A90]">{photoCount} <span className="text-sm font-bold text-slate-500">ê±?/span></span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2 (MODAL / PANEL): ??ì§„ë¡œ ê²½í—˜ ì§ì ‘ ?…ë ¥ ??(AI ?¸íŠ¹ êµì •, ?¬ì§„ ?•ì¶•)
         ========================================================================= */}
      {showInputForm && (
        <div className="bg-white/95 backdrop-blur-2xl rounded-[40px] p-8 sm:p-12 shadow-[0_25px_65px_rgba(123,92,240,0.18)] border-4 border-[#DED4FF] space-y-8 animate-fadeIn">
          <div className="flex items-center justify-between border-b-2 border-purple-100 pb-5">
            <div className="space-y-1">
              <span className="text-xs font-black bg-purple-100 text-[#7B5CF0] px-3 py-1 rounded-full inline-block">
                ??NEIS 100% ë§ì¶¤ ë°??´ë?ì§€ 88% ?•ì¶• ?”ì§„ ?‘ì¬
              </span>
              <h2 className="text-2xl sm:text-3xl font-headline font-black text-[#1A1626]">
                ?“ ??ì§„ë¡œ ê²½í—˜ ë°??¸íŠ¹/?ê²©ì¦?ì§ì ‘ ?±ë¡
              </h2>
            </div>
            <button
              onClick={() => setShowInputForm(false)}
              className="p-2 rounded-full bg-purple-50 hover:bg-purple-100 text-[#7B5CF0] font-bold"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSaveNewItem} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-black text-[#3B364C] block">
                  ?·ï¸??œë™ ?ì—­ ë°?ë¶„ë¥˜
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full h-14 px-4 rounded-2xl bg-[#F9F7FF] border-2 border-[#DED4FF] font-black text-sm text-[#1A1626] focus:border-[#7B5CF0] focus:outline-none shadow-inner"
                >
                  <option value="ì§„í•™Â·?êµ¬ (êµê³¼)">ì§„í•™Â·?êµ¬ (êµê³¼ ?¸íŠ¹)</option>
                  <option value="?™ì•„ë¦?·ì??(ì°½ì‘)">?™ì•„ë¦?·ì??(ì°½ì‘)</option>
                  <option value="?…ì„œÂ·?ˆìˆ ">?…ì„œÂ·?ˆìˆ </option>
                  <option value="?… ?ê²©ì¦?>?… ?ê²©ì¦?/option>
                  <option value="?› ï¸?ê¸°í?(ì§ì ‘?…ë ¥)">?› ï¸?ê¸°í?(ì§ì ‘?…ë ¥)</option>
                </select>

                {formCategory === "?› ï¸?ê¸°í?(ì§ì ‘?…ë ¥)" && (
                  <input
                    type="text"
                    placeholder="?? ?¤í¬ì¸?ê³¼í•™ ?´ì„¤ ë´‰ì‚¬?œë™"
                    value={customCategoryInput}
                    onChange={(e) => setCustomCategoryInput(e.target.value)}
                    className="w-full h-12 px-4 mt-2 rounded-xl bg-purple-50/70 border border-[#7B5CF0] font-black text-xs text-[#7B5CF0] placeholder:text-[#8D88A0] focus:outline-none"
                    required
                  />
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs sm:text-sm font-black text-[#3B364C] block">
                  ?“Œ ?œë™ ë°?ê²½í—˜ ?œëª© (?ëŠ” ?ê²©ì¦ëª…)
                </label>
                <input
                  type="text"
                  placeholder="?? ?¸ê³µì§€???¤ë¦¬ ?¼ìŸ ?´ë? ë°?ì±—ë´‡ ëª¨í˜• ?¤ê³„ ?„ë¡œ?íŠ¸"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full h-14 px-5 rounded-2xl bg-[#F9F7FF] border-2 border-[#DED4FF] font-bold text-sm text-[#1A1626] placeholder:text-[#8D88A0] focus:border-[#7B5CF0] focus:outline-none shadow-inner"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 bg-[#FAF6FF] p-5 rounded-3xl border border-purple-100">
              <label className="text-xs sm:text-sm font-black text-[#3B364C] flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#7B5CF0]" />
                <span>???œë™ ?˜í–‰ ê¸°ê°„ ? íƒ (?œì‘??~ ì¢…ë£Œ??</span>
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <div className="w-full sm:w-1/2 flex items-center gap-3">
                  <span className="text-xs font-bold text-[#6E6A80] whitespace-nowrap">?œì‘??</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-white border border-purple-200 font-bold text-sm text-[#1A1626] shadow-sm"
                  />
                </div>
                <span className="hidden sm:inline font-black text-[#7B5CF0]">~</span>
                <div className="w-full sm:w-1/2 flex items-center gap-3">
                  <span className="text-xs font-bold text-[#6E6A80] whitespace-nowrap">ì¢…ë£Œ??</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-white border border-purple-200 font-bold text-sm text-[#1A1626] shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs sm:text-sm font-black text-[#3B364C] block">
                  ?“ ?˜í–‰ ?´ìš© ë°??˜ì˜ ê³ ì°° (?ëŠ” ?ê²© ì·¨ë“ ê³¼ì •)
                </label>
                <button
                  type="button"
                  onClick={handleAiRefineForm}
                  disabled={isAiRefining}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#008A90] to-[#00A3A8] hover:brightness-110 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer w-fit"
                >
                  <Sparkles className={`w-4 h-4 text-amber-300 ${isAiRefining ? "animate-spin" : ""}`} />
                  <span>{isAiRefining ? "AI ë¬¸êµ¬ ?¤ë“¬ê³?êµì • ì¤?.." : "??AI ?¸íŠ¹ ë¬¸êµ¬ ?ë™ êµì • ë°?ìµœì ??ë°›ê¸°!"}</span>
                </button>
              </div>
              <textarea
                rows={5}
                placeholder="?´ë–¤ ê³„ê¸°ë¡??œì‘?ˆê³  ?´ë–¤ ?¤í—˜/ê³µë?/?„ë¡œ?íŠ¸ë¥??˜ì??”ì? ?ìœ¨?ìœ¼ë¡??ì–´ë³´ì„¸?? ?„ì˜ 'AI ?¸íŠ¹ ë¬¸êµ¬ ?ë™ êµì • ë°?ìµœì ?? ë²„íŠ¼???„ë¥´?œë©´ êµì‚¬??ê¸°ì¬ ì§€ì¹¨ì— ë§ì¶˜ ?„ë²½??ë²„ì „?¼ë¡œ ì¦‰ì‹œ êµì •?©ë‹ˆ??"
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                className="w-full p-5 rounded-2xl bg-[#F9F7FF] border-2 border-[#DED4FF] font-semibold text-sm text-[#1A1626] placeholder:text-[#8D88A0] focus:border-[#7B5CF0] focus:outline-none shadow-inner leading-relaxed"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-black text-[#3B364C] flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#FF3B7C]" />
                  <span>?“· ?¸ì¦ ?¬ì§„ ?…ë¡œ??(?©ëŸ‰ ?ë™ 88% ì¶•ì†Œ ìµœì ??</span>
                </label>
                <div className="relative border-2 border-dashed border-[#B8AAFA] hover:border-[#7B5CF0] rounded-2xl p-4 bg-[#F8F6FF] text-center transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, false)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  {uploadedPhoto ? (
                    <div className="flex items-center justify-center gap-3">
                      <img src={uploadedPhoto} alt="Upload Preview" className="w-14 h-14 object-cover rounded-xl shadow-md border" />
                      <div className="text-left">
                        <span className="text-xs font-black text-green-700 block">???¬ì§„ ìµœì ??ì²¨ë? ?„ë£Œ!</span>
                        <span className="text-[10px] font-bold text-[#8D88A0]">?´ë¦­?˜ì—¬ ?¤ë¥¸ ?´ë?ì§€ ë³€ê²?/span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-6 h-6 text-[#7B5CF0] mx-auto" />
                      <span className="text-xs font-extrabold text-[#5C5672] block">
                        {isPhotoCompressing ? "??Canvas ?¬ì§„ ?•ì¶• ìµœì ??ì¤?.." : "?´ë¦­?˜ê±°???¬ì§„???œë˜ê·¸í•˜???…ë¡œ??}
                      </span>
                      <span className="text-[10px] text-[#8A859C] font-semibold block">
                        (?€?©ëŸ‰ ?¤ë§ˆ?¸í° ?¬ì§„??ë¸Œë¼?°ì??ì„œ ?ë™ ì¶•ì†Œ?˜ì—¬ ?€?¥í•©?ˆë‹¤)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-black text-[#3B364C] block">
                  ?·ï¸???Ÿ‰ ?œê·¸ (?¼í‘œë¡?êµ¬ë¶„)
                </label>
                <input
                  type="text"
                  placeholder="?? ?¸ê³µì§€?? ë¹…ë°?´í„°, ë¦¬ë”?? êµ??ê³µì¸"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  className="w-full h-14 px-5 rounded-2xl bg-[#F9F7FF] border-2 border-[#DED4FF] font-extrabold text-sm text-[#1A1626] placeholder:text-[#8D88A0] focus:border-[#7B5CF0] focus:outline-none shadow-inner"
                />
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowInputForm(false)}
                className="py-4 px-8 rounded-2xl bg-slate-100 hover:bg-slate-200 font-bold text-sm text-[#5C5672]"
              >
                ì·¨ì†Œ
              </button>
              <button
                type="submit"
                className="py-4 px-10 rounded-2xl bg-[#7B5CF0] hover:bg-[#643DDD] text-white font-black text-base shadow-xl transition-all flex items-center gap-2 cursor-pointer transform hover:scale-105"
              >
                <Save className="w-5 h-5" />
                <span>??ì§„ë¡œ ?¬íŠ¸?´ë¦¬?¤ì— ?„ì  ë³´ì¡´?˜ê¸°!</span>
              </button>
            </div>

          </form>
        </div>
      )}

      {/* =========================================================================
          SECTION 3: AI ë§ì¶¤ ì§„ë¡œ ?œë™ ì¶”ì²œ ë³´ê???(Progressive Disclosure - ?‘ê¸°/?¼ì¹˜ê¸?
         ========================================================================= */}
      <div className="bg-gradient-to-r from-[#FAF6FF] via-[#E5FAFF]/50 to-[#FAF6FF] rounded-[32px] p-6 sm:p-8 border-2 border-[#C6EEF4] shadow-md transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#008A90] text-white flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <span className="text-xs font-black text-[#008A90] block uppercase tracking-wide">AI Career Activity Explorer</span>
              <h3 className="text-lg sm:text-xl font-headline font-black text-[#1A1626]">
                ?? ??ê¿?"{targetJobName}")??ë¹›ë‚¼ ?œë™ ì¶”ì²œ ?€
              </h3>
              <p className="text-xs sm:text-sm text-[#5C5672] font-semibold">
                ?´ë–¤ ?œë™??? ì? ë§‰ë§‰?????´ë¦­??ë³´ì„¸?? ë§ˆìŒ???œëŠ” ?œë™???°ì¹˜ ??ë²ˆì— ???¬íŠ¸?´ë¦¬?¤ë¡œ ê°€?¸ì˜¬ ???ˆìŠµ?ˆë‹¤.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {showRecPool && (
              <button
                onClick={() => setRecPoolIdx(recPoolIdx + 1)}
                className="px-4 py-3 rounded-2xl bg-[#008A90] hover:bg-[#007378] text-white font-black text-xs shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
                <span>?ˆë¡œê³ ì¹¨ ({recPoolIdx % RECOMMENDED_POOLS.length + 1}/{RECOMMENDED_POOLS.length})</span>
              </button>
            )}
            <button
              onClick={() => setShowRecPool(!showRecPool)}
              className="px-6 py-3.5 rounded-2xl bg-[#7B5CF0] hover:bg-[#6240D5] text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{showRecPool ? "??ì¶”ì²œ ë³´ê????‘ê¸°" : "??AI ì¶”ì²œ ?œë™ ?€ ?´ì–´ë³´ê¸°"}</span>
            </button>
          </div>
        </div>

        {/* ?¼ì³¤???Œë§Œ ë³´ì´??ì¶”ì²œ ?œë™ ?€ */}
        {showRecPool && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 mt-6 border-t border-cyan-200/60 animate-fadeIn">
            {currentRecPool.map((rec, idx) => (
              <div key={idx} className="bg-white/95 rounded-[26px] p-6 border-2 border-cyan-100 shadow-[0_8px_25px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black bg-[#008A90]/15 text-[#008A90] px-3 py-1 rounded-full">
                      {rec.category}
                    </span>
                    <span className="text-[11px] font-bold text-[#8D88A0] bg-slate-100 px-2 py-0.5 rounded-md">
                      ?“… {rec.dateRange}
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-[#1A1626] leading-snug group-hover:text-[#008A90] transition-colors">
                    {rec.title}
                  </h4>
                  <p className="text-xs font-bold text-[#4A4460] leading-relaxed bg-[#F8FDFF] p-3.5 rounded-2xl border border-cyan-50 line-clamp-3">
                    {rec.content}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {rec.tags.map((t, tIdx) => (
                      <span key={tIdx} className="text-[10px] font-extrabold bg-purple-50 text-[#6240D5] px-2 py-0.5 rounded-md">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => handleImportRecommendation(rec)}
                    className="w-full py-3 px-4 bg-gradient-to-r from-[#008A90] to-[#00A0A5] hover:brightness-110 text-white font-black text-xs rounded-2xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-transform active:scale-95"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>???¬íŠ¸?´ë¦¬?¤ë¡œ ê°€?¸ì˜¤ê¸?</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =========================================================================
          SECTION 4: ì§„ë¡œ?¬íŠ¸?´ë¦¬??ê°¤ëŸ¬ë¦?ëª…í•¨ ?¼ë£¸ (ê°€?…ì„± ìµœì ??Grid View)
         ========================================================================= */}
      <div className="space-y-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-purple-150 pb-5 pl-2">
          <div>
            <h3 className="text-2xl font-headline font-black text-[#1A1626] flex items-center gap-2">
              <span>?—ƒï¸???ì§„ë¡œ ?¤í™ ê°¤ëŸ¬ë¦??¼ë£¸ (ì´?{filteredItems.length}ê±?</span>
            </h3>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              ì¹´ë“œë¥??°ì¹˜?˜ê±°??[?ì„¸ë³´ê¸°]ë¥??ŒëŸ¬ ê³ í•´?ë„ ?¸ì¦ ?¬ì§„ê³?AI ?¸íŠ¹ ?‰ê?ë¥??•ì¸?˜ì„¸??
            </p>
          </div>

          {/* ì¹´í…Œê³ ë¦¬ ?„í„° ë°?*/}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> ë¶„ë¥˜:
            </span>
            {categoriesList.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-2xl font-black text-xs transition-all shadow-2xs ${
                    isSelected
                      ? "bg-[#7B5CF0] text-white scale-105 shadow-md"
                      : "bg-white text-[#6E6A80] border border-purple-200 hover:bg-[#FAF6FF]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* ê°¤ëŸ¬ë¦?ê·¸ë¦¬??ë¦¬ìŠ¤??ë·?*/}
        {filteredItems.length === 0 ? (
          <div className="w-full py-20 text-center bg-white rounded-[36px] border-2 border-dashed border-purple-200 space-y-3">
            <span className="text-5xl block">?’¼</span>
            <p className="text-base font-black text-[#7B5CF0]">? íƒ??ë¶„ë¥˜???´ë‹¹?˜ëŠ” ?¬íŠ¸?´ë¦¬????ª©???†ìŠµ?ˆë‹¤.</p>
            <span className="text-xs font-bold text-[#8A859C]">?„ì˜ ì§ì ‘ ì¶”ê? ë²„íŠ¼???„ë¥´ê±°ë‚˜ AI ì¶”ì²œ ?€?ì„œ ?¤í™???¥ì°©??ë³´ì„¸??</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredItems.map((it) => {
              const isCert = it.category.includes("?ê²©ì¦?);
              return (
                <div
                  key={it.id}
                  onClick={() => setViewingItem(it)}
                  className="bg-white rounded-[24px] p-5 border-2 border-slate-200 hover:border-[#6A42ED] shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between min-h-[220px] group cursor-pointer relative overflow-hidden"
                >
                  <div className="space-y-2.5 overflow-hidden w-full">
                    {/* ?ë‹¨ ë±ƒì? & ? ì§œ */}
                    <div className="flex items-center justify-between gap-1.5">
                      <span className={`text-xs font-black px-3 py-1 rounded-full border truncate max-w-[140px] shadow-2xs ${
                        isCert
                          ? "bg-rose-50 text-rose-600 border-rose-200"
                          : "bg-[#F3F0FF] text-[#6A42ED] border-[#D8CEFF]"
                      }`}>
                        ??{it.category}
                      </span>
                      <span className="text-xs font-bold text-slate-400 shrink-0">
                        {it.dateRange?.split(' ')[0] || "2026.05"}
                      </span>
                    </div>

                    {/* ?œëª© ë°?ë³¸ë¬¸ */}
                    <div className="space-y-1">
                      <h4 className="text-base font-black text-[#1F193B] group-hover:text-[#6A42ED] transition-colors line-clamp-2 leading-snug break-keep">
                        {it.title}
                      </h4>
                      <p className="text-xs font-semibold text-slate-500 line-clamp-2 leading-relaxed break-keep">
                        {it.content}
                      </p>
                    </div>

                    {/* ?œê·¸ ë¦¬ìŠ¤??*/}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {it.tags?.slice(0, 3).map((tag, tIdx) => (
                        <span key={tIdx} className="text-[11px] font-extrabold bg-slate-50 text-slate-600 px-2.5 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                          #{tag}
                        </span>
                      ))}
                      {(it.tags?.length || 0) > 3 && (
                        <span className="text-[11px] font-black text-purple-500 px-1.5 py-0.5">+{it.tags.length - 3}</span>
                      )}
                    </div>
                  </div>

                  {/* ?˜ë‹¨ ?¤í‹°ì»??¡ì…˜ë°?*/}
                  <div className="pt-3.5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold">
                    <span className="text-[#0D9488] flex items-center gap-1">
                      {it.photoUrl ? "?“· ?¸ì¦?¬ì§„ ?¬í•¨" : "??AI ?‰ê? ?„ë£Œ"}
                    </span>
                    <span className="text-slate-500 group-hover:text-[#6A42ED] transition-colors flex items-center gap-1">
                      ?°ì¹˜?˜ì—¬ ?•ì¥ &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* =========================================================================
          MODAL 1: ?¬íŠ¸?´ë¦¬???¤í™ ?ì„¸ ë³´ê¸° ë·°ì–´ (Detail Viewer Modal)
         ========================================================================= */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn" onClick={() => setViewingItem(null)}>
          <div 
            className="bg-white w-full max-w-3xl rounded-[40px] p-8 sm:p-12 shadow-[0_25px_80px_rgba(0,0,0,0.6)] border-4 border-purple-200 relative max-h-[90vh] overflow-y-auto space-y-7"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setViewingItem(null)}
              className="absolute top-7 right-7 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              <X className="w-6 h-6" />
            </button>

            {/* ?ë‹¨ ë¶„ë¥˜ */}
            <div className="space-y-3 border-b-2 border-purple-100 pb-5 pr-8">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-black px-4 py-1.5 rounded-full ${viewingItem.category.includes('?ê²©ì¦?) ? 'bg-[#FF3B7C] text-white' : 'bg-[#7B5CF0] text-white'}`}>
                  {viewingItem.category}
                </span>
                <span className="text-xs font-black text-[#6E6A80] bg-[#F2EEFF] px-3 py-1 rounded-lg">
                  ???˜í–‰ ê¸°ê°„: {viewingItem.dateRange || "2026.05 ~ 07"}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-headline font-black text-[#1A1626] leading-snug">
                {viewingItem.title}
              </h3>
            </div>

            {/* ì²¨ë? ?¬ì§„ ?•ë? */}
            {viewingItem.photoUrl && (
              <div className="rounded-3xl overflow-hidden border-2 border-purple-200 shadow-md max-h-[380px] bg-slate-50 text-center">
                <img src={viewingItem.photoUrl} alt="High Res Verification" className="w-full h-full max-h-[360px] object-contain mx-auto" />
              </div>
            )}

            {/* ë³¸ë¬¸ ?´ìš© */}
            <div className="space-y-2">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wide">?“ ?œë™ ?ì„¸ ê³ ì°° ë°??˜í–‰ ê³¼ì •</span>
              <div className="bg-[#F9F8FD] p-7 rounded-[32px] border border-purple-200 shadow-inner text-base font-bold text-[#2E2840] leading-relaxed whitespace-pre-wrap">
                {viewingItem.content}
              </div>
            </div>

            {/* ??Ÿ‰ ?œê·¸ */}
            <div className="space-y-2">
              <span className="text-xs font-black text-slate-400">?·ï¸??µì‹¬ ì§ë¬´ ??Ÿ‰ ?œê·¸</span>
              <div className="flex flex-wrap gap-2">
                {viewingItem.tags?.map((tag, idx) => (
                  <span key={idx} className="text-sm font-black bg-[#EFEAFE] text-[#6240D5] px-4 py-1.5 rounded-xl border border-purple-200">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* AI ??Ÿ‰ ?¼ë“œë°?*/}
            {viewingItem.aiFeedback && (
              <div className="w-full rounded-[32px] bg-gradient-to-r from-[#E6FAFE] via-[#F2EEFF] to-[#FAEAFE] p-7 border-2 border-[#BFF6FE] shadow-inner space-y-3">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 bg-[#008A90] text-white px-3.5 py-1 rounded-full text-xs font-black shadow">
                    <Sparkles className="w-4 h-4 text-amber-200 animate-spin-slow" />
                    <span>AI ?…í•™?¬ì •ê´€ & ì±„ìš©ê´€ ?‰ê? ?¼ë“œë°?/span>
                  </div>
                  <span className="text-xs font-black text-[#008A90] bg-white px-3 py-1 rounded-full border border-cyan-200">
                    ???€?™Â·ê¸°???œì¶œ ?¹ì¸??                  </span>
                </div>
                <p className="text-sm sm:text-base font-black text-[#1A1626] leading-relaxed">
                  {viewingItem.aiFeedback}
                </p>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between border-t-2 border-purple-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingItem(viewingItem);
                    setViewingItem(null);
                  }}
                  className="px-5 py-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7B5CF0] font-black text-sm flex items-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>?˜ì •?˜ê¸°</span>
                </button>
                <button
                  onClick={() => handleDeleteItem(viewingItem.id)}
                  className="px-5 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-black text-sm flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>?? œ?˜ê¸°</span>
                </button>
              </div>
              
              <button
                onClick={() => setViewingItem(null)}
                className="px-8 py-3.5 rounded-2xl bg-[#7B5CF0] hover:bg-[#6240D5] text-white font-black text-sm shadow-md transition-all cursor-pointer"
              >
                ?«ê¸° &rarr;
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: ?¬íŠ¸?´ë¦¬???˜ì • ëª¨ë‹¬ (Edit Modal)
         ========================================================================= */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-[36px] p-8 sm:p-10 shadow-[0_25px_80px_rgba(0,0,0,0.5)] border-4 border-purple-200 relative max-h-[90vh] overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between border-b-2 border-purple-100 pb-4">
              <h3 className="text-xl sm:text-2xl font-headline font-black text-[#1A1626]">
                ?ï¸ ?¬íŠ¸?´ë¦¬???´ì—­ ì§ì ‘ ?˜ì •
              </h3>
              <button onClick={() => setEditingItem(null)} className="p-2 rounded-full bg-purple-50 text-[#7B5CF0] font-bold">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateItem} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-[#3B364C] block mb-1">?·ï¸??œë™ ë¶„ë¥˜</label>
                  <select
                    value={["ì§„í•™Â·?êµ¬ (êµê³¼)", "?™ì•„ë¦?·ì??(ì°½ì‘)", "?…ì„œÂ·?ˆìˆ ", "?… ?ê²©ì¦?].includes(editingItem.category) ? editingItem.category : "?› ï¸?ê¸°í?(ì§ì ‘?…ë ¥)"}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "?› ï¸?ê¸°í?(ì§ì ‘?…ë ¥)") {
                        setEditingItem({ ...editingItem, category: "?ìœ¨ ?ìƒ‰" });
                      } else {
                        setEditingItem({ ...editingItem, category: val });
                      }
                    }}
                    className="w-full h-12 px-4 rounded-xl bg-purple-50 border border-[#B8AAFA] font-black text-sm text-[#1A1626]"
                  >
                    <option value="ì§„í•™Â·?êµ¬ (êµê³¼)">ì§„í•™Â·?êµ¬ (êµê³¼)</option>
                    <option value="?™ì•„ë¦?·ì??(ì°½ì‘)">?™ì•„ë¦?·ì??(ì°½ì‘)</option>
                    <option value="?…ì„œÂ·?ˆìˆ ">?…ì„œÂ·?ˆìˆ </option>
                    <option value="?… ?ê²©ì¦?>?… ?ê²©ì¦?/option>
                    <option value="?› ï¸?ê¸°í?(ì§ì ‘?…ë ¥)">?› ï¸?ê¸°í?(ì§ì ‘?…ë ¥)</option>
                  </select>
                  {!["ì§„í•™Â·?êµ¬ (êµê³¼)", "?™ì•„ë¦?·ì??(ì°½ì‘)", "?…ì„œÂ·?ˆìˆ ", "?… ?ê²©ì¦?].includes(editingItem.category) && (
                    <input
                      type="text"
                      placeholder="ë¶„ë¥˜ ì§ì ‘ ?…ë ¥ (?? ë´‰ì‚¬?œë™, ?™êµ?œì•ˆ)"
                      value={editingItem.category}
                      onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                      className="w-full h-10 px-3 mt-2 rounded-lg bg-white border border-[#7B5CF0] text-xs font-black text-[#7B5CF0] focus:outline-none shadow-inner"
                    />
                  )}
                </div>

                <div>
                  <label className="text-xs font-black text-[#3B364C] block mb-1">???˜í–‰ ê¸°ê°„</label>
                  <input
                    type="text"
                    value={editingItem.dateRange || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, dateRange: e.target.value })}
                    placeholder="?? 2026.05.01 ~ 2026.07.15"
                    className="w-full h-12 px-4 rounded-xl bg-purple-50 border border-[#B8AAFA] font-black text-sm text-[#1A1626]"
                  >
                  </input>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-[#3B364C] block mb-1">?“Œ ?œë™ ?œëª© (?ëŠ” ?ê²©ì¦ëª…)</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-purple-50 border border-[#B8AAFA] font-bold text-sm text-[#1A1626]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-black text-[#3B364C] block mb-1">?“ ?˜í–‰ ?´ìš© ë°?ê³ ì°°</label>
                <textarea
                  rows={6}
                  value={editingItem.content}
                  onChange={(e) => setEditingItem({ ...editingItem, content: e.target.value })}
                  className="w-full p-4 rounded-2xl bg-purple-50 border border-[#B8AAFA] font-semibold text-sm text-[#1A1626] leading-relaxed"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-[#3B364C] block mb-1">?“· ?¸ì¦ ?¬ì§„ ?˜ì • (?©ëŸ‰ 88% ?•ì¶•)</label>
                  <div className="border-2 border-dashed border-[#B8AAFA] rounded-xl p-3 text-center bg-purple-50 relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    {editingItem.photoUrl ? (
                      <div className="flex items-center justify-center gap-2">
                        <img src={editingItem.photoUrl} alt="preview" className="w-10 h-10 object-cover rounded" />
                        <span className="text-xs font-bold text-purple-800">???¬ì§„?¼ë¡œ êµì²´</span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-500">?´ë¦­?˜ì—¬ ???¸ì¦ ?¬ì§„ ?…ë¡œ??/span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-[#3B364C] block mb-1">?·ï¸???Ÿ‰ ?œê·¸ (?¼í‘œ êµ¬ë¶„)</label>
                  <input
                    type="text"
                    value={editingItem.tags ? editingItem.tags.join(", ") : ""}
                    onChange={(e) => setEditingItem({ ...editingItem, tags: e.target.value.split(",").map(t => t.trim()).filter(t => t) })}
                    className="w-full h-12 px-4 rounded-xl bg-purple-50 border border-[#B8AAFA] font-bold text-sm text-[#1A1626]"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-purple-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-sm text-[#5C5672]"
                >
                  ì·¨ì†Œ
                </button>
                <button
                  type="submit"
                  className="py-3 px-8 rounded-xl bg-[#7B5CF0] hover:bg-[#643DDD] text-white font-black text-sm shadow-lg"
                >
                  ?˜ì • ?¬í•­ ë°˜ì˜?˜ê¸°
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Portfolio;
