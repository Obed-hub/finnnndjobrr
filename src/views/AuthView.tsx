import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ShieldCheck, 
  Globe, 
  Target, 
  RotateCw, 
  LogOut, 
  Briefcase, 
  Key,
  Layers,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AuthViewProps {
  initialMode?: 'signin' | 'signup';
  onSuccess?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ 
  initialMode = 'signup',
  onSuccess 
}) => {
  const { 
    firebaseUser, 
    loginWithGoogle, 
    signUpWithEmail, 
    loginWithEmail, 
    resetPassword, 
    logout, 
    isCloudSyncing,
    setActiveTab,
    showToast 
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  
  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [careerTrack, setCareerTrack] = useState('Junior Data Analyst & Python');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle Google / Gmail Authentication
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await loginWithGoogle();
      if (onSuccess) {
        onSuccess();
      } else {
        setActiveTab('discover');
      }
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        setErrorMessage(err?.message || 'Google authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Email & Password Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (mode === 'forgot') {
      setIsLoading(true);
      try {
        await resetPassword(cleanEmail);
        setSuccessMessage(`Password reset link sent to ${cleanEmail}. Please check your inbox.`);
      } catch (err: any) {
        setErrorMessage(err?.message || 'Could not send password reset email.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (mode === 'signup') {
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please verify.');
        return;
      }

      setIsLoading(true);
      try {
        await signUpWithEmail(cleanEmail, password, fullName.trim() || undefined);
        if (onSuccess) {
          onSuccess();
        } else {
          setActiveTab('discover');
        }
      } catch (err: any) {
        setErrorMessage(err?.message || 'Failed to create account.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Sign In mode
      setIsLoading(true);
      try {
        await loginWithEmail(cleanEmail, password);
        if (onSuccess) {
          onSuccess();
        } else {
          setActiveTab('discover');
        }
      } catch (err: any) {
        setErrorMessage(err?.message || 'Invalid email or password.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // If already logged in, show authenticated account state
  if (firebaseUser) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="rounded-3xl bg-white border border-[#EDE8DF] p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D84315] to-amber-600 text-white font-bold text-xl flex items-center justify-center shadow-sm">
              {firebaseUser.photoURL ? (
                <img 
                  src={firebaseUser.photoURL} 
                  alt={firebaseUser.displayName || 'User'} 
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                <span>{(firebaseUser.displayName || firebaseUser.email || 'U').charAt(0).toUpperCase()}</span>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#1A1A1A]">
                  {firebaseUser.displayName || 'Active Member'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00875A]/10 text-[#00875A] border border-[#00875A]/20 font-mono">
                  Cloud Synced
                </span>
              </div>
              <p className="text-xs text-stone-500 font-mono">
                {firebaseUser.email}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#EDE8DF] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
              <ShieldCheck className="w-4 h-4 text-[#00875A]" />
              <span>Authentication & Cloud Synchronization Active</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Your bookmarks, job applications, tailored CVs, and AI task research are securely synchronized with Firestore database in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              onClick={() => setActiveTab('discover')}
              className="px-4 py-3 rounded-2xl bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <Briefcase className="w-4 h-4" />
              <span>Explore Verified Jobs</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className="px-4 py-3 rounded-2xl bg-white border border-[#EDE8DF] hover:bg-stone-50 text-stone-800 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Target className="w-4 h-4 text-[#D84315]" />
              <span>View Saved Jobs</span>
            </button>

            <button
              onClick={async () => {
                await logout();
                showToast('Signed out of session', 'info');
              }}
              className="px-4 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-12 px-4">
      <div className="rounded-3xl bg-white border border-[#EDE8DF] shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* ==================================================== */}
        {/* LEFT / MAIN COLUMN: AUTHENTICATION FORM               */}
        {/* ==================================================== */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
          <div>
            
            {/* Brand Header */}
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-[#D84315] text-white flex items-center justify-center font-black text-base shadow-2xs">
                FJ
              </div>
              <div>
                <span className="font-mono text-sm font-black tracking-tight text-[#1A1A1A] block">
                  FINDJOBBER<span className="text-[#D84315]">PRO</span>
                </span>
                <span className="text-[10px] text-[#767676] font-mono block">
                  Verified Remote Careers & AI Tasks
                </span>
              </div>
            </div>

            {/* Segmented Mode Switcher (Sign In vs Sign Up) */}
            {mode !== 'forgot' && (
              <div className="p-1 bg-[#F7F5EE] border border-[#EDE8DF] rounded-2xl flex items-center mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-white text-[#1A1A1A] shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Create Account (Sign Up)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    mode === 'signin'
                      ? 'bg-white text-[#1A1A1A] shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Sign In
                </button>
              </div>
            )}

            {/* Header Titles */}
            <div className="space-y-1.5 mb-6">
              <h1 className="text-xl sm:text-2xl font-black text-[#1A1A1A] tracking-tight">
                {mode === 'signup' && 'Start Landing Verified Global Remote Roles'}
                {mode === 'signin' && 'Welcome Back to Findjobber PRO'}
                {mode === 'forgot' && 'Reset Your Account Password'}
              </h1>
              <p className="text-xs text-stone-600 leading-relaxed">
                {mode === 'signup' && 'Join thousands of Nigerian & African developers, analysts, and AI trainers earning in USD.'}
                {mode === 'signin' && 'Sign in to access your synchronized job applications, saved roles, and AI tools.'}
                {mode === 'forgot' && 'Enter your email address to receive secure password reset instructions.'}
              </p>
            </div>

            {/* Error / Success Feedback Banners */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5 mb-5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5 mb-5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-[#00875A] shrink-0 mt-0.5" />
                <span className="leading-snug">{successMessage}</span>
              </div>
            )}

            {/* 1. PRIMARY GMAIL / GOOGLE SIGN UP ACTION */}
            {mode !== 'forgot' && (
              <div className="space-y-4 mb-6">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isLoading || isCloudSyncing}
                  className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-stone-50 border-2 border-stone-200 hover:border-stone-400 text-stone-800 text-xs font-bold flex items-center justify-center gap-3 transition-all shadow-xs cursor-pointer active:scale-98 disabled:opacity-60 group"
                >
                  {isLoading ? (
                    <RotateCw className="w-4 h-4 animate-spin text-[#D84315]" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span className="text-sm">
                    {mode === 'signup' ? 'Sign up with Gmail (Google)' : 'Sign in with Gmail (Google)'}
                  </span>
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-[#EDE8DF]" />
                  <span className="text-[11px] uppercase font-bold text-stone-400 font-mono tracking-wider">
                    or continue with email
                  </span>
                  <div className="flex-1 h-px bg-[#EDE8DF]" />
                </div>
              </div>
            )}

            {/* 2. EMAIL & PASSWORD FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Full Name field (Sign Up only) */}
              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Obed Asekhamen"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F7F5EE] border border-[#EDE8DF] text-xs text-[#1A1A1A] placeholder-stone-400 focus:outline-none focus:border-[#D84315] focus:bg-white transition-all shadow-inner"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F7F5EE] border border-[#EDE8DF] text-xs text-[#1A1A1A] placeholder-stone-400 focus:outline-none focus:border-[#D84315] focus:bg-white transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Career Track (Sign Up only) */}
              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 block">
                    Primary Career Track
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={careerTrack}
                      onChange={e => setCareerTrack(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F7F5EE] border border-[#EDE8DF] text-xs text-[#1A1A1A] focus:outline-none focus:border-[#D84315] focus:bg-white transition-all appearance-none cursor-pointer"
                    >
                      <option value="Junior Data Analyst & Python">Data Analytics, SQL & Python</option>
                      <option value="Frontend Engineer & React">Frontend Engineer & React / Next.js</option>
                      <option value="AI Annotation & RLHF Specialist">AI Task Trainer & RLHF (Outlier, Alignerr)</option>
                      <option value="Full-Stack Engineer">Full-Stack TypeScript / Node.js</option>
                      <option value="Customer Support & Operations">Technical Support & Remote Operations</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Password field */}
              {mode !== 'forgot' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-700">
                      Password
                    </label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot');
                          setErrorMessage(null);
                          setSuccessMessage(null);
                        }}
                        className="text-[11px] font-semibold text-[#D84315] hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder={mode === 'signup' ? 'Min 6 characters' : 'Enter your password'}
                      className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-[#F7F5EE] border border-[#EDE8DF] text-xs text-[#1A1A1A] placeholder-stone-400 focus:outline-none focus:border-[#D84315] focus:bg-white transition-all shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Password (Sign Up only) */}
              {mode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Re-type your password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F7F5EE] border border-[#EDE8DF] text-xs text-[#1A1A1A] placeholder-stone-400 focus:outline-none focus:border-[#D84315] focus:bg-white transition-all shadow-inner"
                    />
                  </div>
                </div>
              )}

              {/* Remember me & terms */}
              {mode !== 'forgot' && (
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-stone-600 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="rounded text-[#D84315] focus:ring-[#D84315]"
                    />
                    <span className="text-[11px]">Keep me signed in</span>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#D84315] hover:bg-[#BF360C] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer active:scale-98 disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <RotateCw className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <>
                    <span>
                      {mode === 'signup' && 'Create Free Account'}
                      {mode === 'signin' && 'Sign In to Workspace'}
                      {mode === 'forgot' && 'Send Password Reset Link'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Back to sign in for forgot mode */}
            {mode === 'forgot' && (
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="pt-6 text-center border-t border-[#EDE8DF] mt-6 text-[11px] text-stone-500">
            <span>By continuing, you agree to Findjobber PRO&apos;s </span>
            <span className="underline cursor-pointer text-stone-700">Terms of Service</span>
            <span> and </span>
            <span className="underline cursor-pointer text-stone-700">Privacy Policy</span>.
          </div>
        </div>

        {/* ==================================================== */}
        {/* RIGHT / AMBIENT SHOWCASE: PLATFORM VALUE PROPOSITION */}
        {/* ==================================================== */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#1A1A1A] via-stone-900 to-black text-white p-6 sm:p-10 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-stone-800">
          <div className="space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-[11px] font-mono text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>100% Free • Nigeria & Global Remote</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Engineered for African Remote Workers
              </h3>
              <p className="text-xs text-stone-300 leading-relaxed">
                Filter out location restrictions, scam job boards, and payment lockouts with verified employer feeds and direct USD payout rails.
              </p>
            </div>

            {/* Feature Highlights Cards */}
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-start gap-3">
                <div className="p-2 rounded-xl bg-[#00875A]/20 text-[#00875A] shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white">Scam-Free Guaranteed</h4>
                  <p className="text-[11px] text-stone-300">
                    Every role is verified directly from official ATS boards (Greenhouse, Lever, Ashby, Workable).
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-start gap-3">
                <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 shrink-0 mt-0.5">
                  <Zap className="w-4 h-4 text-orange-400" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white">AI First-Dollar Guidance</h4>
                  <p className="text-[11px] text-stone-300">
                    Step-by-step screening test cheat sheets and calibration task strategies for Outlier, Micro1, and Alignerr.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0 mt-0.5">
                  <Globe className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white">African Payout Protocols</h4>
                  <p className="text-[11px] text-stone-300">
                    Step-by-step Payoneer, Grey, and Geegpay USD virtual bank setup with zero Naira conversion lockups.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof Footer */}
          <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between text-[11px] text-stone-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00875A] animate-pulse" />
              <span>Real-time cloud database sync</span>
            </div>
            <span className="font-mono text-stone-300">v2.5 Production</span>
          </div>
        </div>
      </div>
    </div>
  );
};
