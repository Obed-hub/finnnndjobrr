import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Bell, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Send 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EmailAlertModal: React.FC = () => {
  const { isEmailAlertModalOpen, setIsEmailAlertModalOpen, subscribeEmailAlerts, showToast } = useApp();
  
  const [email, setEmail] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('All Software & AI Roles');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isEmailAlertModalOpen) return null;

  const tracks = [
    'All Software & AI Roles',
    'Frontend & Full-stack (React/Next)',
    'Backend & Distributed Systems (Go/Python)',
    'AI Model Training & Data Annotation',
    'Web3, Smart Contracts & Bounties',
    'Product Management & Design'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setIsSubmitting(true);
    const ok = await subscribeEmailAlerts(email, selectedTrack);
    setIsSubmitting(false);

    if (ok) {
      setIsDone(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="fixed inset-0" 
        onClick={() => setIsEmailAlertModalOpen(false)} 
      />

      <div className="relative z-10 w-full max-w-md bg-white border border-[#EDE8DF] rounded-3xl shadow-2xl p-6 sm:p-7 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button
          onClick={() => setIsEmailAlertModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-xl text-stone-500 hover:text-black hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isDone ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header */}
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mb-3">
                <Bell className="w-6 h-6 text-amber-700" />
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase">
                  100% Free
                </span>
                <span className="text-xs font-bold text-stone-500">Weekly or Instant</span>
              </div>
              <h2 className="text-xl font-black text-stone-950">Free Remote Job Alerts</h2>
              <p className="text-xs text-stone-600 font-medium leading-relaxed">
                Get newly posted, verified remote USD contracts delivered straight to your inbox. Zero spam, unsubscribe anytime.
              </p>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-800">Your Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-stone-900 focus:outline-hidden text-xs sm:text-sm font-semibold bg-white"
                />
              </div>
            </div>

            {/* Track Picker */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-800">Target Specialization</label>
              <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {tracks.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTrack(t)}
                    className={`px-3 py-2 rounded-xl text-left text-xs font-bold transition-all border ${
                      selectedTrack === t 
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs' 
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust badge */}
            <div className="flex items-center gap-2 text-[11px] text-stone-500 font-medium pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>We never share your email with third parties.</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-[#1A1A1A] hover:bg-black text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Subscribing...' : 'Get Free Remote Job Alerts'}</span>
            </button>
          </form>
        ) : (
          <div className="py-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-stone-950">You're on the Alert List!</h3>
              <p className="text-xs text-stone-600 font-medium max-w-xs mx-auto">
                We'll email you the moment verified {selectedTrack} openings are discovered and verified.
              </p>
            </div>
            <button
              onClick={() => {
                setIsDone(false);
                setIsEmailAlertModalOpen(false);
              }}
              className="px-6 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs hover:bg-black transition-colors"
            >
              Done & Return to Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
