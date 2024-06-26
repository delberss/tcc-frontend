import React, { ChangeEvent } from 'react';

interface FormFieldProps {
  label: string;
  type: string;
  name: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type,
  name,
  id,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <fieldset>
      <label htmlFor={id}>
        {label}
        <input
          type={type}
          name={name}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </label>
    </fieldset>
  );
};

export default FormField;
