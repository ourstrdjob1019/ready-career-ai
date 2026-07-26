import React from "react";
import { MASCOT_ASSETS } from "../assets/mascotData";
import { Sparkles } from "lucide-react";

export interface MascotAriProps {
  pose?: "avatar" | "sticker" | "celebrate" | "roadmap";
  size?: "sm" | "md" | "lg";
  bubbleMessage?: string;
  bubbleTitle?: string;
  rotate?: boolean;
  className?: string;
}

export const MascotAri: React.FC<MascotAriProps> = ({
  pose = "sticker",
  size = "md",
  bubbleMessage,
  bubbleTitle = "Ari's Hint",
  rotate = true,
  className = "",
}) => {
  const getAsset = () => {
    switch (pose) {
      case "avatar":
        return MASCOT_ASSETS.avatar;
      case "celebrate":
        return MASCOT_ASSETS.celebrate;
      case "roadmap":
        return MASCOT_ASSETS.starRoadmapIcon;
      default:
        return MASCOT_ASSETS.sticker3D;
    }
  };

  const sizeClass = {
    sm: "w-12 h-12",
    md: "w-24 h-24 md:w-28 md:h-28",
    lg: "w-36 h-36 md:w-48 md:h-48",
  };

  const rotationClass = rotate ? "-rotate-[15deg]" : "";

  if (bubbleMessage) {
    return (
      <div className={`flex items-start gap-3 my-2 ${className}`}>
        <div className={`relative flex-shrink-0 transition-transform duration-300 hover:scale-105 ${sizeClass[size]} ${rotationClass}`}>
          <div className="w-full h-full rounded-full bg-secondary/10 p-2 shadow-3d-base border border-secondary/20 flex items-center justify-center">
            <img 
              src={getAsset()} 
              alt="ReadyCareer AI Mascot Ari" 
              className="w-full h-full object-contain drop-shadow-md"
            />
          </div>
          <span className="absolute -top-1 -right-1 p-1 bg-secondary text-white rounded-full shadow-sm">
            <Sparkles className="w-3 h-3" />
          </span>
        </div>
        
        {/* Teal Conversational Bubble */}
        <div className="flex-grow bg-secondary-container/30 border-2 border-secondary/25 p-4 rounded-3xl rounded-tl-none shadow-3d-base relative backdrop-blur-sm mt-2">
          <div className="flex items-center gap-1.5 mb-1 text-secondary-spot font-headline font-bold text-label-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{bubbleTitle}</span>
          </div>
          <p className="font-body-md text-text-primary text-sm md:text-base leading-relaxed">
            {bubbleMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative transition-transform duration-300 hover:scale-105 select-none pointer-events-auto ${sizeClass[size]} ${rotationClass} ${className}`}>
      <img
        src={getAsset()}
        alt="ReadyCareer AI Mascot Ari"
        className="w-full h-full object-contain drop-shadow-xl"
      />
    </div>
  );
};
