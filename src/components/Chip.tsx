import React from "react";
import type { ButtonHTMLAttributes } from "react";

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  variant?: "default" | "teal" | "gradient" | "error";
  size?: "sm" | "md";
  icon?: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({
  children,
  active = false,
  variant = "default",
  size = "md",
  icon,
  className = "",
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-headline transition-all duration-150 active:scale-95 select-none flex-shrink-0 whitespace-nowrap";

  const sizeStyles = {
    sm: "px-3 py-1 text-[11px] font-semibold gap-1",
    md: "px-5 py-2.5 text-label-lg font-bold gap-1.5",
  };

  const getVariantStyles = () => {
    if (active) {
      if (variant === "teal") return "bg-secondary text-on-secondary shadow-3d-ambient bezel-effect";
      return "bg-primary text-on-primary shadow-3d-ambient bezel-effect";
    }

    switch (variant) {
      case "gradient":
        return "chip-gradient text-primary border border-primary/20 hover:bg-primary/15 font-semibold shadow-sm";
      case "teal":
        return "bg-secondary-container/40 text-secondary-spot hover:bg-secondary-container/70 font-semibold";
      case "error":
        return "bg-error-container text-on-error-container hover:opacity-90 font-semibold";
      default:
        return "bg-surface-container text-text-muted hover:bg-surface-container-low hover:text-text-primary shadow-sm";
    }
  };

  return (
    <button
      type="button"
      className={`${baseStyles} ${sizeStyles[size]} ${getVariantStyles()} ${className}`}
      {...props}
    >
      {icon && <span className="w-4 h-4 flex items-center justify-center">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
