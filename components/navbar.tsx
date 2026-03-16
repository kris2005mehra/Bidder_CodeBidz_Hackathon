"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Moon, Sun, Menu, X, Gavel, User, LogIn, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border shadow-md"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Gavel className="h-8 w-8 text-primary transition-transform group-hover:rotate-12" />
              <div className="absolute -inset-1 bg-primary/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-2xl font-serif font-extrabold tracking-wide text-foreground">
              Bidder
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10 ml-6">

            <Link
              href="/auctions"
              className="text-base font-semibold text-foreground/80 hover:text-foreground transition-colors relative group"
            >
              Live Auctions
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-base font-semibold text-foreground/80 hover:text-foreground transition-colors">
                Categories
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="center" className="w-48">
                <DropdownMenuItem>Fine Art</DropdownMenuItem>
                <DropdownMenuItem>Jewelry</DropdownMenuItem>
                <DropdownMenuItem>Watches</DropdownMenuItem>
                <DropdownMenuItem>Collectibles</DropdownMenuItem>
                <DropdownMenuItem>Wine & Spirits</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/how-it-works"
              className="text-base font-semibold text-foreground/80 hover:text-foreground transition-colors relative group"
            >
              How It Works
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>

          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">

            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            )}

            <Link href="/login">
              <Button variant="ghost" className="gap-2 font-semibold">
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </Link>

            <Link href="/register">
              <Button className="gap-2 font-semibold px-5 py-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
                <User className="h-4 w-4" />
                Register
              </Button>
            </Link>

          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">

            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>

          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-in slide-in-from-top-5 duration-300">
            <div className="flex flex-col gap-3">

              <Link
                href="/auctions"
                className="px-4 py-2 text-base font-semibold hover:bg-muted rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Live Auctions
              </Link>

              <Link
                href="/how-it-works"
                className="px-4 py-2 text-base font-semibold hover:bg-muted rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </Link>

              <hr className="border-border" />

              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start gap-2 font-semibold">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>

              <Link href="/register" onClick={() => setIsOpen(false)}>
                <Button className="w-full gap-2 font-semibold">
                  <User className="h-4 w-4" />
                  Register
                </Button>
              </Link>

            </div>
          </div>
        )}
      </div>
    </nav>
  )
}