import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TrendingUp, BarChart2, UploadCloud, Bot, ShieldAlert, FileText, Bookmark, Briefcase, LogOut, Menu, X, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: TrendingUp },
    { name: 'Market', path: '/market', icon: BarChart2 },
    { name: 'Portfolio', path: '/portfolio', icon: Briefcase },
    { name: 'Chart Analyzer', path: '/analyzer', icon: UploadCloud },
    { name: 'AI Assistant', path: '/assistant', icon: Bot },
    { name: 'Risk Calculator', path: '/risk', icon: ShieldAlert },
    { name: 'My Reports', path: '/reports', icon: FileText },
    { name: 'Watchlist', path: '/watchlist', icon: Bookmark },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-[#070514]/90 backdrop-blur-2xl border-b border-violet-900/30 text-slate-100 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-amber-300 via-violet-400 to-cyan-300 bg-clip-text text-transparent">
                AI StockVision
              </span>
              <span className="block text-[10px] text-amber-400/80 font-medium tracking-widest uppercase">
                Elite Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-violet-600/20 text-amber-300 border border-violet-500/40 shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-violet-950/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-amber-400' : 'text-violet-400'}`} />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* User Profile / Auth & Theme */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-violet-950/40 text-slate-300 hover:text-white border border-violet-900/40 transition-colors"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-violet-400" />}
            </button>

            {user ? (
              <div className="flex items-center gap-3 bg-[#0c081e] border border-violet-900/50 px-3.5 py-1.5 rounded-2xl shadow-lg">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-violet-600 flex items-center justify-center font-bold text-slate-950 text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-slate-200">{user.name}</div>
                  <div className="text-[10px] text-amber-400 capitalize">{user.role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 p-1.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-violet-500 to-cyan-400 rounded-xl shadow-lg shadow-violet-500/25 hover:opacity-95 transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-violet-950 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#070514] border-b border-violet-900/40 px-4 pt-2 pb-6 space-y-2 animate-fadeIn">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium ${
                  active ? 'bg-violet-600/20 text-amber-300 border border-violet-500/40' : 'text-slate-300 hover:bg-violet-950/40'
                }`}
              >
                <Icon className="w-5 h-5 text-amber-400" />
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-violet-950 flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between px-3 py-2 bg-[#0c081e] rounded-xl border border-violet-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-400 flex items-center justify-center font-bold text-slate-950 text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-200">{user.name}</div>
                    <div className="text-xs text-amber-400">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="p-2 text-rose-400 bg-rose-500/10 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-medium text-slate-200 bg-violet-950/60 rounded-xl border border-violet-900/40"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-cyan-400 rounded-xl shadow-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
