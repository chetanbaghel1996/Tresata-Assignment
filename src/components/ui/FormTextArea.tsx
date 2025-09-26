import React, { forwardRef, useState } from "react";
import type { TextareaHTMLAttributes } from "react";

export interface FormTextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  maxLength?: number;
  showCounter?: boolean;
  hideLabel?: boolean;
}

const FormTextArea = forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
  (
    {
      label,
      error,
      maxLength,
      showCounter = true,
      hideLabel = false,
      className = "",
      value,
      onChange,
      onBlur,
      rows = 4,
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

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (value === undefined) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setTouched(true);
      onBlur?.(e);
    };

    const fieldGroupClasses = ["field-group", hasError && "has-error"]
      .filter(Boolean)
      .join(" ");

    const textareaClasses = ["text-area", className].filter(Boolean).join(" ");

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

        <textarea
          ref={ref}
          className={textareaClasses}
          value={currentValue}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={maxLength}
          rows={rows}
          aria-invalid={hasError ? "true" : "false"}
          {...props}
        />

        {/* {(showCounter || hasError) && (
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

FormTextArea.displayName = "FormTextArea";

export default FormTextArea;
