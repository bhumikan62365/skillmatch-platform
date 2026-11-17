import React from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NavbarProps {
  title: string;
  breadcrumb?: string;
  onOpenMobileMenu: () => void;
  onLogout: () => void;
}

export function Navbar({
  title,
  breadcrumb,
  onOpenMobileMenu,
  onLogout,
}: NavbarProps) {
  const { currentUser } = useApp();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          {breadcrumb && (
            <p className="text-xs text-slate-500 truncate">{breadcrumb}</p>
          )}
          <h1 className="text-base sm:text-lg font-semibold text-[#0F172A] font-display truncate">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        {currentUser && (
          <div className="hidden sm:flex items-center gap-3">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-100 text-[#0F172A] text-xs font-semibold flex items-center justify-center border border-slate-200">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="text-right">
              <p className="text-xs font-semibold text-[#0F172A] leading-tight">
                {currentUser.name}
              </p>
              <p className="text-[11px] text-slate-500 leading-tight">
                {currentUser.institution}
              </p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-[#0F172A] bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
}
