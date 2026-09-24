import { MapPin, CreditCard, LogOut, CheckCircle2, Shield } from 'lucide-react';

export default function Profile({ onLogout }) {
  return (
    <div className="space-y-4 pb-8">
      {/* Profile Header Card */}
      <div className="flex items-center gap-3.5 rounded-2xl bg-white p-4 border border-thread/60 shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700 font-bold font-display text-xl border border-indigo-200">
          RK
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="font-display text-base font-extrabold text-ink">Ramesh Kumar</h3>
            <CheckCircle2 size={16} className="text-emerald-500 fill-emerald-100" />
          </div>
          <p className="text-xs text-ink/70 flex items-center gap-1 mt-0.5">
            <MapPin size={12} className="text-indigo-500" /> Varanasi, Uttar Pradesh
          </p>
          <span className="mt-1.5 inline-block rounded-full bg-turmeric-100 px-2 py-0.5 text-[10px] font-bold text-turmeric-800">
            Handloom & Silk Textiles
          </span>
        </div>
      </div>

      {/* Artisan Identity Badge */}
      <div className="rounded-2xl bg-indigo-50 p-3.5 border border-indigo-100 flex items-center gap-3">
        <Shield className="h-6 w-6 text-indigo-600 shrink-0" />
        <div>
          <h4 className="text-xs font-bold text-indigo-900">ONDC Verified Artisan ID</h4>
          <p className="text-[11px] font-mono text-indigo-700 font-medium">ART-IN-2026-904128</p>
        </div>
      </div>

      {/* UPI & Bank Details for Payouts */}
      <div className="rounded-2xl bg-white p-4 border border-thread/60 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-display text-sm font-bold text-ink flex items-center gap-1.5">
            <CreditCard className="h-4 w-4 text-indigo-500" />
            Payout & Bank Details
          </h4>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
            Verified
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1.5 border-b border-thread/40">
            <span className="text-ink/60 font-medium">UPI ID</span>
            <span className="font-mono font-bold text-ink">ramesh.karigar@sbi</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-thread/40">
            <span className="text-ink/60 font-medium">Bank Name</span>
            <span className="font-bold text-ink">State Bank of India</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-ink/60 font-medium">Account Number</span>
            <span className="font-mono font-bold text-ink">•••• 4812</span>
          </div>
        </div>
      </div>

      {/* Language Preference */}
      <div className="rounded-2xl bg-white p-4 border border-thread/60 shadow-sm flex items-center justify-between">
        <div>
          <h4 className="font-display text-sm font-bold text-ink">Voice Input Language</h4>
          <p className="text-xs text-ink/60">Hindi / Hinglish (Code-Mixed Speech)</p>
        </div>
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
          Hindi (hi-IN)
        </span>
      </div>

      {/* Logout Button */}
      <button
        type="button"
        onClick={() => onLogout?.()}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-madder-200 bg-madder-50 py-3.5 text-sm font-bold text-madder-600 hover:bg-madder-100 transition active:scale-[0.98]"
      >
        <LogOut size={16} />
        Log Out / Reset
      </button>
    </div>
  );
}
