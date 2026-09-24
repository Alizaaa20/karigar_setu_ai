import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [phone, setPhone] = useState('9876543210');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('4321');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
    }, 600);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess?.();
      navigate('/dashboard');
    }, 500);
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[700px] p-6 bg-paper">
      <div className="w-full mt-4">
        <h2 className="font-display text-2xl font-black text-ink">Artisan Login</h2>
        <p className="mt-1 text-xs text-ink/60">
          Enter your mobile number to access Karigar Setu & ONDC Network
        </p>

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="mt-8 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-1.5">
                Mobile Number
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-sm font-semibold text-ink/60">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98765 43210"
                  className="w-full rounded-2xl border-2 border-thread/60 bg-white py-3.5 pl-14 pr-4 font-mono text-base font-semibold text-ink outline-none focus:border-indigo-500"
                  required
                />
                <Phone className="absolute right-3.5 text-indigo-400" size={18} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || phone.length < 10}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 font-display text-base font-bold text-paper shadow-card transition active:scale-[0.98] disabled:opacity-60"
            >
              <span>{loading ? 'Sending OTP…' : 'Send OTP'}</span>
              <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="mt-8 space-y-4">
            <div className="rounded-xl bg-emerald-50 p-3 border border-emerald-200 flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <CheckCircle2 size={16} /> OTP sent to +91 {phone}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink/70 mb-1.5">
                Enter 4-Digit OTP
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="4321"
                  className="w-full text-center tracking-[0.5em] rounded-2xl border-2 border-thread/60 bg-white py-3.5 px-4 font-mono text-xl font-black text-indigo-700 outline-none focus:border-indigo-500"
                  required
                />
                <Lock className="absolute right-3.5 text-indigo-400" size={18} />
              </div>
              <p className="mt-1 text-[11px] text-right text-indigo-600 font-medium cursor-pointer" onClick={() => setOtpSent(false)}>
                Change Number?
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 4}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 font-display text-base font-bold text-paper shadow-card transition active:scale-[0.98] disabled:opacity-60"
            >
              <span>{loading ? 'Verifying…' : 'Verify & Login'}</span>
              <CheckCircle2 size={18} />
            </button>
          </form>
        )}
      </div>

      <div className="text-center text-[11px] text-ink/50 mb-2">
        Protected by ONDC Verified Artisan Authentication Gate
      </div>
    </div>
  );
}
