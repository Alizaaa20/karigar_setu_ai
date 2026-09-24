import { useEffect, useRef, useState } from 'react';
import { Mic, Square, Sparkles, AlertCircle, ShieldAlert, ExternalLink } from 'lucide-react';
import Eyebrow from './Eyebrow';

const SpeechRecognitionAPI =
  typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

const SAMPLE_TRANSCRIPTS = [
  'Mera naam Ramesh hai, main pashmina shawl 500 me bechna chahta hu',
  'Mitti ka matka terracotta pot 50 rupees price',
  'Madhubani painting authentic handmade 300 rs',
];

export default function VoiceToCatalog({ transcript, setTranscript, onError }) {
  const [listening, setListening] = useState(false);
  const [showInsecureWarning, setShowInsecureWarning] = useState(false);
  const recognitionRef = useRef(null);

  const isSecure =
    typeof window !== 'undefined' &&
    (window.isSecureContext ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.protocol === 'https:');

  useEffect(() => {
    // If accessed on mobile via plain HTTP, warn the user proactively
    if (!isSecure && typeof window !== 'undefined' && window.location.protocol === 'http:') {
      setShowInsecureWarning(true);
    }
  }, [isSecure]);

  const cleanupRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch (_) {}
      recognitionRef.current = null;
    }
    setListening(false);
  };

  useEffect(() => {
    return () => {
      cleanupRecognition();
    };
  }, []);

  const toggleListening = async () => {
    if (!SpeechRecognitionAPI) {
      onError?.(
        'Speech recognition is not supported in this browser. Please use Google Chrome / Microsoft Edge or type directly.'
      );
      return;
    }

    if (listening) {
      cleanupRecognition();
      return;
    }

    // Step 1: Explicitly request microphone stream to trigger Android system permission prompt
    if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Release audio track immediately so Web Speech API has exclusive microphone access
        stream.getTracks().forEach((track) => track.stop());
      } catch (permErr) {
        console.warn('[Microphone Permission Check]', permErr);
        if (permErr.name === 'NotAllowedError' || permErr.name === 'PermissionDeniedError') {
          if (!isSecure) {
            setShowInsecureWarning(true);
            onError?.(
              'Chrome blocks microphone on plain HTTP IP. Please switch to HTTPS (https://' +
                window.location.host +
                ') or enable Chrome flag.'
            );
          } else {
            onError?.('Microphone permission denied. Please allow microphone access in browser site settings.');
          }
          return;
        }
      }
    }

    setTranscript('');

    try {
      // Step 2: Instantiate fresh SpeechRecognition on user click gesture (required on Android Chrome)
      const recognition = new SpeechRecognitionAPI();
      recognition.lang = 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = (event) => {
        let text = '';
        for (let i = 0; i < event.results.length; i += 1) {
          text += event.results[i][0].transcript;
        }
        setTranscript(text);
      };

      recognition.onerror = (event) => {
        console.warn('[SpeechRecognition Error]', event.error);
        cleanupRecognition();

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          if (!isSecure) {
            setShowInsecureWarning(true);
            onError?.(
              'Microphone blocked by Chrome on HTTP. Switch to HTTPS (https://' +
                window.location.host +
                ') for instant microphone access.'
            );
          } else {
            onError?.('Microphone permission denied. Please allow mic in site permissions.');
          }
        } else if (event.error === 'no-speech') {
          onError?.("Didn't catch any voice — please try speaking again.");
        } else {
          onError?.(`Voice capture error (${event.error}). You can type below instead.`);
        }
      };

      recognition.onend = () => {
        setListening(false);
        recognitionRef.current = null;
      };

      recognitionRef.current = recognition;
      recognition.start();
      setListening(true);
    } catch (err) {
      console.error('Error starting recognition:', err);
      cleanupRecognition();
      if (!isSecure) {
        setShowInsecureWarning(true);
        onError?.(
          'Mobile Chrome requires HTTPS for microphone. Switch to https://' + window.location.host
        );
      } else {
        onError?.('Could not start microphone. Please check browser permissions.');
      }
    }
  };

  const switchToHttps = () => {
    if (typeof window !== 'undefined') {
      window.location.href = 'https://' + window.location.host + window.location.pathname;
    }
  };

  return (
    <section>
      <Eyebrow step={1} label="Speak your product" />

      {/* Insecure Context Warning for Mobile Chrome */}
      {showInsecureWarning && (
        <div className="mb-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900 shadow-sm">
          <div className="flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="font-bold">Mobile Chrome Microphone Requirement</p>
              <p className="text-[11px] leading-relaxed text-amber-800">
                Chrome blocks microphones on unencrypted <code className="rounded bg-amber-100 px-1 py-0.5 font-mono">http://</code> IP addresses. Switch to secure HTTPS to allow mic access:
              </p>
              <button
                type="button"
                onClick={switchToHttps}
                className="mt-1.5 inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-2.5 py-1 text-[11px] font-bold text-white shadow hover:bg-indigo-700 transition"
              >
                <span>Switch to HTTPS (Secure)</span>
                <ExternalLink size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center py-4">
        <button
          type="button"
          onClick={toggleListening}
          disabled={!SpeechRecognitionAPI}
          aria-pressed={listening}
          aria-label={listening ? 'Stop recording' : 'Tap to speak'}
          className="relative flex h-24 w-24 items-center justify-center rounded-full bg-madder-500 text-paper shadow-card transition active:scale-95 disabled:cursor-not-allowed disabled:bg-thread"
        >
          {listening && (
            <>
              <span className="absolute inset-0 rounded-full bg-madder-500 animate-pulseRing" />
              <span className="absolute inset-0 rounded-full bg-madder-500 animate-pulseRing [animation-delay:0.4s]" />
            </>
          )}
          {listening ? <Square size={30} fill="currentColor" /> : <Mic size={34} />}
        </button>

        <p className="mt-3 font-display text-base font-semibold text-indigo-600">
          {listening ? 'Listening… tap to stop' : 'Tap to Speak'}
        </p>

        {!SpeechRecognitionAPI && (
          <p className="mt-1 max-w-[280px] text-center text-xs text-madder-600 font-medium">
            ⚠️ Voice input needs Chrome/Edge browser. You can select sample text or type below.
          </p>
        )}
      </div>

      {/* Demo sample preset chips */}
      <div className="mb-3">
        <p className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-indigo-700">
          <Sparkles size={13} /> Quick Demo Voice Samples:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_TRANSCRIPTS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setTranscript(sample)}
              className="rounded-lg border border-indigo-200 bg-indigo-50/70 px-2.5 py-1 text-xs font-medium text-indigo-800 hover:bg-indigo-100 transition"
            >
              "{sample.slice(0, 24)}…"
            </button>
          ))}
        </div>
      </div>

      <label htmlFor="transcript" className="mb-1.5 block text-sm font-medium text-ink/70">
        Transcript (you can edit this)
      </label>
      <textarea
        id="transcript"
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        rows={3}
        placeholder="e.g. Mera naam Ram hai, main yeh pashmina shawl 500 me bechna chahta hu"
        className="w-full rounded-xl border-2 border-thread/60 bg-white p-3 text-[15px] leading-snug text-ink outline-none focus:border-indigo-400"
      />
    </section>
  );
}
