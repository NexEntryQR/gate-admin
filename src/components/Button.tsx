import type { ButtonHTMLAttributes, ReactNode } from "react";
import { buttonClasses } from "../lib/buttonStyles.ts";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
}

export function Button({ variant = "primary", size = "md", icon, className = "", children, ...props }: ButtonProps) {
  return (
    <button className={buttonClasses(variant, size, className)} {...props}>
      {icon}
      {children}
    </button>
  );
}
