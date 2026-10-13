import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, currentUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EDE9FE] flex flex-col items-center justify-center p-4 text-[#2E1065]">
      <div className="bg-white border border-[#DDD6FE] p-8 rounded-2xl w-full max-w-md shadow-xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block group">
            <div className="w-12 h-12 rounded-xl bg-[#7C3AED] group-hover:bg-[#5B21B6] text-white font-bold text-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#7C3AED]/30 transition">
              S
            </div>
          </Link>
          <h2 className="text-2xl font-bold text-[#2E1065]">Login</h2>
          <Link to="/" className="text-xs text-[#6B5B95] hover:text-[#7C3AED] mt-1 inline-block font-medium">
            SalaryFlow
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-[#E11D48]/10 border border-[#E11D48]/30 text-[#E11D48] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-[#6B5B95] uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#DDD6FE] text-[#2E1065] placeholder-[#6B5B95]/50 focus:outline-none focus:border-[#7C3AED] text-sm"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#6B5B95] uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-11 rounded-xl bg-white border border-[#DDD6FE] text-[#2E1065] placeholder-[#6B5B95]/50 focus:outline-none focus:border-[#7C3AED] text-sm"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B5B95] hover:text-[#7C3AED] p-1 transition"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#7C3AED] hover:bg-[#5B21B6] text-white font-bold text-sm shadow-lg shadow-[#7C3AED]/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <LogIn className="w-4 h-4" /> {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#DDD6FE] text-center space-y-2 text-xs text-[#6B5B95]">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="text-[#7C3AED] font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
