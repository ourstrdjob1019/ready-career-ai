import React from "react";

export interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  variant?: "primary" | "teal" | "gradient";
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = "primary",
  showLabel = false,
  label,
  className = "",
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const getVariantStyles = () => {
    switch (variant) {
      case "teal":
        return {
          track: "bg-secondary/15",
          indicator: "bg-secondary shadow-sm",
        };
      case "gradient":
        return {
          track: "bg-primary/15",
          indicator: "gradient-hero-card shadow-sm",
        };
      default:
        return {
          track: "bg-primary/20",
          indicator: "bg-primary shadow-sm",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center px-1 font-headline text-label-sm">
          <span className="text-text-primary font-semibold">{label || "진행률"}</span>
          <span className="text-primary font-bold">{percentage}%</span>
        </div>
      )}
      <div className={`w-full h-3 rounded-full overflow-hidden ${styles.track}`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${styles.indicator}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};
