import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import api, { getApiError } from "../api/client";
import { Button } from "./Button";
import { Alert } from "./Alert";

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setPage(1);
  }, [filter]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get("/user/bulk", {
          params: { filter, page, limit: 8 },
          signal: controller.signal,
        });
        setUsers(response.data.user);
        setPages(Math.max(response.data.pagination?.pages || 1, 1));
      } catch (requestError) {
        if (requestError.code !== "ERR_CANCELED") {
          setError(getApiError(requestError, "Unable to load people"));
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [filter, page]);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Directory</p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">Send to someone</h2>
        </div>
        <label className="w-full sm:max-w-xs">
          <span className="sr-only">Search people</span>
          <input
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            type="search"
            placeholder="Search by name…"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
          />
        </label>
      </div>

      {error && <div className="mt-5"><Alert>{error}</Alert></div>}

      <div className="mt-5 divide-y divide-slate-100">
        {loading ? (
          [...Array(4)].map((_, index) => (
            <div key={index} className="flex animate-pulse items-center gap-3 py-4">
              <div className="h-11 w-11 rounded-full bg-slate-100" />
              <div className="h-4 w-32 rounded bg-slate-100" />
            </div>
          ))
        ) : users.length ? (
          users.map((user) => <UserRow key={user._id} user={user} />)
        ) : (
          <div className="py-12 text-center">
            <p className="font-bold text-slate-700">No people found</p>
            <p className="mt-1 text-sm text-slate-500">Try a different name.</p>
          </div>
        )}
      </div>

      {!loading && !error && pages > 1 && (
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-5">
          <Button
            label="Previous"
            variant="secondary"
            disabled={page === 1}
            onClick={() => setPage((current) => current - 1)}
          />
          <p className="text-sm font-semibold text-slate-500">Page {page} of {pages}</p>
          <Button
            label="Next"
            variant="secondary"
            disabled={page === pages}
            onClick={() => setPage((current) => current + 1)}
          />
        </div>
      )}
    </section>
  );
};

function UserRow({ user }) {
  const navigate = useNavigate();
  const name = `${user.firstName} ${user.lastName}`.trim();
  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div className="flex items-center justify-between gap-3 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-indigo-50 text-sm font-black text-indigo-700">
          {initials || "?"}
        </div>
        <p className="truncate font-bold text-slate-800">{name}</p>
      </div>
      <Button
        label="Send"
        onClick={() => navigate(`/send?id=${encodeURIComponent(user._id)}&name=${encodeURIComponent(name)}`)}
        className="min-h-10 px-4 py-2"
      />
    </div>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
  }).isRequired,
};
