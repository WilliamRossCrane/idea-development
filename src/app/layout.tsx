import "./globals.css";
import { StoreProvider } from "@/features/store";
import { Sidebar } from "@/components/layout/Sidebar";

export const metadata = { title: "CardBinder", description: "Organise your physical card binders visually." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body className="bg-paper text-ink antialiased">
      <StoreProvider><div className="flex min-h-screen"><Sidebar /><main className="min-w-0 flex-1 p-5 lg:p-10">{children}</main></div></StoreProvider>
    </body></html>
  );
}
