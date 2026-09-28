import React, { useState } from 'react';
import { ChevronDown, Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onRequestDemo?: () => void;
  onLogIn?: () => void;
  onSignUp?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onRequestDemo,
  onLogIn,
  onSignUp
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navLinks = [
    { label: 'Product', hasDropdown: true },
    { label: 'Work', hasDropdown: true },
    { label: 'Education', hasDropdown: true },
    { label: 'Pricing', hasDropdown: false },
    { label: 'Resources', hasDropdown: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand Logo & Main Nav */}
        <div className="flex items-center gap-8">
          {/* Abaanly Brand Logo */}
          <a href="#" className="flex items-center gap-2.5 group" aria-label="Abaanly Homepage">
            {/* Abaanly Logo Icon */}
            <div className="w-8 h-8 rounded-full bg-[#0E7058] flex items-center justify-center text-white shadow-xs font-bold text-base select-none">
              <span className="leading-none tracking-tighter">A</span>
            </div>
            {/* Wordmark */}
            <span className="text-[22px] font-bold tracking-tight text-[#111827] font-sans lowercase">
              abaanly
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
            {navLinks.map((item) => (
              <div 
                key={item.label}
                className="relative"
                onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button 
                  className="flex items-center gap-1 hover:text-[#0E7058] transition-colors py-2 cursor-pointer font-medium"
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#0E7058]" />
                  )}
                </button>

                {/* Dropdown Menu */}
                {item.hasDropdown && activeDropdown === item.label && (
                  <div className="absolute left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in duration-100">
                    <a href="#feature-overview" className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#0E7058]">
                      Overview
                    </a>
                    <a href="#teams" className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#0E7058]">
                      For Teams & Enterprise
                    </a>
                    <a href="#integrations" className="block px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-[#0E7058]">
                      Integrations & Apps
                    </a>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onRequestDemo}
            className="hidden sm:inline-block text-sm font-semibold text-slate-700 hover:text-slate-950 transition-colors"
          >
            Request a demo
          </button>

          <button 
            onClick={onLogIn}
            className="hidden sm:inline-block text-sm font-semibold text-slate-700 hover:text-slate-950 transition-colors"
          >
            Log in
          </button>

          <button 
            onClick={onSignUp}
            className="bg-[#0E7058] hover:bg-[#0b5744] active:scale-[0.98] text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all shadow-xs"
          >
            Sign Up It's free
          </button>

          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          {navLinks.map((item) => (
            <div key={item.label} className="py-1">
              <span className="text-sm font-medium text-slate-800">{item.label}</span>
            </div>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button 
              onClick={onRequestDemo}
              className="w-full text-left py-1 text-sm font-semibold text-slate-700"
            >
              Request a demo
            </button>
            <button 
              onClick={onLogIn}
              className="w-full text-left py-1 text-sm font-semibold text-slate-700"
            >
              Log in
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
