
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Icons } from '../constants';

export const AuthPage: React.FC = () => {
  const { login, loginByEmail } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [showManual, setShowManual] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await login();
    } catch (err: any) {
      setError(err.message);
      if (err.message.includes('unauthorized-domain')) {
        setShowManual(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await loginByEmail(email);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-indigo-50 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-md z-10 text-center animate-in fade-in zoom-in-95 duration-700">
        <div className="w-20 h-20 bg-black rounded-[28px] flex items-center justify-center text-white font-bold text-4xl mx-auto shadow-2xl mb-10">W</div>
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-4">Woody</h1>
        <p className="text-slate-400 font-medium text-lg mb-12">The modern workspace for <br/> creative agencies and their clients.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium animate-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-5 bg-white border border-slate-200 rounded-[24px] shadow-sm hover:shadow-xl hover:border-blue-200 transition-all flex items-center justify-center gap-4 group active:scale-[0.98] disabled:opacity-50"
          >
            <Icons.Google className="w-6 h-6" />
            <span className="font-bold text-slate-700 tracking-tight">
              {loading ? 'Connecting...' : 'Continue with Google'}
            </span>
          </button>

          {(showManual || error?.includes('domain')) && (
            <div className="pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-500">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Manual Login (Fallback)</p>
              <form onSubmit={handleManualLogin} className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-black outline-none transition-all"
                  required
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-black text-white rounded-[20px] font-bold text-sm tracking-tight hover:bg-slate-800 transition-all active:scale-[0.98]"
                >
                  Sign in Manually
                </button>
                <p className="text-[10px] text-slate-400 font-medium px-4">
                  Note: rohan00as@gmail.com grants Admin access.
                </p>
              </form>
            </div>
          )}
        </div>

        <p className="mt-12 text-slate-300 text-[10px] font-bold uppercase tracking-[0.3em]">Built for high-performance teams</p>
      </div>
    </div>
  );
};
