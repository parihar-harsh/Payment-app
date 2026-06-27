import { Brand } from "./Brand";
import { useAuth } from "../auth/useAuth";
import { Button } from "./Button";

export const Appbar = () => {
  const { user, signOut } = useAuth();
  const displayName = user?.firstName || "Account";
  const initials = `${user?.firstName?.[0] || "A"}${user?.lastName?.[0] || ""}`.toUpperCase();

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Brand />
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="hidden text-right sm:block">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Signed in as</p>
            <p className="mt-0.5 text-sm font-bold text-slate-800">{displayName}</p>
          </div>
          <div className="grid h-11 w-11 place-items-center rounded-full bg-indigo-100 text-sm font-black text-indigo-700">
            {initials}
          </div>
          <Button label="Sign out" variant="secondary" onClick={signOut} className="hidden sm:inline-flex" />
          <button
            type="button"
            onClick={signOut}
            className="text-sm font-bold text-slate-600 hover:text-slate-950 sm:hidden"
          >
            Exit
          </button>
        </div>
      </div>
    </header>
  );
};
