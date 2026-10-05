"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [{ href: "/", label: "Home" }, { href: "/binders", label: "Binders" }, { href: "/library", label: "Library" }, { href: "/collection", label: "My Collection" }];

export function Sidebar() {
  const path = usePathname();
  const active = (h: string) => (h === "/" ? path === "/" : path.startsWith(h));
  return (
    <nav aria-label="Main" className="flex w-16 shrink-0 flex-col gap-1 border-r border-line p-3 sm:w-52">
      <div className="mb-4 px-2 text-lg font-semibold"><span className="sm:hidden">CB</span><span className="hidden sm:inline">CardBinder</span></div>
      {NAV.map(n => (
        <Link key={n.href} href={n.href} aria-current={active(n.href) ? "page" : undefined}
          className={`truncate rounded-lg px-2 py-2 text-sm ${active(n.href) ? "border border-line bg-panel font-medium" : "text-mute hover:text-ink"}`}>
          {n.label}
        </Link>
      ))}
      <span className="truncate px-2 py-2 text-sm text-mute/60" title="Coming later">Import</span>
      <span className="truncate px-2 py-2 text-sm text-mute/60" title="Coming later">Settings</span>
      <div className="mt-auto hidden px-2 py-2 text-xs text-mute sm:block">Local collection<br />Cloud sync is off</div>
    </nav>
  );
}
