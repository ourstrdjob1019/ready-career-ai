import React from "react";
import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "hero" | "teal";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  icon,
  className = "",
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-headline rounded-full transition-all duration-200 active:scale-[0.98] select-none focus:outline-none focus:ring-2 focus:ring-primary/50";
  
  const sizeStyles = {
    sm: "px-4 py-2 text-label-sm font-semibold gap-1.5 h-10",
    md: "px-6 py-3 text-title-md font-semibold gap-2 h-14", // Standard 56px touch target
    lg: "px-8 py-4 text-headline-md font-bold gap-3 h-16 shadow-3d-ambient",
  };

  const variantStyles = {
    primary: "bg-primary text-on-primary shadow-3d-base hover:bg-primary-base hover:shadow-3d-ambient hover:-translate-y-0.5",
    secondary: "bg-surface-container text-on-surface font-semibold hover:bg-surface-container-high hover:shadow-sm",
    outline: "border-2 border-secondary text-secondary font-bold bg-transparent hover:bg-secondary/5",
    teal: "bg-secondary text-on-secondary shadow-3d-base hover:bg-secondary-spot hover:shadow-3d-ambient",
    hero: "gradient-hero-card text-white font-bold shadow-3d-ambient bezel-effect hover:shadow-3d-hover hover:-translate-y-1",
  };

  const widthStyle = fullWidth ? "w-full" : "w-auto";

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
