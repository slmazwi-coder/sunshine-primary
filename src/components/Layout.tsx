import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sun, Phone, Mail, Facebook, LogOut, User } from 'lucide-react';
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
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg shadow-sm">
              <Sun className="text-white" size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-slate-900 leading-none">Sunshine</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">Primary School</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.href) ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                      <AvatarFallback>{user.displayName?.charAt(0) || <User size={20} />}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="default" size="sm" className="ml-4">
                <Link to="/admissions">Apply Now</Link>
              </Button>
            )}
          </nav>

          {/* Mobile Nav */}
          <div className="lg:hidden flex items-center gap-2">
            {user && isAdmin && (
               <Button asChild variant="outline" size="sm" className="mr-2">
                <Link to="/admin">Portal</Link>
              </Button>
            )}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {user && (
                    <div className="flex items-center gap-3 mb-4 p-2 bg-slate-50 rounded-xl">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.photoURL || ''} />
                        <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold">{user.displayName}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </div>
                  )}
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-semibold ${
                        isActive(link.href) ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                  {!user ? (
                    <Button asChild className="mt-4 w-full">
                      <Link to="/admissions" onClick={() => setIsOpen(false)}>Apply Online</Link>
                    </Button>
                  ) : (
                    <>
                      {isAdmin && (
                        <Button asChild variant="outline" className="w-full">
                          <Link to="/admin" onClick={() => setIsOpen(false)}>Admin Portal</Link>
                        </Button>
                      )}
                      <Button variant="ghost" className="w-full justify-start text-destructive" onClick={() => { handleLogout(); setIsOpen(false); }}>
                        <LogOut className="mr-2 h-4 w-4" /> Log out
                      </Button>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <ChatAssistant />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-200 py-12 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <Sun className="text-white" size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-white leading-none">Sunshine</span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-bold">Primary School</span>
              </div>
            </div>
            <p className="text-sm text-slate-400">
              Providing quality independent education from Grade 1 to Grade 7 in Matatiele.
            </p>
            <div className="flex gap-4">
               <a href="https://www.facebook.com/p/Sunshine-Primary-School-100054347539686/" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
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
            <Button asChild variant="outline" size="sm" className="border-slate-700 hover:bg-slate-800 text-slate-300">
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
