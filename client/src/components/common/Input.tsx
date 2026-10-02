import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = "", ...rest }, ref) => {
    const inputId = id ?? rest.name ?? label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`rounded-md border px-3 py-2 text-sm outline-none transition
            focus:ring-2 focus:ring-blue-500
            ${error ? "border-red-500" : "border-gray-300"}
            ${className}`}
          {...rest}
        />
        {error && <span className="text-xs text-red-600">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";