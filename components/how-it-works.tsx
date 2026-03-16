"use client"

import { UserPlus, Search, Gavel, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

const steps = [
  {
    icon: UserPlus,
    title: "Create Account",
    description:
      "Register for free and complete your profile. Get verified to start bidding on exclusive items.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Search,
    title: "Discover Auctions",
    description:
      "Browse our curated collection of rare items. Set alerts for categories you love.",
    color: "bg-secondary/30 text-secondary-foreground",
  },
  {
    icon: Gavel,
    title: "Place Your Bid",
    description:
      "Compete in real-time auctions. Use our AI assistant for smart bidding strategies.",
    color: "bg-accent/30 text-accent-foreground",
  },
  {
    icon: Trophy,
    title: "Win & Collect",
    description:
      "Secure your winning bid and receive your item with our premium white-glove service.",
    color: "bg-primary/10 text-primary",
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-balance">
            How Bidder Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-sans text-lg">
            Join thousands of collectors in our seamless auction experience
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative group"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-border" />
              )}

              <div
                className={cn(
                  "relative bg-card rounded-2xl p-8 border border-border",
                  "transition-all duration-500 hover:shadow-xl hover:-translate-y-1",
                  "flex flex-col items-center text-center"
                )}
              >
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-sans font-bold text-sm">
                  {index + 1}
                </div>

                {/* Icon */}
                <div
                  className={cn(
                    "w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
                    step.color
                  )}
                >
                  <step.icon className="h-10 w-10" />
                </div>

                {/* Content */}
                <h3 className="font-serif text-xl font-semibold mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground font-sans text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
