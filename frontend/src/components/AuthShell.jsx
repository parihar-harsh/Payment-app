import PropTypes from "prop-types";
import { Brand } from "./Brand";

export function AuthShell({ eyebrow, title, description, children, footer }) {
  return (
    <main className="min-h-screen bg-slate-950">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-indigo-700 p-12 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-32 -top-24 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-fuchsia-400/20 blur-3xl" />
          <div className="relative">
            <Brand light />
          </div>
          <div className="relative max-w-lg">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.24em] text-indigo-200">
              Built for clarity
            </p>
            <h2 className="text-5xl font-black leading-tight text-white">
              Move money without losing track of it.
            </h2>
            <p className="mt-6 text-lg leading-8 text-indigo-100">
              Search people, transfer securely, and see every balance change in one focused workspace.
            </p>
          </div>
          <div className="relative flex items-center gap-5 text-sm text-indigo-200">
            <span>Protected sessions</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-indigo-300" />
            <span>Atomic transfers</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-indigo-300" />
            <span>Demo funds</span>
          </div>
        </section>

        <section className="flex items-center justify-center bg-slate-50 px-5 py-10 sm:px-10">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <Brand />
            </div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">{eyebrow}</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-950">{title}</h1>
            <p className="mt-3 leading-7 text-slate-600">{description}</p>
            <div className="mt-8">{children}</div>
            <div className="mt-7">{footer}</div>
          </div>
        </section>
      </div>
    </main>
  );
}

AuthShell.propTypes = {
  eyebrow: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node.isRequired,
};
