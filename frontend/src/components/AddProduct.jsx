import { useEffect, useRef, useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import VoiceToCatalog from './VoiceToCatalog';
import ImageUploadMock from './ImageUploadMock';
import OfflineModeToggle from './OfflineModeToggle';
import CatalogCard from './CatalogCard';
import CatalogDashboard from './CatalogDashboard';
import Toast from './Toast';
import { generateListing, saveCatalog, getSavedCatalogs } from '../api';

export default function AddProduct() {
  const [transcript, setTranscript] = useState('');
  const [processedImage, setProcessedImage] = useState(null);
  const [offline, setOffline] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [savedProductId, setSavedProductId] = useState(null);
  const [savedProducts, setSavedProducts] = useState([]);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = (message, variant = 'success', duration = 3500) => {
    clearTimeout(toastTimer.current);
    setToast({ message, variant });
    toastTimer.current = setTimeout(() => setToast(null), duration);
  };

  const fetchHistory = async () => {
    try {
      const res = await getSavedCatalogs();
      if (res?.products) {
        setSavedProducts(res.products);
      }
    } catch (err) {
      console.warn('[Catalog History Notice]', err.message);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSubmit = async () => {
    if (offline) {
      setSubmitting(true);
      setTimeout(() => {
        setSubmitting(false);
        showToast('No Internet. Payload queued for Twilio SMS Webhook.', 'offline');
      }, 900);
      return;
    }

    if (!transcript.trim()) {
      showToast('Please speak or type a product description first.', 'error');
      return;
    }

    setSubmitting(true);
    setResult(null);
    setSavedProductId(null);

    try {
      // Step 1: Generate Listing via Groq AI LLM
      const data = await generateListing(transcript);
      setResult(data);
      if (data.warning) showToast(data.warning, 'error');

      // Step 2: Auto-save to MongoDB Database
      try {
        const saveRes = await saveCatalog({
          title: data.listing.title,
          description: data.listing.seo_description,
          suggestedPrice: data.listing.suggested_price,
          category: data.listing.category,
          imageBase64: processedImage || '',
          isPushedToONDC: false,
        });

        if (saveRes?.product?._id) {
          setSavedProductId(saveRes.product._id);
        }
        fetchHistory();
      } catch (saveErr) {
        console.warn('[MongoDB Auto-save Notice]', saveErr.message);
      }
    } catch (err) {
      showToast(err.message || 'Something went wrong. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAll = () => {
    setResult(null);
    setProcessedImage(null);
    setTranscript('');
    setSavedProductId(null);
  };

  const canSubmit = offline || Boolean(transcript.trim());

  return (
    <div className="space-y-6 pb-4">
      {/* Step 1: Speak / Type Product Specs */}
      <VoiceToCatalog transcript={transcript} setTranscript={setTranscript} onError={(m) => showToast(m, 'error')} />

      <hr className="stitch-divider" />

      {/* Step 2: Camera Capture / Edge AI Background Removal */}
      <ImageUploadMock
        processedImage={processedImage}
        setProcessedImage={setProcessedImage}
        onError={(m) => showToast(m, 'error')}
      />

      <hr className="stitch-divider" />

      {/* Step 3: Offline Connectivity Toggle */}
      <OfflineModeToggle offline={offline} setOffline={setOffline} />

      {/* Step 4: AI Generated Catalog Card */}
      {result && (
        <>
          <hr className="stitch-divider" />
          <CatalogCard
            result={result}
            processedImage={processedImage}
            productId={savedProductId}
            onReset={handleResetAll}
            onOndcPush={(msg) => {
              showToast(msg, 'success', 4500);
              fetchHistory();
            }}
          />
        </>
      )}

      <hr className="stitch-divider" />

      {/* Step 5: Saved MongoDB History Dashboard */}
      <CatalogDashboard
        products={savedProducts}
        onRefresh={fetchHistory}
        onToast={showToast}
      />

      {/* Sticky Bottom Submit Button (Kept within viewport shell) */}
      <div className="sticky bottom-1 inset-x-0 pt-2 pb-1 bg-paper/90 backdrop-blur z-10">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting || !canSubmit}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 font-display text-base font-bold text-paper shadow-card transition active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-thread"
        >
          {submitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              {offline ? 'Queuing…' : 'Generating & Saving…'}
            </>
          ) : (
            <>
              <Send size={16} />
              {offline ? 'Submit (Offline)' : 'Submit & Generate Listing'}
            </>
          )}
        </button>
      </div>

      <Toast toast={toast} />
    </div>
  );
}
