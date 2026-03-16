"use client"

import { useEffect, useState } from "react"
import { Search, Plus, Minus, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { User } from "@/lib/types"
import { toast } from "sonner"

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount)
}

function CreditDialog({ user, onUpdate }: { user: User; onUpdate: () => void }) {
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleUpdateCredits = async (action: "add" | "set") => {
    if (!amount || Number(amount) < 0) {
      toast.error("Please enter a valid amount")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`/api/users/${user.id}/credits`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credits: Number(amount), action }),
      })

      const data = await res.json()

      if (data.success) {
        toast.success(`Credits ${action === "add" ? "added" : "set"} successfully`)
        setOpen(false)
        setAmount("")
        onUpdate()
      } else {
        toast.error(data.error || "Failed to update credits")
      }
    } catch {
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="font-sans">
          <DollarSign className="h-4 w-4 mr-1" />
          Manage
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif">Manage Credits</DialogTitle>
          <DialogDescription className="font-sans">
            Update credits for {user.name}. Current balance:{" "}
            <span className="font-semibold">{formatCurrency(user.credits)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="font-sans">Amount</Label>
            <Input
              type="number"
              placeholder="Enter amount"
              className="font-sans"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
            />
          </div>

          {user.lockedCredits > 0 && (
            <p className="text-sm text-muted-foreground font-sans">
              Note: {formatCurrency(user.lockedCredits)} credits are currently locked in
              active bids.
            </p>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleUpdateCredits("add")}
            disabled={isLoading || !amount}
            className="font-sans"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Credits
          </Button>
          <Button
            onClick={() => handleUpdateCredits("set")}
            disabled={isLoading || !amount}
            className="font-sans"
          >
            Set Total
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users")
      const data = await res.json()
      if (data.success) {
        setUsers(data.data)
        setFilteredUsers(data.data)
      }
    } catch {
      toast.error("Failed to fetch users")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (search) {
      setFilteredUsers(
        users.filter(
          (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
        )
      )
    } else {
      setFilteredUsers(users)
    }
  }, [search, users])

  const totalCredits = users.reduce((sum, u) => sum + u.credits, 0)
  const totalLocked = users.reduce((sum, u) => sum + u.lockedCredits, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-bold">Users</h1>
        <p className="text-muted-foreground font-sans">
          Manage bidders and their credit balances
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium font-sans">Total Bidders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium font-sans">Total Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCredits)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium font-sans">Locked in Bids</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {formatCurrency(totalLocked)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User List */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="font-serif">All Bidders</CardTitle>
              <CardDescription className="font-sans">
                {filteredUsers.length} registered bidders
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-9 font-sans"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground font-sans">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground font-sans">No users found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary font-semibold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{user.name}</h3>
                    <p className="text-sm text-muted-foreground font-sans truncate">
                      {user.email}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-semibold">{formatCurrency(user.credits)}</div>
                    {user.lockedCredits > 0 && (
                      <Badge variant="secondary" className="font-sans text-xs">
                        {formatCurrency(user.lockedCredits)} locked
                      </Badge>
                    )}
                  </div>

                  <CreditDialog user={user} onUpdate={fetchUsers} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
