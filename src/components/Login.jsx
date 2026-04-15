import { useState } from 'react';
import { auth } from '../firebase'; 
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    
    try {
      if (isLoginMode) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Identity already registered in the database.');
      } else if (err.code === 'auth/weak-password') {
        setError('Security threshold not met (min 6 characters).');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Synchronization failed. Invalid credentials.');
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setMessage('');
    
    if (!email) {
      setError('Input target email address to initiate override.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Bypass protocol sent. Check your secure inbox.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden font-sans selection:bg-cyan-500/30">
      
      {/* Animus Blueprint Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Subtle center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-900/10 blur-[150px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-md p-8 relative z-10"
      >
        
        {/* Header Section */}
        <div className="mb-12 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block"
          >
            {/* Minimalist Assassin/Abstergo-style geometry */}
            <div className="w-12 h-12 mx-auto mb-4 relative flex items-center justify-center">
              <div className="absolute inset-0 border border-cyan-500/30 rotate-45" />
              <div className="w-6 h-6 border-b-2 border-r-2 border-cyan-400 rotate-45 transform translate-y-[-2px]" />
            </div>
          </motion.div>
          <h2 className="text-3xl font-black text-white tracking-[0.2em] uppercase">
            Code Ascension
          </h2>
          <p className="mt-3 text-xs text-cyan-500/70 font-mono tracking-widest uppercase">
            {isLoginMode ? 'Awaiting Synchronization' : 'Initialize New Subject'}
          </p>
        </div>

        {/* Alerts (Glitch/System Style) */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, filter: 'blur(5px)' }}
              className="mb-6 pl-3 border-l-2 border-red-500 bg-red-500/5 py-2"
            >
              <p className="text-xs text-red-400 font-mono tracking-wider">{error}</p>
            </motion.div>
          )}
          {message && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, filter: 'blur(5px)' }}
              className="mb-6 pl-3 border-l-2 border-cyan-500 bg-cyan-500/5 py-2"
            >
              <p className="text-xs text-cyan-400 font-mono tracking-wider">{message}</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Form */}
        <form className="space-y-8" onSubmit={handleSubmit}>
          
          {/* Minimalist Underline Inputs */}
          <div className="space-y-6">
            <div className="relative group">
              <input 
                type="email" 
                className="w-full bg-transparent border-b border-white/20 py-2 text-slate-200 placeholder-transparent focus:outline-none focus:border-cyan-500 transition-colors peer font-mono text-sm"
                placeholder="Subject Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label className="absolute left-0 -top-3.5 text-[10px] text-white/40 uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-white/30 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:text-cyan-500">
                Enter Your Email
              </label>
            </div>
            
            <div className="relative group">
              <input 
                type={showPassword ? "text" : "password"} 
                className="w-full bg-transparent border-b border-white/20 py-2 text-slate-200 placeholder-transparent focus:outline-none focus:border-cyan-500 transition-colors peer font-mono text-sm pr-10"
                placeholder="Access Key"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label className="absolute left-0 -top-3.5 text-[10px] text-white/40 uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-white/30 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-[10px] peer-focus:text-cyan-500">
                Enter Password
              </label>
              
              {/* Custom Sharp Eye Icon - Converted to div to block DaisyUI styling */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 bottom-2 cursor-pointer text-white/30 hover:text-cyan-400 transition-colors p-1 flex items-center justify-center outline-none"
              >
                {showPassword ? (
                  <svg className="w-4 h-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="square" strokeLinejoin="miter" d="M3 12c0 0 4-8 9-8s9 8 9 8-4 8-9 8-9-8-9-8z" />
                    <circle cx="12" cy="12" r="3" />
                    <path strokeLinecap="square" strokeLinejoin="miter" d="M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="square" strokeLinejoin="miter" d="M3 12c0 0 4-8 9-8s9 8 9 8-4 8-9 8-9-8-9-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </div>
            </div>
            
            {/* Forgot Password (Only on Login Mode) */}
            <AnimatePresence>
              {isLoginMode && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <div className="flex justify-end pt-1">
                    <button 
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[10px] uppercase tracking-widest text-white/40 hover:text-cyan-400 transition-colors font-mono"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Action Button - Sharp Hover Effect */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="relative w-full py-3.5 border border-white/20 bg-transparent text-white font-bold tracking-[0.2em] uppercase text-xs overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Hover Sweep Animation */}
            <div className="absolute inset-0 bg-cyan-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            
            <span className="relative z-10 flex items-center justify-center gap-2 group-hover:text-black transition-colors duration-300">
              {isLoading ? (
                <>
                  <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                isLoginMode ? 'Synchronize' : 'Initialize'
              )}
            </span>
          </button>
        </form>

        {/* Toggle Mode Link */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => { setIsLoginMode(!isLoginMode); setError(''); setMessage(''); }}
            className="text-[10px] font-mono tracking-widest uppercase text-white/30 hover:text-white transition-colors"
          >
            {isLoginMode 
              ? "[ Create A New Account ]" 
              : "[ Return to Existing Session ]"}
          </button>
        </div>

      </motion.div>
    </div>
  );
};

export default Login;