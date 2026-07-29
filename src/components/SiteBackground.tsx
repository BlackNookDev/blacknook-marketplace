/** Full-bleed atmospheric plane — cool silver light, no purple glow. */
export default function SiteBackground() {
  return (
    <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden bg-[var(--bn-bg)]" aria-hidden>
      <div className="bn-atmosphere absolute inset-0" />
      <div className="bn-grain absolute inset-0 opacity-[0.035]" />
      <div className="absolute inset-x-0 top-0 h-[70vh] bg-[radial-gradient(ellipse_80%_55%_at_50%_-10%,rgba(255,255,255,0.09),transparent_70%)]" />
    </div>
  );
}
