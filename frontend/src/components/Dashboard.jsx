import { Sparkles, TrendingUp, ShoppingBag, DollarSign, Plus, ArrowUpRight } from 'lucide-react';

const RECENT_ORDERS = [
  { id: 'ORD-8921', product: 'Pashmina Shawl', customer: 'Priya Sharma (Delhi)', amount: '₹1,200', source: 'Paytm (ONDC)', time: '2h ago' },
  { id: 'ORD-8920', product: 'Madhubani Art Frame', customer: 'Anand Kumar (Mumbai)', amount: '₹850', source: 'PhonePe (ONDC)', time: '5h ago' },
  { id: 'ORD-8919', product: 'Terracotta Clay Pot Set', customer: 'Sujata Roy (Kolkata)', amount: '₹450', source: 'Paytm (ONDC)', time: '1d ago' },
];

export default function Dashboard({ onNavigateAddProduct }) {
  return (
    <div className="space-y-5 pb-8">
      {/* Header Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <span className="rounded-full bg-turmeric-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-turmeric-800 tracking-wider">
            Verified Artisan
          </span>
          <h2 className="mt-1 font-display text-2xl font-black text-ink">Namaste, Ramesh! 🙏</h2>
          <p className="text-xs text-ink/60">Varanasi, Uttar Pradesh • Master Weaver</p>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-2xl border border-indigo-100 bg-white p-3 shadow-sm text-center">
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <ShoppingBag size={16} />
          </div>
          <p className="mt-2 text-[10px] font-bold text-ink/60 uppercase">Live ONDC</p>
          <p className="font-display text-lg font-black text-indigo-700">12</p>
        </div>

        <div className="rounded-2xl border border-turmeric-200 bg-white p-3 shadow-sm text-center">
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl bg-turmeric-50 text-turmeric-700">
            <TrendingUp size={16} />
          </div>
          <p className="mt-2 text-[10px] font-bold text-ink/60 uppercase">Pending</p>
          <p className="font-display text-lg font-black text-turmeric-700">3</p>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-white p-3 shadow-sm text-center">
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <DollarSign size={16} />
          </div>
          <p className="mt-2 text-[10px] font-bold text-ink/60 uppercase">Earnings</p>
          <p className="font-display text-base font-black text-emerald-600">₹4,500</p>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-800 p-4 text-white shadow-card flex items-center justify-between">
        <div>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-turmeric-300">
            <Sparkles size={11} /> AI Voice Cataloging
          </span>
          <h4 className="font-display text-sm font-bold mt-0.5">Add New Craft Item</h4>
          <p className="text-[11px] text-indigo-100">Speak & upload photo to list on ONDC</p>
        </div>
        <button
          type="button"
          onClick={() => onNavigateAddProduct?.()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-paper text-indigo-700 shadow transition active:scale-95 hover:bg-white"
        >
          <Plus size={22} />
        </button>
      </div>

      {/* Recent Orders List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-sm font-bold text-ink">Recent ONDC Orders</h3>
          <span className="text-[11px] font-bold text-indigo-600 cursor-pointer">View All</span>
        </div>

        <div className="space-y-2">
          {RECENT_ORDERS.map((order) => (
            <div key={order.id} className="flex items-center justify-between rounded-2xl border border-thread/60 bg-white p-3 shadow-sm">
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-display text-xs font-bold text-ink">{order.product}</h4>
                  <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-extrabold text-emerald-700 border border-emerald-200">
                    {order.source}
                  </span>
                </div>
                <p className="text-[11px] text-ink/60 mt-0.5">{order.customer} • {order.time}</p>
              </div>
              <div className="text-right">
                <span className="font-display text-sm font-black text-ink">{order.amount}</span>
                <div className="flex items-center justify-end text-[10px] text-indigo-600 font-bold">
                  Details <ArrowUpRight size={10} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
