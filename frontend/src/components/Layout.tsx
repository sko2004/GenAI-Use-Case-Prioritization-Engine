import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FilePlus, Save, History, LogOut, BrainCircuit } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';

export const Layout = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'New Assessment', path: '/assessment/new', icon: FilePlus },
    { name: 'Saved Reports', path: '/reports', icon: Save },
    { name: 'History', path: '/history', icon: History },
  ];

  return (
    <div className="flex bg-gray-50 h-screen w-full font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white flex flex-col border-r border-gray-100 shadow-sm relative z-10 transition-all">
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-100 gap-3">
           <BrainCircuit className="w-8 h-8 text-indigo-600" />
           <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">GenAI Engine</span>
        </div>
        <nav className="flex flex-1 flex-col px-4 py-8 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600")} />
                {item.name}
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-gray-100 p-4">
           <div className="flex items-center gap-x-3 mb-4 px-2">
             <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-sm overflow-hidden border border-indigo-200">
               {user?.user_metadata?.avatar_url ? (
                 <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                 user?.email?.[0].toUpperCase() || 'U'
               )}
             </div>
             <div className="flex flex-col flex-1 min-w-0">
               <p className="text-sm font-semibold truncate">{user?.user_metadata?.full_name || 'User'}</p>
               <p className="text-xs text-gray-500 truncate">{user?.email}</p>
             </div>
           </div>
           <Button variant="ghost" onClick={signOut} className="w-full justify-start text-gray-500 hover:text-gray-900 py-2">
             <LogOut className="mr-2 h-4 w-4" />
             Sign Out
           </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="h-16 shrink-0 flex items-center px-8 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 w-full shadow-sm justify-between">
            <h1 className="text-xl font-semibold text-gray-800 tracking-tight capitalize">
              {location.pathname.split('/').filter(Boolean).pop()?.replace('-', ' ') || 'Dashboard'}
            </h1>
            <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-2 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">System Secure</span>
            </div>
        </div>
        <div className="flex-1 p-8 wrapper-content max-w-7xl w-full mx-auto pb-24">
           <Outlet />
        </div>
      </main>
    </div>
  );
};
