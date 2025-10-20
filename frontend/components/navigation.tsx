'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Sprout, BarChart3, MessageCircle, Home, User } from "lucide-react";

interface NavigationProps {
  isMobile?: boolean;
  onItemClick?: () => void;
}

export default function Navigation({ isMobile = false, onItemClick }: NavigationProps) {
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
