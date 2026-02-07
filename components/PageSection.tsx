"use client";

export default function PageSection({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative max-w-6xl mx-auto p-6 space-y-12 animate-fadeIn">
      {/* Global background glow */}
      <div className="absolute glow-bg top-0 left-1/2 -translate-x-1/2" />

      {children}
    </main>
  );
}