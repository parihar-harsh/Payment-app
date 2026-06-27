import PropTypes from "prop-types";

const formatCurrency = (value, currency) => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency,
  maximumFractionDigits: 0,
}).format(value);

export const Balance = ({ value, currency = "INR", loading = false }) => (
  <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-xl shadow-slate-200 sm:p-9">
    <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-indigo-500/30 blur-2xl" />
    <div className="relative">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
        Available balance
      </p>
      {loading ? (
        <div className="mt-5 h-12 w-52 animate-pulse rounded-xl bg-white/10" />
      ) : (
        <p className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
          {formatCurrency(value, currency)}
        </p>
      )}
      <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">
        Your balance updates after every completed transfer.
      </p>
    </div>
  </section>
);

Balance.propTypes = {
  value: PropTypes.number.isRequired,
  currency: PropTypes.string,
  loading: PropTypes.bool,
};
