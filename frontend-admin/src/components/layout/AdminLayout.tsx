import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Building2,
  Users,
  Inbox,
  Settings,
  UserCheck,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldAlert,
  Building,
  User as UserIcon,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['SUPER_ADMIN', 'OFFICE_ADMIN', 'AGENT'],
    },
    {
      to: '/properties',
      label: 'İlan Yönetimi',
      icon: Building2,
      roles: ['SUPER_ADMIN', 'OFFICE_ADMIN', 'AGENT'],
    },
    {
      to: '/leads',
      label: 'Talep (Lead) Havuzu',
      icon: Inbox,
      roles: ['SUPER_ADMIN', 'OFFICE_ADMIN', 'AGENT'],
    },
    {
      to: '/agents',
      label: 'Danışmanlar',
      icon: Users,
      roles: ['SUPER_ADMIN', 'OFFICE_ADMIN'],
    },
    {
      to: '/tenants',
      label: 'Tenantlar (Firmalar)',
      icon: Building,
      roles: ['SUPER_ADMIN'],
    },
    {
      to: '/settings',
      label: 'Ofis Ayarları',
      icon: Settings,
      roles: ['OFFICE_ADMIN'],
    },
    {
      to: '/profile',
      label: 'Profilim',
      icon: UserCheck,
      roles: ['SUPER_ADMIN', 'OFFICE_ADMIN', 'AGENT'],
    },
  ];

  const filteredNavItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <span className="bg-purple-100 text-purple-700 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-purple-200">SÜPER ADMİN</span>;
      case 'OFFICE_ADMIN':
        return <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-blue-200">OFİS YÖNETİCİSİ</span>;
      case 'AGENT':
        return <span className="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-emerald-200">GAYRİMENKUL DANIŞMANI</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex md:w-64 flex-col bg-slate-900 text-slate-100 border-r border-slate-800 shrink-0">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-sky-500/20">
              E
            </div>
            <div>
              <div className="font-bold text-white tracking-tight leading-none text-base">Emlak Platform</div>
              <div className="text-[11px] text-slate-400 mt-1 font-medium truncate max-w-[140px]">
                {user?.tenantName || 'Platform Yönetimi'}
              </div>
            </div>
          </div>
        </div>

        {/* Tenant Info Card */}
        {user?.tenantName && (
          <div className="mx-4 my-3 p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
            <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Aktif Ofis</div>
            <div className="text-sm font-semibold text-white truncate mt-0.5">{user.tenantName}</div>
            <div className="text-xs text-sky-400 font-mono mt-0.5">/{user.tenantSlug}</div>
          </div>
        )}

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Public Site Link */}
        {user?.tenantSlug && (
          <div className="p-3 border-t border-slate-800">
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-300 transition-colors border border-slate-700/50"
            >
              <span className="flex items-center space-x-2">
                <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                <span>Public Siteyi Aç</span>
              </span>
              <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">:5173</span>
            </a>
          </div>
        )}

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3 truncate">
            {user?.photoUrl ? (
              <img src={user.photoUrl} alt={user.fullName} className="w-9 h-9 rounded-full object-cover border border-slate-700" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm border border-slate-700">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
            )}
            <div className="truncate">
              <div className="text-sm font-semibold text-white truncate">{user?.fullName}</div>
              <div className="text-xs text-slate-400 truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Çıkış Yap"
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center font-bold text-white">E</div>
          <span className="font-bold text-base">Emlak Platform</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-lg"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 text-white border-b border-slate-800 p-4 space-y-2 sticky top-[65px] z-40">
          <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-semibold text-sm">{user?.fullName}</div>
              <div className="text-xs text-slate-400">{user?.tenantName || 'Super Admin'}</div>
            </div>
            {getRoleBadge(user?.role)}
          </div>
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-sky-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
          <button
            onClick={handleLogout}
            className="w-full mt-3 flex items-center space-x-2 px-3 py-2 text-sm text-red-400 hover:bg-slate-800 rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200 px-8 items-center justify-between shrink-0">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-bold text-slate-800">
              {filteredNavItems.find((i) => i.to === location.pathname)?.label || 'Yönetim Paneli'}
            </h1>
            {getRoleBadge(user?.role)}
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-semibold text-slate-700">{user?.fullName}</div>
              <div className="text-xs text-slate-500">{user?.email}</div>
            </div>
            {user?.photoUrl ? (
              <img src={user.photoUrl} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
                <UserIcon className="w-5 h-5" />
              </div>
            )}
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
