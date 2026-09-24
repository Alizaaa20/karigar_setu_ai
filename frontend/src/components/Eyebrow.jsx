/**
 * Small numbered step label. Cataloging a product genuinely is a 3-step
 * sequence (speak → photo → connectivity), so a numbered marker encodes
 * real information here rather than being decorative.
 */
export default function Eyebrow({ step, label }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-[11px] font-bold text-paper">
        {step}
      </span>
      <span className="font-display text-sm font-semibold uppercase tracking-wide text-indigo-500">{label}</span>
    </div>
  );
}
