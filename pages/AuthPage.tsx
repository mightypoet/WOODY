
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Icons } from '../constants';

export const AuthPage: React.FC = () => {
  const { login } = useApp();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await login();
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-indigo-50 rounded-full blur-[100px]"></div>

      <div className="w-full max-w-md z-10 text-center animate-in fade-in zoom-in-95 duration-1000">
        <div className="w-20 h-20 bg-black rounded-[28px] flex items-center justify-center text-white font-bold text-4xl mx-auto shadow-2xl mb-10">W</div>
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-4">Woody</h1>
        <p className="text-slate-400 font-medium text-lg mb-12">The modern workspace for <br/> creative agencies and their clients.</p>

        <div className="space-y-4">
          <button 
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-5 bg-white border border-slate-200 rounded-[24px] shadow-sm hover:shadow-xl hover:border-blue-200 transition-all flex items-center justify-center gap-4 group active:scale-[0.98]"
          >
            <Icons.Google className="w-6 h-6" />
            <span className="font-bold text-slate-700 tracking-tight">Continue with Google</span>
          </button>
        </div>

        <p className="mt-12 text-slate-300 text-[10px] font-bold uppercase tracking-[0.3em]">Built for high-performance teams</p>
      </div>
    </div>
  );
};
