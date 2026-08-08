import { useState } from "react";
import Sidebar from "./Sidebar";
import { Logo } from "./ui";

const Burger = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

function Layout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="app-bg flex min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />

      <div className="flex min-h-screen w-full flex-col lg:pl-[264px]">
        <header className="sticky top-0 z-40 flex items-center gap-3.5 border-b border-line bg-canvas/85 px-4 py-3 backdrop-blur-xl sm:px-8 lg:hidden">
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-line bg-surface text-text"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Burger />
          </button>
          <Logo />
        </header>

        <main className="mx-auto w-full max-w-[1320px] flex-1 px-4 py-6 sm:px-8 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
