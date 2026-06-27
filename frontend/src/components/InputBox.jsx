import PropTypes from "prop-types";

export function InputBox({
  id,
  label,
  placeholder,
  onChange,
  value,
  type = "text",
  autoComplete,
  error,
  min,
  required = false,
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>
      <input
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        autoComplete={autoComplete}
        min={min}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:ring-4 ${
          error
            ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
            : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-100"
        }`}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}

InputBox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  type: PropTypes.string,
  autoComplete: PropTypes.string,
  error: PropTypes.string,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  required: PropTypes.bool,
};
