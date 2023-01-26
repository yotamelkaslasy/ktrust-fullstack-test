import { forwardRef } from "react";

interface SelectFieldProps {
  htmlFor: string;
  label: string;
  autoFocus?: boolean;
  value: any;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  "aria-invalid"?: boolean;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (props, ref) => {
    const { htmlFor, label, value, onChange } = props;

    return (
      <>
        <label htmlFor={htmlFor} className="font-semibold text-blue-600">
          {label}
        </label>
        <select
          ref={ref}
          value={value}
          onChange={onChange}
          id={htmlFor}
          name={htmlFor}
          className="my-2 w-full border border-gray-200 p-2"
        >
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </>
    );
  }
);

SelectField.displayName = "SelectField";
