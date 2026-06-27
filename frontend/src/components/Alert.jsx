import PropTypes from "prop-types";

const styles = {
  error: "border-rose-200 bg-rose-50 text-rose-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  info: "border-indigo-200 bg-indigo-50 text-indigo-800",
};

export function Alert({ children, tone = "error" }) {
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`rounded-xl border px-4 py-3 text-sm ${styles[tone]}`}>
      {children}
    </div>
  );
}

Alert.propTypes = {
  children: PropTypes.node.isRequired,
  tone: PropTypes.oneOf(Object.keys(styles)),
};
