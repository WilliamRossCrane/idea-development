"use client";
import { Library } from "@/components/cards/Library";
export default function LibraryPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <h1 className="text-3xl font-semibold">Card library</h1>
      <Library wide />
    </div>
  );
}
