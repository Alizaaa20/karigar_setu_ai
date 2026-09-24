import { WifiOff } from 'lucide-react';
import Eyebrow from './Eyebrow';

/**
 * Module D mock: lets the presenter simulate "no internet" conditions.
 * When on, the Submit action in App.jsx skips the real API call entirely
 * and shows the SMS-fallback-queued toast instead — no backend involved.
 */
export default function OfflineModeToggle({ offline, setOffline }) {
  return (
    <section>
      <Eyebrow step={3} label="Connectivity" />
      <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-card">
        <div className="flex items-center gap-3">
          <span className={`flex h-9 w-9 items-center justify-center rounded-full ${offline ? 'bg-madder-50 text-madder-500' : 'bg-indigo-50 text-indigo-400'}`}>
            <WifiOff size={18} />
          </span>
          <div>
            <p className="font-display text-sm font-semibold text-ink">Offline Mode</p>
            <p className="text-xs text-ink/50">Simulate no internet — queue via SMS instead</p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={offline}
          onClick={() => setOffline((v) => !v)}
          className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${offline ? 'bg-madder-500' : 'bg-thread/70'}`}
        >
          <span
            className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
              offline ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </section>
  );
}
