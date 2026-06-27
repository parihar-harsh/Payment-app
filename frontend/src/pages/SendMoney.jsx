import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api, { getApiError } from "../api/client";
import { Alert } from "../components/Alert";
import { Brand } from "../components/Brand";
import { Button } from "../components/Button";
import { InputBox } from "../components/InputBox";

export const SendMoney = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id") || "";
  const name = (searchParams.get("name") || "").trim();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const validRecipient = /^[a-f\d]{24}$/i.test(id) && Boolean(name);
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    const numericAmount = Number(amount);
    if (!Number.isInteger(numericAmount) || numericAmount <= 0) {
      setError("Enter a positive whole INR amount.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/account/transfer", {
        to: id,
        amount: numericAmount,
      });
      navigate("/dashboard", {
        replace: true,
        state: {
          notice: `${new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
          }).format(numericAmount)} sent to ${name}.`,
        },
      });
    } catch (requestError) {
      setError(getApiError(requestError, "Unable to complete the transfer"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 sm:py-12">
      <div className="mx-auto max-w-lg">
        <div className="mb-8 flex items-center justify-between">
          <Brand light />
          <Link className="text-sm font-bold text-slate-300 hover:text-white" to="/dashboard">
            Back to dashboard
          </Link>
        </div>

        <section className="rounded-3xl bg-white p-6 shadow-2xl sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">New transfer</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Send money</h1>

          {!validRecipient ? (
            <div className="mt-7 space-y-5">
              <Alert>The recipient link is incomplete or invalid.</Alert>
              <Link className="inline-block font-bold text-indigo-700 hover:underline" to="/dashboard">
                Choose someone from the directory
              </Link>
            </div>
          ) : (
            <>
              <div className="my-7 flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-indigo-100 font-black text-indigo-700">
                  {initials}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sending to</p>
                  <p className="mt-1 font-black text-slate-900">{name}</p>
                </div>
              </div>

              <form onSubmit={submit} className="space-y-5">
                {error && <Alert>{error}</Alert>}
                <InputBox
                  id="amount"
                  label="Amount in INR"
                  placeholder="Enter a whole amount"
                  type="number"
                  min={1}
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  required
                />
                <Button label={`Send to ${name}`} type="submit" loading={loading} className="w-full" />
                <p className="text-center text-xs leading-5 text-slate-500">
                  Demo transfers are final once confirmed by the server. No real money is moved.
                </p>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  );
};
