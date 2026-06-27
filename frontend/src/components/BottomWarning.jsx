import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export function BottomWarning({ label, buttonText, to }) {
  return (
    <p className="text-center text-sm text-slate-600">
      {label}{" "}
      <Link className="font-bold text-indigo-700 hover:text-indigo-900 hover:underline" to={to}>
        {buttonText}
      </Link>
    </p>
  );
}

BottomWarning.propTypes = {
  label: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};
