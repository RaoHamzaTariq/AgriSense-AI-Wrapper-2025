'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { createClient } from '@/lib/supabase/client';
import { 
  Leaf, 
  Menu, 
  X, 
  Sprout, 
  BarChart3, 
  MessageCircle, 
  Home, 
  User, 
  CloudRain,
  LogOut
} from "lucide-react";

// Navigation Component
function Navigation({ isMobile = false, onItemClick }: { isMobile?: boolean; onItemClick?: () => void }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setIsAuthenticated(!!data.user);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  const publicNavigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Features", href: "/features", icon: BarChart3 },
    { name: "About", href: "/about", icon: User },
  ];

  const authenticatedNavigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "AgriChat", href: "/agrichat", icon: MessageCircle },
    { name: "Planner", href: "/analyze", icon: Sprout },
    { name: "Features", href: "/features", icon: BarChart3 },
    { name: "About", href: "/about", icon: User },
  ];

  const navigation = isAuthenticated ? authenticatedNavigation : publicNavigation;

  if (isLoading) {
    return null;
  }

  const baseClasses = isMobile 
    ? "flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200"
    : "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200";

  const activeClasses = isMobile
    ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
    : "text-emerald-700 bg-emerald-50 border border-emerald-200";

  const inactiveClasses = isMobile
    ? "text-gray-600 hover:text-emerald-600 hover:bg-gray-50"
    : "text-gray-600 hover:text-emerald-600 hover:bg-gray-50";

  return (
    <>
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onItemClick}
            className={`${baseClasses} ${
              isActivePath(item.href) ? activeClasses : inactiveClasses
            }`}
          >
            {Icon && <Icon className={isMobile ? "w-5 h-5" : "w-4 h-4"} />}
            {item.name}
          </Link>
        );
      })}
    </>
  );
}

// LogoutButton Component
function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setIsLoading(false);
    window.location.href = '/';
  };

  return (
    <Button
      onClick={handleLogout}
      disabled={isLoading}
      size="sm"
      variant="outline"
      className="text-gray-600 hover:text-red-600 hover:border-red-300"
    >
      {isLoading ? (
        "Signing out..."
      ) : (
        <>
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </>
      )}
    </Button>
  );
}

// AuthButton Component
function AuthButton() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      setIsLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" disabled className="text-gray-600">
          Loading...
        </Button>
      </div>
    );
  }

  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600 hidden sm:block">
        Welcome back!
      </span>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button 
        asChild 
        size="sm" 
        variant="outline"
        className="text-gray-600 hover:text-emerald-600 hover:border-emerald-300"
      >
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button 
        asChild 
        size="sm" 
        className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
      >
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}

// Main Header Component
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50" suppressHydrationWarning>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <Leaf className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-emerald-700 bg-clip-text text-transparent">
                AgriSense
              </span>
              <span className="text-xs text-gray-500 hidden sm:block">Smart Farming</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Navigation />
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <AuthButton />
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-gray-600 hover:text-emerald-600 hover:bg-gray-50"
                suppressHydrationWarning
              >
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-white/95 backdrop-blur-md border-l border-gray-200/50">
              <div className="flex flex-col h-full">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <Link 
                    href="/" 
                    className="flex items-center gap-3"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center">
                      <Leaf className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-emerald-700 bg-clip-text text-transparent">
                        AgriSense
                      </span>
                      <span className="text-xs text-gray-500">Smart Farming</span>
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-600 hover:text-emerald-600"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                  <Navigation isMobile={true} onItemClick={() => setIsOpen(false)} />
                </nav>

                {/* Mobile Auth Buttons */}
                <div className="p-4 border-t border-gray-200 space-y-3">
                  <div onClick={() => setIsOpen(false)}>
                    <AuthButton />
                  </div>
                </div>

                {/* Mobile Footer */}
                <div className="p-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    Transforming agriculture with AI
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}