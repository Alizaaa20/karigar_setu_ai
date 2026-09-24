import { useState } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import AddProduct from './components/AddProduct';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';

export default function App() {
  const [activeTab, setActiveTab] = useState('add-product');

  return (
    <div className="flex min-h-screen items-center justify-center px-2 py-4 bg-slate-900/10">
      {/* Mobile-first simulated app viewport shell */}
      <div className="relative flex h-[830px] max-h-[94vh] w-full max-w-[410px] flex-col overflow-hidden rounded-[2.25rem] border-4 border-indigo-700 bg-paper shadow-2xl">
        {/* Phone Notch */}
        <div className="absolute left-1/2 top-2 z-30 h-1.5 w-16 -translate-x-1/2 rounded-full bg-indigo-700/40" />

        {/* Global App Header */}
        <Header />

        {/* Tab Main Viewport Container */}
        <main className="phone-scroll flex-1 overflow-y-auto px-4 pt-3 pb-20">
          {activeTab === 'add-product' && <AddProduct />}
          {activeTab === 'dashboard' && (
            <Dashboard onNavigateAddProduct={() => setActiveTab('add-product')} />
          )}
          {activeTab === 'profile' && (
            <Profile onLogout={() => setActiveTab('add-product')} />
          )}
        </main>

        {/* Bottom Navigation Tabs */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
