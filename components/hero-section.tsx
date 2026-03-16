"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Pause, Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"


export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [showVibration, setShowVibration] = useState(false)

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source 
    src="https://rp2k04bx2kgxqzwb.public.blob.vercel-storage.com/5122718_Person_People_3840x2160.mp4" 
    type="video/mp4" 
  />
        </video>
        {/* Dark Overlay with luxury gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80" />
        {/* Gold accent glow */}
        <div className="absolute inset-0 bg-gradient-radial from-[#C9A66B]/10 via-transparent to-transparent opacity-50" />
      </div>

      {/* Content */}
      <div
        className={cn(
          "relative z-10 text-center px-4 max-w-5xl mx-auto transition-transform duration-300",
          showVibration && "animate-shake"
        )}
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-sm text-white/90 font-medium">
            Live Auctions Happening Now
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 tracking-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150">
          <span className="block">Bid Smart</span>
          <span className="block text-gradient-gold">Win Big</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-sans animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          Experience the thrill of real-time auctions. Discover rare treasures,
          compete with collectors worldwide, and secure your winning bid.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-500">
          <Link href="/auctions">
            <Button
              size="lg"
              className="group text-lg px-8 py-6 bg-white text-black hover:bg-white/90 rounded-full font-sans font-semibold shadow-2xl animate-pulse-gold"
            >
              Enter Live Auctions
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/how-it-works">
            <Button
              size="lg"
              
             className="group text-lg px-8 py-6 bg-white text-black hover:bg-white/90 rounded-full font-sans"
            >
              How It Works
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-700 delay-700">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
              10K+
            </div>
            <div className="text-sm text-white/60 font-sans">Active Bidders</div>
          </div>
          <div className="text-center border-x border-white/20">
            <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
              $50M+
            </div>
            <div className="text-sm text-white/60 font-sans">Items Sold</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
              500+
            </div>
            <div className="text-sm text-white/60 font-sans">Live Auctions</div>
          </div>
        </div>
      </div>

      
    </section>
  )
}
