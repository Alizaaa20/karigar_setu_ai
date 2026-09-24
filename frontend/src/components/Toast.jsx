import { CheckCircle2, WifiOff, AlertTriangle } from 'lucide-react';

const VARIANT_STYLES = {
  success: { bg: 'bg-indigo-500', Icon: CheckCircle2 },
  offline: { bg: 'bg-madder-500', Icon: WifiOff },
  error: { bg: 'bg-madder-600', Icon: AlertTriangle },
};

/**
 * Fixed-position toast, anchored to the bottom of the phone frame (not the
 * whole browser window) so it reads correctly inside the simulated mobile
 * viewport. Parent is responsible for auto-dismiss timing.
 */
export default function Toast({ toast }) {
  if (!toast) return null;
  const { bg, Icon } = VARIANT_STYLES[toast.variant] || VARIANT_STYLES.success;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-24 z-50 flex justify-center px-4">
      <div
        className={`${bg} animate-toast-in pointer-events-auto flex items-start gap-2.5 rounded-2xl px-4 py-3 text-white shadow-card max-w-[320px]`}
        role="status"
      >
        <Icon size={20} className="mt-0.5 shrink-0" />
        <p className="text-sm font-medium leading-snug">{toast.message}</p>
      </div>
    </div>
  );
}
