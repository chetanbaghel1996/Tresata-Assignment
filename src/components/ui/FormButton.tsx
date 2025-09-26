import React, { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

export interface FormButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

const FormButton = forwardRef<HTMLButtonElement, FormButtonProps>(
  ({ variant = "primary", className = "", children, ...props }, ref) => {
    const buttonClasses = ["btn", variant, className].filter(Boolean).join(" ");

    return (
      <button ref={ref} className={buttonClasses} {...props}>
        {children}
      </button>
    );
  }
);

FormButton.displayName = "FormButton";

export default FormButton;
