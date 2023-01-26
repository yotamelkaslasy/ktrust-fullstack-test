import { forwardRef } from "react";

interface InputFieldProps {
  required?: boolean;
  autoComplete?: string;
  htmlFor: string;
  label: string;
  type?: string;
  autoFocus?: boolean;
  "aria-invalid"?: boolean;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (props, ref) => {
    const {
      htmlFor,
      label,
      required,
      autoComplete,
      autoFocus,
      type = "text",
      ...restInputProps
    } = props;

    return (
      <>
        <label htmlFor={htmlFor} className="font-semibold text-blue-600">
          {label}
        </label>
        <input
          ref={ref}
          required={required || false}
          type={type}
          id={htmlFor}
          name={htmlFor}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          className="my-2 w-full border border-gray-200 p-2"
          {...restInputProps}
        />
      </>
    );
  }
);

InputField.displayName = "InputField";
