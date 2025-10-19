'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Leaf, Menu, X, Sprout, BarChart3, MessageCircle } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: "Features", href: "/features", icon: BarChart3 },
    { name: "AgriChat", href: "/agrichat", icon: MessageCircle },
    { name: "Planner", href: "/analyze", icon: Sprout },
    // { name: "Pricing", href: "/pricing" },
    { name: "About", href: "/about" },
  ];

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
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
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActivePath(item.href)
                      ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                      : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Button
              asChild
              variant="ghost"
              className="text-gray-600 hover:text-emerald-600 hover:bg-gray-50"
            >
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button
              asChild
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-gray-600 hover:text-emerald-600 hover:bg-gray-50"
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
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                          isActivePath(item.href)
                            ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                            : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                        }`}
                      >
                        {Icon && <Icon className="w-5 h-5" />}
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>

                {/* Mobile Auth Buttons */}
                <div className="p-4 border-t border-gray-200 space-y-3">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-2 border-gray-200 hover:border-emerald-200 hover:bg-emerald-50 text-gray-700"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/auth/login">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/auth/sign-up">Get Started Free</Link>
                  </Button>
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