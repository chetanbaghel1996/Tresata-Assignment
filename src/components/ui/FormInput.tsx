import React, { forwardRef, useState } from "react";
import type { InputHTMLAttributes } from "react";

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  maxLength?: number;
  showCounter?: boolean;
  hideLabel?: boolean;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      maxLength,
      //   showCounter = true,
      hideLabel = false,
      className = "",
      value,
      onChange,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [touched, setTouched] = useState(false);
    const [internalValue, setInternalValue] = useState(value || "");

    const currentValue = value !== undefined ? value : internalValue;
    // const currentLength = String(currentValue).length;
    // const remaining = maxLength ? maxLength - currentLength : 0;
    const hasError = error && touched;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setTouched(true);
      onBlur?.(e);
    };

    const fieldGroupClasses = ["field-group", hasError && "has-error"]
      .filter(Boolean)
      .join(" ");

    const inputClasses = ["text-input", className].filter(Boolean).join(" ");

    return (
      <div className={fieldGroupClasses}>
        {label && (
          <label
            className={hideLabel ? "visually-hidden" : ""}
            htmlFor={props.id}
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          className={inputClasses}
          value={currentValue}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={maxLength}
          aria-invalid={hasError ? "true" : "false"}
          {...props}
        />
        {/* 
        {(showCounter || hasError) && (
          <div className="field-meta" aria-live="polite">
            {showCounter && maxLength && (
              <span className="count" title="Characters remaining">
                {remaining}
              </span>
            )}
            {hasError && <span className="error-text">{error}</span>}
          </div>
        )} */}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;
