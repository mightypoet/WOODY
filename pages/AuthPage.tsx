
import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { useNavigate } from 'react-router-dom';
import { Icons } from '../constants';

export const AuthPage: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mimic API delay
    await new Promise(r => setTimeout(r, 1200));
    await login(email || 'reelywood@gmail.com');
    setIsLoading(false);
    navigate('/');
  };

  const socialLogins = [
    { name: 'Google', icon: Icons.Google, color: 'text-slate-700', bg: 'bg-white' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfdfe] dark:bg-slate-950 p-6 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/50 dark:bg-indigo-500/10 rounded-full blur-[100px] -mr-64 -mt-64"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-100/30 dark:bg-rose-500/5 rounded-full blur-[100px] -ml-64 -mb-64"></div>

      <div className="w-full max-w-md z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-[22px] flex items-center justify-center text-white font-bold text-3xl mx-auto shadow-2xl shadow-indigo-200 dark:shadow-none mb-6">W</div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Welcome back</h1>
          <p className="text-slate-500 mt-3 font-medium">Log in to manage your content and projects.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">Work Email</label>
              <input 
                required
                type="email" 
                placeholder="reelywood@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 dark:shadow-none transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                <>
                  <span>Sign In with Email</span>
                </>
              )}
            </button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800"></div></div>
            <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest text-slate-400 bg-white dark:bg-slate-900 px-4">Or continue with</div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {socialLogins.map(s => (
              <button 
                key={s.name}
                onClick={handleLogin}
                className="flex items-center justify-center gap-3 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold text-slate-700 dark:text-slate-300"
              >
                <s.icon className="w-5 h-5 text-slate-700" />
                <span>{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center mt-10 text-slate-400 text-sm font-medium">
          New to Woody? <span className="text-indigo-600 hover:underline cursor-pointer">Request access</span>
        </p>
      </div>
    </div>
  );
};
