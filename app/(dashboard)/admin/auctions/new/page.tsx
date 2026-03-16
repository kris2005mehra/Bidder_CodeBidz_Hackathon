"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ImagePlus, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

const categories = [
  "Watches",
  "Automobiles",
  "Fine Art",
  "Jewelry",
  "Wine",
  "Antiques",
  "Collectibles",
  "Other",
]

const sampleImages = [
  "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
  "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800",
  "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800",
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800",
  "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800",
  "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800",
]

export default function NewAuctionPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: "",
    minimumBid: "",
    startTime: "",
    endTime: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/auctions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          minimumBid: Number(formData.minimumBid),
        }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success("Auction created successfully!")
        router.push("/admin/auctions")
      } else {
        toast.error(data.error || "Failed to create auction")
      }
    } catch {
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Set default dates
  const getDefaultStartTime = () => {
    const now = new Date()
    now.setMinutes(now.getMinutes() + 30)
    return now.toISOString().slice(0, 16)
  }

  const getDefaultEndTime = () => {
    const now = new Date()
    now.setHours(now.getHours() + 24)
    return now.toISOString().slice(0, 16)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/auctions">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-serif font-bold">Create Auction</h1>
          <p className="text-muted-foreground font-sans">
            Add a new item to auction
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Auction Details</CardTitle>
            <CardDescription className="font-sans">
              Fill in the information about the item you want to auction
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="font-sans">Title</Label>
              <Input
                id="title"
                placeholder="e.g., Vintage Rolex Submariner"
                className="font-sans"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="font-sans">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the item in detail..."
                className="font-sans min-h-[120px]"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="font-sans">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger className="font-sans">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label htmlFor="image" className="font-sans">Image URL</Label>
              <div className="flex gap-2">
                <Input
                  id="image"
                  placeholder="https://example.com/image.jpg"
                  className="font-sans"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const randomImage = sampleImages[Math.floor(Math.random() * sampleImages.length)]
                    setFormData({ ...formData, image: randomImage })
                  }}
                >
                  <ImagePlus className="h-4 w-4" />
                </Button>
              </div>
              {formData.image && (
                <div className="mt-2 relative w-full h-48 rounded-lg overflow-hidden border border-border">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Minimum Bid */}
            <div className="space-y-2">
              <Label htmlFor="minimumBid" className="font-sans">Minimum Bid (Credits)</Label>
              <Input
                id="minimumBid"
                type="number"
                placeholder="10000"
                className="font-sans"
                value={formData.minimumBid}
                onChange={(e) => setFormData({ ...formData, minimumBid: e.target.value })}
                min="1"
                required
              />
            </div>

            {/* Start & End Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime" className="font-sans">Start Time</Label>
                <Input
                  id="startTime"
                  type="datetime-local"
                  className="font-sans"
                  value={formData.startTime || getDefaultStartTime()}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime" className="font-sans">End Time</Label>
                <Input
                  id="endTime"
                  type="datetime-local"
                  className="font-sans"
                  value={formData.endTime || getDefaultEndTime()}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="font-sans" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Auction"
                )}
              </Button>
              <Link href="/admin/auctions">
                <Button type="button" variant="outline" className="font-sans">
                  Cancel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
