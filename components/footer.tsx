"use client"

import { Gavel, Mail, Phone, MapPin, Twitter, Instagram, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="bg-foreground text-background">

      {/* Newsletter */}
      <div className="border-b border-background/10">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-serif font-bold mb-2">
                Stay Ahead of the Auction
              </h3>
              <p className="text-background/70">
                Get exclusive alerts on rare finds and upcoming auctions.
              </p>
            </div>

            <div className="flex w-full max-w-md gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
              />
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 whitespace-nowrap">
                Subscribe
              </Button>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Gavel className="h-8 w-8 text-primary" />
              <span className="text-2xl font-serif font-bold">Bidder</span>
            </div>

            <p className="text-background/70 text-sm leading-relaxed mb-6">
              The world's premier intelligent auction platform. Experience luxury
              bidding like never before.
            </p>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center">
                <Twitter className="h-5 w-5" />
              </div>

              <div className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center">
                <Instagram className="h-5 w-5" />
              </div>

              <div className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center">
                <Linkedin className="h-5 w-5" />
              </div>
            </div>
          </div>


          {/* Quick Links (text only) */}
          <div>
            <h4 className="font-serif font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li>Live Auctions</li>
              <li>Categories</li>
              <li>How It Works</li>
              <li>Sell With Us</li>
              <li>About Us</li>
            </ul>
          </div>


          {/* Support */}
          <div>
            <h4 className="font-serif font-semibold mb-6">Support</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li>Help Center</li>
              <li>FAQs</li>
              <li>Shipping Info</li>
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
            </ul>
          </div>


          {/* Contact */}
          <div>
            <h4 className="font-serif font-semibold mb-6">Contact</h4>

            <ul className="space-y-4 text-sm">

              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-background/70">
                  1234 Auction Avenue <br />
                  New York, NY 10001
                </span>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <span className="text-background/70">
                  +1 (555) 123-4567
                </span>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <span className="text-background/70">
                  support@bidder.com
                </span>
              </li>

            </ul>
          </div>

        </div>
      </div>


      {/* Bottom */}
      <div className="border-t border-background/10">
        <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-background/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Bidder. All rights reserved.</p>

          <div className="flex gap-6">
            <span>Terms</span>
            <span>Privacy</span>
            <span>Cookies</span>
          </div>
        </div>
      </div>

    </footer>
  )
}