import Link from "next/link";

export default function BirthdaysPage() {
  return (
    <main className="min-h-screen grid place-items-center p-6" style={{ background: "var(--bh-bg)" }}>
      <div className="bh-card max-w-lg w-full p-8 text-center">
        <p className="text-[11px] uppercase tracking-[0.2em] font-semibold" style={{ color: "var(--bh-accent)" }}>BirthdayHub</p>
        <h1 className="text-3xl font-bold mt-2">My Birthdays</h1>
        <p className="mt-2" style={{ color: "var(--bh-muted)" }}>Birthday page is working!</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/login" className="bh-btn">Sign in</Link>
          <Link href="/dashboard" className="bh-btn-ghost">Dashboard</Link>
        </div>
      </div>
    </main>
  );
}
