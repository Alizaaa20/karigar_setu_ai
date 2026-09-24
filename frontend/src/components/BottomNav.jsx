import { Home, Plus, User } from 'lucide-react';

export default function BottomNav({ activeTab = 'add-product', setActiveTab }) {
  return (
    <nav className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-around border-t border-thread/40 bg-paper/95 px-4 py-2 backdrop-blur shadow-lg">
      {/* Tab 1: Home Dashboard */}
      <button
        type="button"
        onClick={() => setActiveTab?.('dashboard')}
        className={`flex flex-col items-center gap-1 transition ${
          activeTab === 'dashboard' ? 'text-indigo-600 font-bold scale-105' : 'text-ink/50 hover:text-ink/80'
        }`}
      >
        <Home size={22} />
        <span className="text-[10px]">Home</span>
      </button>

      {/* Tab 2: Add Product AI Engine (Center FAB Style) */}
      <button
        type="button"
        onClick={() => setActiveTab?.('add-product')}
        className={`-mt-5 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition active:scale-95 border-4 border-paper ${
          activeTab === 'add-product' ? 'bg-indigo-600 ring-2 ring-indigo-400' : 'bg-indigo-500 hover:bg-indigo-600'
        }`}
        aria-label="Add Product"
      >
        <Plus size={28} />
      </button>

      {/* Tab 3: Profile */}
      <button
        type="button"
        onClick={() => setActiveTab?.('profile')}
        className={`flex flex-col items-center gap-1 transition ${
          activeTab === 'profile' ? 'text-indigo-600 font-bold scale-105' : 'text-ink/50 hover:text-ink/80'
        }`}
      >
        <User size={22} />
        <span className="text-[10px]">Profile</span>
      </button>
    </nav>
  );
}
