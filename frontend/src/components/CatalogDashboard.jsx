import { useState } from 'react';
import { Package, CheckCircle2, Share2, Sparkles, Tag } from 'lucide-react';
import { updateOndcStatus } from '../api';

export default function CatalogDashboard({ products = [], onRefresh, onToast }) {
  const [updatingId, setUpdatingId] = useState(null);

  if (!products || products.length === 0) {
    return (
      <section className="rounded-2xl border-2 border-dashed border-thread/60 bg-paper/60 p-5 text-center">
        <Package className="mx-auto h-9 w-9 text-indigo-400 opacity-60" />
        <h4 className="mt-2 font-display text-sm font-bold text-ink">No Saved Catalogs Yet</h4>
        <p className="mt-1 text-xs text-ink/60">
          Generate your first AI listing above — it will be automatically saved to MongoDB and displayed here.
        </p>
      </section>
    );
  }

  const handlePushOndcFromDashboard = async (id) => {
    setUpdatingId(id);
    try {
      await updateOndcStatus(id);
      onToast?.('Catalog updated and pushed to ONDC Gateway successfully!', 'success');
      onRefresh?.();
    } catch (err) {
      onToast?.(err.message || 'Failed to update ONDC status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-bold text-ink flex items-center gap-1.5">
          <Package className="h-4 w-4 text-indigo-500" />
          My Catalog History
        </h3>
        <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
          {products.length} {products.length === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {products.map((item) => {
          const isOndcLive = item.isPushedToONDC;
          const formattedDate = item.createdAt
            ? new Date(item.createdAt).toLocaleDateString('en-IN', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : 'Recent';

          return (
            <div
              key={item._id}
              className="flex gap-3 rounded-2xl border border-thread/60 bg-white p-3 shadow-sm transition hover:shadow-card"
            >
              {/* Product Thumbnail */}
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-50 border border-indigo-100 flex items-center justify-center p-1">
                {item.imageBase64 ? (
                  <img
                    src={item.imageBase64}
                    alt={item.title}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <Tag className="h-8 w-8 text-indigo-300" />
                )}
              </div>

              {/* Product Details */}
              <div className="flex flex-1 flex-col justify-between overflow-hidden">
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="rounded-full bg-turmeric-100 px-2 py-0.5 text-[10px] font-semibold text-turmeric-800">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-ink/50">{formattedDate}</span>
                  </div>
                  <h4 className="mt-1 font-display text-sm font-bold text-ink truncate">{item.title}</h4>
                  <p className="line-clamp-1 text-xs text-ink/70">{item.description}</p>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <span className="font-display text-base font-extrabold text-madder-600">
                    ₹{item.suggestedPrice}
                  </span>

                  {isOndcLive ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                      <CheckCircle2 size={11} className="text-emerald-500" /> ONDC Live ✅
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handlePushOndcFromDashboard(item._id)}
                      disabled={updatingId === item._id}
                      className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2 py-1 text-[11px] font-bold text-indigo-600 hover:bg-indigo-100 transition active:scale-95 disabled:opacity-50"
                    >
                      <Share2 size={11} />
                      {updatingId === item._id ? 'Pushing…' : 'Push ONDC 🚀'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
