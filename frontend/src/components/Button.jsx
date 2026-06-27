import PropTypes from "prop-types";

const variants = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-200",
  secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-200",
  danger: "bg-rose-50 text-rose-700 hover:bg-rose-100 focus:ring-rose-200",
};

export function Button({
  label,
  onClick,
  type = "button",
  loading = false,
  disabled = false,
  variant = "primary",
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
        />
      )}
      {loading ? "Please wait…" : label}
    </button>
  );
}

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(Object.keys(variants)),
  className: PropTypes.string,
};
