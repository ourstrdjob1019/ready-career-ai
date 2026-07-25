import React, { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className = "", ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-2">
        {label && (
          <label className="font-headline font-semibold text-label-lg text-text-primary px-1">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {icon && (
            <span className="absolute left-4 text-text-muted flex items-center justify-center pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={`w-full h-14 bg-input-fill text-text-primary placeholder:text-text-muted/60 font-body-md rounded-[20px] px-5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${
              icon ? "pl-12" : ""
            } ${error ? "ring-2 ring-error/80 bg-error-container/20" : ""} ${className}`}
            {...props}
          />
        </div>
        {hint && !error && (
          <p className="font-body-md text-label-sm text-text-muted px-1.5">
            {hint}
          </p>
        )}
        {error && (
          <p className="font-body-md text-label-sm text-error font-semibold px-1.5 flex items-center gap-1">
            <span>●</span> {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
