import React from "react";
import type { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "surface" | "activity" | "hero" | "glass" | "interactive";
  padding?: "sm" | "md" | "lg" | "none";
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = "activity",
  padding = "md",
  hoverEffect = true,
  className = "",
  ...props
}) => {
  const baseStyles = "rounded-[28px] md:rounded-[32px] transition-all duration-300 relative overflow-hidden";
  
  const paddingStyles = {
    none: "p-0",
    sm: "p-4 md:p-5",
    md: "p-6 md:p-7",
    lg: "p-8 md:p-10",
  };

  const hoverStyles = hoverEffect 
    ? "hover:-translate-y-1 hover:shadow-3d-hover cursor-pointer" 
    : "";

  const variantStyles = {
    activity: "bg-surface-container-lowest shadow-3d-base border border-surface-variant/40",
    surface: "bg-surface-container-low border border-surface-variant/20 shadow-sm",
    interactive: "bg-white shadow-3d-base border border-surface-variant/30 hover:border-primary/40",
    hero: "gradient-hero-card text-white shadow-3d-ambient bezel-effect",
    glass: "bg-white/70 backdrop-blur-xl border-t-[1.5px] border-l-[1.5px] border-white/60 shadow-3d-ambient",
  };

  return (
    <div
      className={`${baseStyles} ${paddingStyles[padding]} ${variantStyles[variant]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
