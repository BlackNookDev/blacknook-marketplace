/** Full-bleed atmospheric plane — soft charcoal with cool silver light. */
export default function SiteBackground() {
  return (
    <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden bg-[var(--bn-bg)]" aria-hidden>
      <div className="bn-atmosphere absolute inset-0" />
      <div className="bn-grain absolute inset-0 opacity-[0.022]" />
      <div className="absolute inset-x-0 top-0 h-[75vh] bg-[radial-gradient(ellipse_85%_60%_at_50%_-8%,rgba(255,255,255,0.14),transparent_72%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[40vh] bg-[radial-gradient(ellipse_70%_50%_at_50%_110%,rgba(140,140,150,0.08),transparent_70%)]" />
    </div>
  );
}
