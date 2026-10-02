import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Spinner } from "./Spinner";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  isLoading?: boolean;
  children: ReactNode;
}

const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400",
  secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  danger: "bg-red-600 text-white hover:bg-red-700",
} as const;

export function Button({
  variant = "primary",
  isLoading = false,
  disabled,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-70 ${variants[variant]} ${className}`}
      {...rest}
    >
      {isLoading && <Spinner size="sm" />}
      {children}
    </button>
  );
}