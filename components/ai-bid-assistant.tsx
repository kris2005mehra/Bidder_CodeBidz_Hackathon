"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, Sparkles, TrendingUp, AlertCircle, ChevronDown, ChevronUp, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Auction, Bid } from "@/lib/types"

interface AIBidAssistantProps {
  auction: Auction
  userCredits?: number
  className?: string
}

interface Insight {
  type: "tip" | "warning" | "strategy" | "prediction"
  message: string
  confidence?: number
}

export function AIBidAssistant({ auction, userCredits = 0, className }: AIBidAssistantProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [insights, setInsights] = useState<Insight[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [question, setQuestion] = useState("")
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Generate insights based on auction state
  useEffect(() => {
  const generateInsights = () => {
    const newInsights: Insight[] = []

    const bidCount = auction.bidCount || 0
    const currentBid = auction.currentBid
    const startingBid = auction.minimumBid

    const bidIncrease = ((currentBid - startingBid) / startingBid) * 100

      // Analyze bid patterns
      if (bidCount > 10) {
        newInsights.push({
          type: "tip",
          message: "High activity auction! Consider setting a maximum bid limit to avoid emotional overbidding.",
          confidence: 85,
        })
      }

      if (bidIncrease > 50) {
        newInsights.push({
          type: "warning",
          message: `Price has increased ${bidIncrease.toFixed(0)}% from starting bid. Evaluate if this still fits your budget.`,
          confidence: 90,
        })
      }

      // Time-based insights
      const timeLeft = new Date(auction.endTime).getTime() - Date.now()
      if (timeLeft < 300000 && timeLeft > 0) {
        newInsights.push({
          type: "strategy",
          message: "Auction ending soon! Last-minute bids often win. Stay ready but don't overpay.",
          confidence: 75,
        })
      }

      // Budget insights
      if (userCredits < currentBid * 1.1) {
        newInsights.push({
          type: "warning",
          message: "Your credits are running low relative to the current bid. Consider adding more funds.",
          confidence: 95,
        })
      }

      // Suggested bid
      const suggestedIncrement = Math.max(auction.minimumBid * 0.05, currentBid * 0.05)
      newInsights.push({
        type: "prediction",
        message: `Suggested bid: $${(currentBid + suggestedIncrement).toLocaleString()}. This is ${((suggestedIncrement / currentBid) * 100).toFixed(1)}% above current.`,
        confidence: 70,
      })

      setInsights(newInsights)
    }

    generateInsights()
  }, [auction, userCredits])

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatHistory])

  const handleAskQuestion = async () => {
    if (!question.trim()) return

    const userMessage = question.trim()
    setQuestion("")
    setChatHistory((prev) => [...prev, { role: "user", content: userMessage }])
    setIsThinking(true)

    // Simulate AI response (in production, this would call an API)
    setTimeout(() => {
      const responses = [
        "Based on the current bidding pattern, I recommend waiting 30 seconds before your next bid. Competition tends to slow down between flurries of activity.",
        "This item has received above-average interest. The final price typically settles around 20-40% above the current bid for similar auctions.",
        "Your bidding strategy looks solid. Consider setting an absolute maximum you're willing to pay and stick to it regardless of competition.",
        "Looking at the bid history, there appear to be 2-3 serious bidders. Watch for their patterns to time your bids strategically.",
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setChatHistory((prev) => [...prev, { role: "assistant", content: randomResponse }])
      setIsThinking(false)
    }, 1500)
  }

  const getInsightIcon = (type: Insight["type"]) => {
    switch (type) {
      case "tip":
        return <Sparkles className="h-4 w-4 text-primary" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      case "strategy":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "prediction":
        return <Bot className="h-4 w-4 text-blue-500" />
    }
  }

  const getInsightBadgeColor = (type: Insight["type"]) => {
    switch (type) {
      case "tip":
        return "bg-primary/10 text-primary"
      case "warning":
        return "bg-orange-500/10 text-orange-500"
      case "strategy":
        return "bg-green-500/10 text-green-500"
      case "prediction":
        return "bg-blue-500/10 text-blue-500"
    }
  }

  return (
    <div className={cn(
      "rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden",
      className
    )}>
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <motion.div
              className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-card"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div className="text-left">
            <h3 className="font-semibold">AI Bid Assistant</h3>
            <p className="text-xs text-muted-foreground">Powered by intelligent analysis</p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Insights */}
            <div className="px-4 pb-4 space-y-3">
              {insights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-muted/50"
                >
                  {getInsightIcon(insight.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={cn("text-xs", getInsightBadgeColor(insight.type))}>
                        {insight.type}
                      </Badge>
                      {insight.confidence && (
                        <span className="text-xs text-muted-foreground">
                          {insight.confidence}% confidence
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-foreground/80">{insight.message}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Chat Section */}
            <div className="border-t border-border/50">
              <div className="p-4">
                <p className="text-xs text-muted-foreground mb-3">Ask me anything about this auction</p>
                
                {/* Chat History */}
                {chatHistory.length > 0 && (
                  <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                    {chatHistory.map((msg, index) => (
                      <div
                        key={index}
                        className={cn(
                          "p-3 rounded-xl text-sm",
                          msg.role === "user"
                            ? "bg-primary/10 ml-8"
                            : "bg-muted/50 mr-8"
                        )}
                      >
                        {msg.content}
                      </div>
                    ))}
                    {isThinking && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analyzing...
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                )}

                {/* Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask about bidding strategy..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAskQuestion()}
                    className="flex-1"
                  />
                  <Button
                    size="icon"
                    onClick={handleAskQuestion}
                    disabled={!question.trim() || isThinking}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
