export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1
        style={{ fontFamily: 'var(--font-display)' }}
        className="text-5xl font-normal tracking-tight text-[var(--brand-text)]"
      >
        [BRAND]
      </h1>
      <p className="mt-4 text-[var(--brand-text-secondary)]">
        Plattformen byggs — kom tillbaka snart.
      </p>
    </main>
  )
}
