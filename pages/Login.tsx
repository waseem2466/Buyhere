import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader, AlertCircle, Globe, ExternalLink, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { User as UserType } from '../types.ts';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, register, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [showDomainHelp, setShowDomainHelp] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const getErrorMessage = (err: any) => {
    const code = err.code;
    
    if (code === 'auth/invalid-credential' || code === 'auth/user-not-found' || code === 'auth/wrong-password') {
      return "Invalid email or password. If you haven't created an account yet, please Sign Up.";
    }
    if (code === 'auth/email-already-in-use') {
      return "This email is already registered. Please Sign In instead.";
    }
    if (code === 'auth/weak-password') {
      return "Password should be at least 6 characters.";
    }
    if (code === 'auth/network-request-failed') {
      return "Network error. Please check your internet connection.";
    }
    if (code === 'auth/popup-closed-by-user') {
      return "Sign in cancelled.";
    }
    if (code === 'auth/unauthorized-domain') {
      setShowDomainHelp(true);
      return `Domain Authorization Error: The domain "${window.location.hostname}" is not allowed to use Google Login for this Firebase project.`;
    }
    if (code === 'auth/popup-blocked') {
      return "Popup blocked. Please allow popups for this site to sign in with Google.";
    }
    
    return err.message || "Authentication failed. Please check your details and try again.";
  };

  const handleRedirect = (user: UserType) => {
    if (user.role === 'admin' || user.email === 'admin@wrsmile.com') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setShowDomainHelp(false);
    
    try {
      let user;
      if (isLogin) {
        user = await login(formData.email, formData.password);
      } else {
        user = await register(formData.name, formData.email, formData.password);
      }
      handleRedirect(user);
    } catch (err: any) {
      console.error("Login component caught error:", err);
      setError(getErrorMessage(err));
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setShowDomainHelp(false);
    try {
      const user = await loginWithGoogle();
      handleRedirect(user);
    } catch (err: any) {
      console.error("Google Login error:", err);
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md animate-fade-in-up">
        
        {/* Card */}
        <div className="glass-panel rounded-3xl p-8 md:p-10 relative overflow-hidden">
          {/* Decorative gradients */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {isLogin ? 'Sign in to access your account' : 'Join us for a premium shopping experience'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Full Name"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 dark:bg-white/10 dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="email" 
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 dark:bg-white/10 dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="password" 
                placeholder="Password"
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 dark:bg-white/10 dark:text-white border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>

            {error && (
              <div className="animate-fade-in-up">
                <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-red-600 dark:text-red-200 text-sm font-medium">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
                
                {showDomainHelp && (
                  <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl text-sm border border-yellow-200 dark:border-yellow-800 text-left">
                    <div className="flex items-center gap-2 font-bold text-yellow-800 dark:text-yellow-200 mb-2">
                      <Globe size={16} /> Action Required
                    </div>
                    <p className="mb-2 text-gray-700 dark:text-gray-300">To enable Google Login, authorize these domains:</p>
                    
                    <div className="flex flex-col gap-2 mb-3">
                      <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase text-gray-500 w-16 tracking-wider font-bold">Current</span>
                          <code className="flex-1 bg-white dark:bg-black/40 p-2 rounded border border-gray-200 dark:border-gray-700 font-mono text-xs select-all text-gray-800 dark:text-gray-200">
                            {window.location.hostname}
                          </code>
                      </div>
                      {window.location.hostname !== 'wrbuyhere.netlify.app' && (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase text-gray-500 w-16 tracking-wider font-bold">Production</span>
                            <code className="flex-1 bg-white dark:bg-black/40 p-2 rounded border border-gray-200 dark:border-gray-700 font-mono text-xs select-all text-gray-800 dark:text-gray-200">
                                wrbuyhere.netlify.app
                            </code>
                          </div>
                      )}
                    </div>

                    <ol className="list-decimal pl-4 space-y-1 text-gray-600 dark:text-gray-400 text-xs">
                      <li>Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline inline-flex items-center">Firebase Console <ExternalLink size={10} className="ml-0.5"/></a></li>
                      <li>Select project <b>wr-web</b></li>
                      <li>Navigate to <b>Authentication</b> &gt; <b>Settings</b></li>
                      <li>Click <b>Authorized Domains</b> &gt; <b>Add Domain</b></li>
                      <li>Add both domains listed above.</li>
                    </ol>
                  </div>
                )}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-purple-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {loading ? <Loader className="animate-spin" size={20} /> : (
                <>
                  {isLogin ? 'Sign In' : 'Sign Up'} <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
             <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1"></div>
             <span className="text-gray-500 dark:text-gray-400 text-sm">OR</span>
             <div className="h-px bg-gray-300 dark:bg-gray-700 flex-1"></div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold shadow hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </button>

          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); setShowDomainHelp(false); }}
                className="text-purple-600 dark:text-purple-400 font-bold hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50 text-center flex flex-col items-center gap-1">
             <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mb-1">
               <Info size={12} />
               <span>Firebase Config Helper</span>
             </div>
             <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Add to Firebase Authorized Domains:</p>
             <div className="flex flex-col gap-1 w-full px-4">
                <code className="text-xs bg-gray-100 dark:bg-black/30 px-2 py-1 rounded select-all text-gray-600 dark:text-gray-300 font-mono border border-gray-200 dark:border-gray-800 break-all">
                  {window.location.hostname}
                </code>
                {window.location.hostname !== 'wrbuyhere.netlify.app' && (
                  <code className="text-xs bg-gray-100 dark:bg-black/30 px-2 py-1 rounded select-all text-gray-600 dark:text-gray-300 font-mono border border-gray-200 dark:border-gray-800 break-all">
                    wrbuyhere.netlify.app
                  </code>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;