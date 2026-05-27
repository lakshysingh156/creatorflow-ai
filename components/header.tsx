"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Sparkles, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? "bg-background/70 backdrop-blur-2xl border-b border-border/50 shadow-lg shadow-background/20" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-18 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/30 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center shadow-lg shadow-accent/20">
                <Sparkles className="w-4 h-4 text-accent-foreground" />
              </div>
            </div>
            <span className="font-semibold text-lg text-foreground tracking-tight">
              CreatorFlow
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {[
              { label: "Features", href: "#features" },
              { label: "Generator", href: "#generator" },
              { label: "Dashboard", href: "/dashboard" },
              { label: "Pricing", href: "#pricing" },
            ].map((item) => (
              <Link 
                key={item.label}
                href={item.href} 
                className="relative text-sm text-muted-foreground hover:text-foreground transition-colors py-2 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90 h-10 px-5" asChild>
              <Link href="/signup">Get started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-foreground p-2 hover:bg-secondary/50 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden py-6 border-t border-border/50"
          >
            <nav className="flex flex-col gap-2">
              {[
                { label: "Features", href: "#features" },
                { label: "Generator", href: "#generator" },
                { label: "Dashboard", href: "/dashboard" },
                { label: "Pricing", href: "#pricing" },
              ].map((item) => (
                <Link 
                  key={item.label}
                  href={item.href} 
                  className="text-sm text-muted-foreground hover:text-foreground py-3 px-4 rounded-lg hover:bg-secondary/50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex gap-3 pt-4 mt-2 border-t border-border/50">
                <Button variant="ghost" size="sm" className="flex-1 h-11" asChild>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>
                </Button>
                <Button size="sm" className="flex-1 h-11 bg-foreground text-background" asChild>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>Get started</Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  )
}
