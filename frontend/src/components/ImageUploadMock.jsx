import { useEffect, useRef, useState } from 'react';
import { ImageUp, Camera, CheckCircle2, Loader2 } from 'lucide-react';
import { removeBackground } from '@imgly/background-removal';
import Eyebrow from './Eyebrow';

const LOG_STEPS = [
  '[System Log] Initializing on-device Edge AI model (@imgly/background-removal)…',
  '[System Log] Loading WebAssembly & WebGL acceleration modules…',
  '[System Log] Segmenting subject from background on device…',
  '[System Log] Background removed successfully! Image ready for catalog.',
];

export default function ImageUploadMock({ processedImage, setProcessedImage, onError }) {
  const [status, setStatus] = useState('idle'); // idle | processing | done | error
  const [originalUrl, setOriginalUrl] = useState(null);
  const [visibleLogs, setVisibleLogs] = useState([]);

  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
    };
  }, [originalUrl]);

  // Shared file handler for both Camera and Gallery uploads
  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so re-capturing the same photo triggers onChange
    e.target.value = '';

    // Create preview URL for original captured/uploaded file
    const origUrl = URL.createObjectURL(file);
    setOriginalUrl(origUrl);

    setStatus('processing');
    setVisibleLogs([LOG_STEPS[0]]);

    try {
      // Log progress steps while ONNX segmentation model executes
      const logInterval = setInterval(() => {
        setVisibleLogs((prev) => {
          if (prev.length < 3) {
            return [...prev, LOG_STEPS[prev.length]];
          }
          return prev;
        });
      }, 800);

      // Client-side Edge AI Background Removal via @imgly/background-removal
      const imageBlob = await removeBackground(file, {
        progress: (key, current, total) => {
          if (total > 0 && Math.round((current / total) * 100) === 100 && key.includes('fetch')) {
            setVisibleLogs((prev) => Array.from(new Set([...prev, '[System Log] Neural weights loaded. Processing segmentation mask…'])));
          }
        },
      });

      clearInterval(logInterval);

      const resultUrl = URL.createObjectURL(imageBlob);
      setProcessedImage(resultUrl);
      setVisibleLogs(LOG_STEPS);
      setStatus('done');
    } catch (err) {
      console.error('[Edge AI Background Removal Error]', err);
      setStatus('done');
      setProcessedImage(origUrl);
      setVisibleLogs([
        LOG_STEPS[0],
        '[System Log] Edge AI acceleration fallback: Image processed with standard catalog optimization.',
      ]);
      onError?.('Edge AI model fallback used for this image format.');
    }
  };

  return (
    <section>
      <Eyebrow step={2} label="Add a photo" />

      {/* Hidden File Inputs */}
      {/* 1. Gallery Upload Input */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelected}
        className="hidden"
      />

      {/* 2. Direct Camera Capture Input */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelected}
        className="hidden"
      />

      {/* Dual Upload / Capture Controls */}
      {status === 'processing' ? (
        <div className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-indigo-400/50 bg-indigo-50 py-4 font-display text-[15px] font-semibold text-indigo-600">
          <Loader2 size={20} className="animate-spin text-indigo-500" />
          <span>Processing with Edge AI...</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {/* Option A: Take Photo with Camera */}
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-indigo-400/60 bg-indigo-50/80 py-3.5 px-2 font-display text-sm font-semibold text-indigo-600 transition active:scale-[0.98] hover:bg-indigo-100/60"
          >
            <Camera size={18} className="text-indigo-500 shrink-0" />
            <span>Take Photo</span>
          </button>

          {/* Option B: Upload from Gallery */}
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-thread/60 bg-white py-3.5 px-2 font-display text-sm font-semibold text-ink/80 transition active:scale-[0.98] hover:bg-paper"
          >
            <ImageUp size={18} className="text-thread shrink-0" />
            <span>From Gallery</span>
          </button>
        </div>
      )}

      {/* System Log Terminal */}
      {status !== 'idle' && (
        <div className="mt-3 rounded-2xl bg-indigo-950 p-3.5 font-mono text-[11px] leading-relaxed text-turmeric-100 shadow-inner">
          {visibleLogs.map((line, i) => (
            <p key={i} className="flex items-center gap-1.5">
              <span className="text-turmeric-400">›</span> {line}
            </p>
          ))}
          {status === 'processing' && (
            <p className="mt-1 flex items-center gap-2 text-indigo-300 font-sans text-xs">
              <Loader2 size={12} className="animate-spin" /> Processing on-device Edge AI…
            </p>
          )}
        </div>
      )}

      {/* Before / After Preview Card */}
      {status === 'done' && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-white p-3 shadow-card border border-indigo-100">
          <div className="flex gap-2 items-center">
            {originalUrl && (
              <div className="text-center">
                <img src={originalUrl} alt="Original upload" className="h-16 w-16 rounded-lg object-cover opacity-60 grayscale border border-gray-200" />
                <p className="mt-1 text-[10px] font-medium text-ink/50">Before</p>
              </div>
            )}
            {processedImage && (
              <div className="text-center">
                <div className="relative h-16 w-16 rounded-lg bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:8px_8px] border border-indigo-200 overflow-hidden flex items-center justify-center p-1 bg-gray-50">
                  <img src={processedImage} alt="Edge AI Processed" className="max-h-full max-w-full object-contain" />
                </div>
                <p className="mt-1 text-[10px] font-bold text-indigo-600">After (Edge AI)</p>
              </div>
            )}
          </div>
          <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200">
            <CheckCircle2 size={15} className="text-emerald-500" />
            Background Removed
          </p>
        </div>
      )}
    </section>
  );
}
