interface InputProps {
  label: string;
  name?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export default function Input({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
  defaultValue,
  value,
  onChange,
  className = "",
}: InputProps) {
  const isControlled = value !== undefined && onChange !== undefined;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          required={required}
          placeholder={placeholder}
          defaultValue={isControlled ? undefined : defaultValue}
          value={isControlled ? value : undefined}
          onChange={isControlled ? (e) => onChange(e.target.value) : undefined}
          rows={5}
          className="rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          defaultValue={isControlled ? undefined : defaultValue}
          value={isControlled ? value : undefined}
          onChange={isControlled ? (e) => onChange(e.target.value) : undefined}
          className="rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
        />
      )}
    </div>
  );
}
