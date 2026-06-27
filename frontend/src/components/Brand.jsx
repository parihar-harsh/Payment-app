import PropTypes from "prop-types";

export function Brand({ light = false }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`grid h-10 w-10 place-items-center rounded-xl font-black ${
        light ? "bg-white text-indigo-700" : "bg-indigo-600 text-white"
      }`}>
        P
      </div>
      <div>
        <p className={`text-lg font-bold leading-none ${light ? "text-white" : "text-slate-950"}`}>
          Payflow
        </p>
        <p className={`mt-1 text-xs ${light ? "text-indigo-200" : "text-slate-500"}`}>
          Simple money transfers
        </p>
      </div>
    </div>
  );
}

Brand.propTypes = {
  light: PropTypes.bool,
};
