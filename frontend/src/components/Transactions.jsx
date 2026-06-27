import { useEffect, useState } from "react";
import api, { getApiError } from "../api/client";
import { Alert } from "./Alert";

const formatAmount = (amount, currency) => new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency,
  maximumFractionDigits: 0,
}).format(amount);

export function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    api.get("/account/transactions", {
      params: { page: 1, limit: 5 },
      signal: controller.signal,
    })
      .then((response) => setTransactions(response.data.transactions))
      .catch((requestError) => {
        if (requestError.code !== "ERR_CANCELED") {
          setError(getApiError(requestError, "Unable to load activity"));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Recent activity</p>
      <h2 className="mt-2 text-2xl font-black text-slate-950">Transactions</h2>

      {error && <div className="mt-5"><Alert>{error}</Alert></div>}

      <div className="mt-5 divide-y divide-slate-100">
        {loading ? (
          [...Array(3)].map((_, index) => (
            <div key={index} className="flex animate-pulse justify-between py-4">
              <div className="h-4 w-24 rounded bg-slate-100" />
              <div className="h-4 w-20 rounded bg-slate-100" />
            </div>
          ))
        ) : transactions.length ? (
          transactions.map((transaction) => {
            const debit = transaction.type === "debit";
            return (
              <div key={transaction.id} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="font-bold text-slate-800">{debit ? "Money sent" : "Money received"}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Intl.DateTimeFormat("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(transaction.createdAt))}
                  </p>
                </div>
                <p className={`font-black ${debit ? "text-slate-800" : "text-emerald-600"}`}>
                  {debit ? "−" : "+"}{formatAmount(transaction.amount, transaction.currency)}
                </p>
              </div>
            );
          })
        ) : (
          <div className="py-10 text-center">
            <p className="font-bold text-slate-700">No transactions yet</p>
            <p className="mt-1 text-sm text-slate-500">Your completed transfers will appear here.</p>
          </div>
        )}
      </div>
    </section>
  );
}
