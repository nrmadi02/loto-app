"use client";

import { LogOut, Menu, Shield, User, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isPending } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    setIsOpen(false);
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl text-foreground">
              LOTO System
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors"
            >
              Beranda
            </Link>
            <Link
              href="#features"
              className="text-foreground hover:text-primary transition-colors"
            >
              Fitur
            </Link>
            <Link
              href="#benefits"
              className="text-foreground hover:text-primary transition-colors"
            >
              Manfaat
            </Link>
            <Link
              href="#contact"
              className="text-foreground hover:text-primary transition-colors"
            >
              Kontak
            </Link>
            {isPending && <p className="text-sm ">Loading...</p>}
            {!isPending && data?.user && (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-foreground">
                  <User className="h-4 w-4" />
                  <span>{data.user.name || data.user.email}</span>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-transparent"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Keluar</span>
                </Button>
              </div>
            )}
            {!isPending && !data?.user && (
              <div className="flex items-center space-x-2">
                <Button variant="outline" asChild>
                  <Link href="/login">Masuk</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Daftar</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
              <Link
                href="/"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Beranda
              </Link>
              <Link
                href="#features"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Fitur
              </Link>
              <Link
                href="#benefits"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Manfaat
              </Link>
              <Link
                href="#contact"
                className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Kontak
              </Link>
              {data?.user ? (
                <div className="px-3 py-2 space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-foreground py-2">
                    <User className="h-4 w-4" />
                    <span>{data.user.name || data.user.email}</span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent flex items-center justify-center space-x-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Keluar</span>
                  </Button>
                </div>
              ) : (
                <div className="px-3 py-2 space-y-2">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    asChild
                  >
                    <Link href="/login">Masuk</Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href="/signup">Daftar</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
