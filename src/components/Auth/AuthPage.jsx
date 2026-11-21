// src/components/Auth/AuthPage.jsx
import React, { useState } from 'react';
import { signUpWithEmail, signInWithEmail, signInWithGoogle, getAuthErrorMessage } from '../../firebase/authService';
import { isValidEmail } from '../../utils/helpers';
import CascadeLogo from '../../assets/Cascade.jpg';

const AuthPage = ({ onSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      setErrors({});

      if (isLogin) {
        await signInWithEmail(formData.email, formData.password);
      } else {
        await signUpWithEmail(formData.email, formData.password, formData.name);
      }

      onSuccess();
    } catch (error) {
      console.error('Auth error:', error);
      const errorMessage = getAuthErrorMessage(error.code, error.message);
      setErrors({ general: errorMessage, code: error.code });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setErrors({});
      await signInWithGoogle();
      onSuccess();
    } catch (error) {
      console.error('Google sign in error:', error);
      const errorMessage = getAuthErrorMessage(error.code, error.message);
      setErrors({ general: errorMessage, code: error.code });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setErrors({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md relative animate-fade-in">
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            className="mb-4 flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white glass-panel rounded-xl border border-neutral-200 dark:border-white/10 transition-all group"
            aria-label="Go back"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to Website</span>
          </button>
        )}

        {/* Glass Auth Card */}
        <div className="glass-panel rounded-3xl p-8 border border-neutral-200/80 dark:border-white/15 shadow-2xl backdrop-blur-2xl">
          {/* Logo & Brand */}
          <div className="text-center mb-6">
            <div className="h-12 w-16 mx-auto rounded-2xl overflow-hidden p-1 bg-[#F5F5DD] shadow-lg mb-3 border border-neutral-200/80 dark:border-white/15 flex items-center justify-center">
              <img className="w-full h-full object-contain rounded-xl" src={CascadeLogo} alt="Cascade Villas" />
            </div>
            <h1 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
              {isLogin ? 'Sign In to Cascade Villas' : 'Create Guest Account'}
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {isLogin ? 'Access your inquiries, booking history, and admin console' : 'Join us for verified holiday stays & special rates'}
            </p>
          </div>

          {/* Admin Email Tip */}
          <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-600 dark:text-emerald-300">
            <strong>Admin Access:</strong> Sign in with registered administrator credentials (e.g. <code>jhaharsh878@gmail.com</code>) to unlock villa listings & photo uploads.
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="mb-5 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-500 text-xs font-medium space-y-2.5">
              <div className="flex items-start gap-2">
                <span className="shrink-0 text-sm">⚠️</span>
                <span className="leading-relaxed">{errors.general}</span>
              </div>

              {errors.code === 'auth/unauthorized-domain' && (
                <div className="pt-2.5 border-t border-rose-500/20 text-neutral-300 text-[11px] space-y-2">
                  <div className="font-bold text-amber-400 flex items-center gap-1.5">
                    <span>🛡️</span>
                    <span>1-Step Fix in Firebase Console</span>
                  </div>
                  <p className="text-neutral-400 leading-relaxed">
                    Firebase blocks OAuth &amp; sign-ins from domains that are not explicitly authorized.
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-neutral-300 font-mono text-[10px]">
                    <li>Open Firebase Console &rarr; Auth Settings</li>
                    <li>Under <strong>Authorized domains</strong>, click <strong>Add domain</strong></li>
                    <li>Add: <span className="text-emerald-400 font-bold">{typeof window !== 'undefined' ? window.location.hostname : 'cascadevillas.in'}</span></li>
                  </ol>
                  <a
                    href="https://console.firebase.google.com/project/cascadevillas/authentication/settings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-all shadow-md"
                  >
                    <span>Open Firebase Auth Settings</span>
                    <span>↗</span>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl glass-panel border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5 transition-all text-xs font-bold text-neutral-800 dark:text-white mb-5 shadow-sm"
            disabled={loading}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative mb-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200 dark:border-white/10" />
            </div>
            <span className="relative px-3 text-[11px] uppercase tracking-wider text-neutral-400 bg-white/70 dark:bg-neutral-900/90 rounded-full font-bold">
              Or with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                  disabled={loading}
                />
                {errors.name && <p className="mt-1 text-[11px] text-rose-500 font-semibold">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                disabled={loading}
              />
              {errors.email && <p className="mt-1 text-[11px] text-rose-500 font-semibold">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                disabled={loading}
              />
              {errors.password && <p className="mt-1 text-[11px] text-rose-500 font-semibold">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-600 dark:text-neutral-400 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                  disabled={loading}
                />
                {errors.confirmPassword && <p className="mt-1 text-[11px] text-rose-500 font-semibold">{errors.confirmPassword}</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-600 text-neutral-950 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Switch Mode Toggle */}
          <div className="mt-6 text-center text-xs">
            <span className="text-neutral-500 dark:text-neutral-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              onClick={toggleMode}
              className="font-bold text-emerald-500 hover:underline"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
