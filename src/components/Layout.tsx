import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Phone, Mail, Facebook, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ChatAssistant from './ChatAssistant';
import { useFirebase } from './FirebaseProvider';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { toast } from 'sonner';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Academics', href: '/academics' },
  { name: 'Admissions', href: '/admissions' },
  { name: 'Fees', href: '/fees' },
  { name: 'Shop', href: '/shop' },
  { name: 'Documents', href: '/documents' },
  { name: 'News', href: '/news' },
  { name: 'Contact', href: '/contact' },
];

const logoSrc = '/images/logo/IMG_20260411_110824 (1).jpg';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin } = useFirebase();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Bar */}
      <div className="bg-slate-900 text-slate-300 py-2 px-4 text-xs hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5"><Phone size={12} className="text-primary" /> 039 737 3324</span>
            <span className="flex items-center gap-1.5"><Mail size={12} className="text-primary" /> sunshine501590@gmail.com</span>
          </div>
          <div className="flex gap-4">
            <a href="https://www.facebook.com/p/Sunshine-Primary-School-100054347539686/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              <Facebook size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="h-10 w-10 flex items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm border border-slate-100">
              <img
                src={logoSrc}
                alt="Sunshine Primary School Logo"
                className="h-full w-full object-contain"
                onError={(e) => {
                  // Fallback if logo is missing
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement?.classList.add('bg-primary');
                  const sunIcon = document.createElement('div');
                  sunIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
                  e.currentTarget.parentElement?.appendChild(sunIcon.firstChild as Node);
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-slate-900 leading-none">Sunshine</span>
              <span className="text-[7px] uppercase tracking-[0.2em] text-primary font-bold">Primary School</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-[11px] xl:text-[12px] font-semibold transition-all hover:text-primary px-2 py-1.5 rounded-md whitespace-nowrap ${
                  isActive(link.href) ? 'text-primary bg-primary/5' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                      <AvatarFallback className="bg-slate-100 text-slate-600 text-xs">{user.displayName?.charAt(0) || <User size={16} />}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-slate-500">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem asChild nativeButton={false}>
                      <Link to="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="default" size="sm" className="hidden sm:flex h-9 px-4 text-xs font-bold uppercase tracking-wider" nativeButton={false}>
                <Link to="/admissions">Apply Now</Link>
              </Button>
            )}

            {/* Mobile Nav Toggle */}
            <div className="lg:hidden flex items-center">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Menu size={20} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                  <nav className="flex flex-col gap-2 mt-8">
                    {user && (
                      <div className="flex items-center gap-3 mb-6 p-3 bg-slate-50 rounded-2xl">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.photoURL || ''} />
                          <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold">{user.displayName}</span>
                          <span className="text-xs text-slate-500">{user.email}</span>
                        </div>
                      </div>
                    )}
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`text-base font-bold px-4 py-3 rounded-xl transition-all ${
                          isActive(link.href) ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {link.name}
                      </Link>
                    ))}
                    {!user ? (
                      <Button asChild className="mt-6 w-full h-12 text-sm font-bold uppercase tracking-wider" nativeButton={false}>
                        <Link to="/admissions" onClick={() => setIsOpen(false)}>Apply Online</Link>
                      </Button>
                    ) : (
                      <div className="mt-6 space-y-2">
                        {isAdmin && (
                          <Button asChild variant="outline" className="w-full h-12 text-sm font-bold uppercase tracking-wider" nativeButton={false}>
                            <Link to="/admin" onClick={() => setIsOpen(false)}>Admin Portal</Link>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          className="w-full h-12 justify-start text-destructive font-bold"
                          onClick={() => {
                            handleLogout();
                            setIsOpen(false);
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" /> Log out
                        </Button>
                      </div>
                    )}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <ChatAssistant />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-200 py-12 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 flex items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
                <img
                  src={logoSrc}
                  alt="Sunshine Primary School Logo"
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.classList.add('bg-primary');
                    const sunIcon = document.createElement('div');
                    sunIcon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
                    e.currentTarget.parentElement?.appendChild(sunIcon.firstChild as Node);
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-white leading-none">Sunshine</span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-bold">Primary School</span>
              </div>
            </div>
            <p className="text-sm text-slate-400">Providing quality independent education from Grade 1 to Grade 7 in Matatiele.</p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/p/Sunshine-Primary-School-100054347539686/"
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/academics" className="hover:text-primary transition-colors">Academics</Link></li>
              <li><Link to="/admissions" className="hover:text-primary transition-colors">Admissions</Link></li>
              <li><Link to="/fees" className="hover:text-primary transition-colors">School Fees</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-slate-200">Address:</span>
                No 7 Leach Lane, Matatiele, 4730
              </li>
              <li className="flex items-center gap-2">
                <span className="text-slate-200">Phone:</span>
                039 737 3324
              </li>
              <li className="flex items-center gap-2">
                <span className="text-slate-200">Email:</span>
                sunshine501590@gmail.com
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Admin</h3>
            <Button asChild variant="outline" size="sm" className="border-slate-700 hover:bg-slate-800 text-slate-300" nativeButton={false}>
              <Link to="/admin">Staff Login</Link>
            </Button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Sunshine Primary School. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
