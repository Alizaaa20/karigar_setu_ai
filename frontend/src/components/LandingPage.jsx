import { useNavigate } from 'react';
import { Mic, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export default function LandingPage({ onGetStarted }) {
  const navigate = useNavigate();

  const handleStart = () => {
    onGetStarted?.();
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[640px] p-4 text-center">
      {/* Top Branding */}
      <div className="mt-4 flex flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-600 text-paper shadow-xl border-4 border-indigo-200">
          <Mic size={32} className="animate-pulse" />
        </div>

        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-turmeric-100 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-turmeric-800">
          <Sparkles size={12} /> SIH 26090 MVP
        </span>

        <h1 className="mt-2 font-display text-2xl font-black tracking-tight text-ink">
          Karigar <span className="text-indigo-600">Setu</span>
        </h1>
        <p className="mt-1 font-display text-sm font-semibold text-madder-600">
          "Your Voice, Your Catalog"
        </p>
        <p className="mt-1.5 max-w-[280px] text-xs leading-relaxed text-ink/70">
          Empowering rural Indian artisans to catalog products by voice and sell directly on ONDC.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="w-full space-y-2 my-4 text-left">
        <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm border border-indigo-100">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-bold">
            <Mic size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-ink">Voice-to-Catalog AI</h4>
            <p className="text-[10px] text-ink/60">Dictate product specs in Hinglish or Hindi speech</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm border border-indigo-100">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-turmeric-100 text-turmeric-800 font-bold">
            <Zap size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-ink">Edge AI Image Cleaning</h4>
            <p className="text-[10px] text-ink/60">On-device background removal for studio photos</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm border border-indigo-100">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-ink">Anti-Hallucination Pricing</h4>
            <p className="text-[10px] text-ink/60">Groq LLM anchored to ground-truth cost sheets</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="w-full mb-2">
        <button
          type="button"
          onClick={handleStart}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 font-display text-sm font-bold text-paper shadow-card transition active:scale-[0.98] hover:bg-indigo-700"
        >
          <span>Get Started</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
