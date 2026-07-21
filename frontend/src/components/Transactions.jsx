import { useCallback, useEffect, useState } from "react";
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [nextCursor, setNextCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  const loadTransactions = useCallback((cursor = null, signal = undefined) => {
    if (cursor) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError("");

    return api.get("/account/transactions", {
      params: {
        limit: 5,
        ...(cursor ? { cursor } : {}),
      },
      signal,
    })
      .then((response) => {
        const items = response.data.transactions || [];
        const pagination = response.data.pagination || {};

        setTransactions((prev) => (cursor ? [...prev, ...items] : items));
        setNextCursor(pagination.nextCursor || null);
        setHasMore(Boolean(pagination.hasMore));
      })
      .catch((requestError) => {
        if (requestError.code !== "ERR_CANCELED") {
          setError(getApiError(requestError, "Unable to load activity"));
        }
      })
      .finally(() => {
        if (!signal?.aborted) {
          setLoading(false);
          setLoadingMore(false);
        }
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    loadTransactions(null, controller.signal);

    return () => controller.abort();
  }, [loadTransactions]);

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

      {!loading && hasMore && (
        <button
          type="button"
          onClick={() => loadTransactions(nextCursor)}
          disabled={loadingMore}
          className="mt-5 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loadingMore ? "Loading..." : "Load older transactions"}
        </button>
      )}
    </section>
  );
}
