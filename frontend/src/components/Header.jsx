import { Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-indigo-500 px-5 pb-5 pt-7 text-paper">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-turmeric-500 text-indigo-600">
          <Sparkles size={18} strokeWidth={2.5} />
        </span>
        <div>
          <h1 className="font-display text-xl font-bold leading-tight">Karigar Setu</h1>
          <p className="text-xs text-indigo-100">कारीगर सेतु — your voice, your catalog</p>
        </div>
      </div>
    </header>
  );
}
