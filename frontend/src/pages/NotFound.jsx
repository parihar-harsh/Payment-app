import { Link } from "react-router-dom";
import { Brand } from "../components/Brand";

export function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-5">
      <div className="max-w-md text-center">
        <div className="mb-10 flex justify-center"><Brand /></div>
        <p className="text-sm font-black uppercase tracking-[0.24em] text-indigo-600">404</p>
        <h1 className="mt-4 text-4xl font-black text-slate-950">This page does not exist.</h1>
        <p className="mt-4 leading-7 text-slate-600">The address may be incorrect or the page may have moved.</p>
        <Link
          to="/"
          className="mt-8 inline-flex min-h-11 items-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-700"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
