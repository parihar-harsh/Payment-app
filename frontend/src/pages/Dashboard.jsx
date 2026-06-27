import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api, { getApiError } from "../api/client";
import { useAuth } from "../auth/useAuth";
import { Alert } from "../components/Alert";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Transactions } from "../components/Transactions";
import { Users } from "../components/Users";

export const Dashboard = () => {
  const [balance, setBalance] = useState(0);
  const [currency, setCurrency] = useState("INR");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [notice] = useState(() => location.state?.notice || "");

  useEffect(() => {
    const controller = new AbortController();

    api.get("/account/balance", { signal: controller.signal })
      .then((response) => {
        setBalance(response.data.balance);
        setCurrency(response.data.currency || "INR");
      })
      .catch((requestError) => {
        if (requestError.code !== "ERR_CANCELED") {
          setError(getApiError(requestError, "Unable to load your balance"));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (location.state?.notice) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Appbar />
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
              Wallet overview
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Welcome{user?.firstName ? `, ${user.firstName}` : ""}.
            </h1>
            <p className="mt-2 text-slate-600">Manage your demo balance and recent transfers.</p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Secure demo wallet
          </div>
        </div>

        {notice && (
          <div className="mb-6"><Alert tone="success">{notice}</Alert></div>
        )}
        {error && <div className="mb-6"><Alert>{error}</Alert></div>}

        <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="space-y-6">
            <Balance value={balance} currency={currency} loading={loading} />
            <Transactions />
          </div>
          <Users />
        </div>

        <footer className="mt-10 border-t border-slate-200 pt-6 text-center text-xs leading-5 text-slate-500">
          Payflow is a demonstration wallet. Balances are simulated and do not represent real money.
        </footer>
      </main>
    </div>
  );
};
