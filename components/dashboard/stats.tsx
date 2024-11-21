'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from "react"

interface StatsCardProps {
  title: string
  value: string | number
  description: string
}

function StatsCard({ title, value, description }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

export function DashboardStats() {
  const [stats, setStats] = useState({
    totalReceipts: 0,
    monthlyTotal: 0,
    averageAmount: 0,
    pendingReceipts: 0
  })
  const supabase = createClient()

  useEffect(() => {
    async function fetchStats() {
      const { data: receipts } = await supabase
        .from('receipts')
        .select('amount, status, created_at')

      if (receipts) {
        const total = receipts.length
        const pending = receipts.filter(r => r.status === 'pending').length
        const amounts = receipts.map(r => r.amount)
        const average = amounts.length ? 
          amounts.reduce((a, b) => a + b, 0) / amounts.length : 0
        const thisMonth = receipts.filter(r => {
          const date = new Date(r.created_at)
          const now = new Date()
          return date.getMonth() === now.getMonth() &&
                 date.getFullYear() === now.getFullYear()
        }).length

        setStats({
          totalReceipts: total,
          monthlyTotal: thisMonth,
          averageAmount: Math.round(average * 100) / 100,
          pendingReceipts: pending
        })
      }
    }

    fetchStats()
  }, [supabase])

  return (
    <>
      <StatsCard
        title="Total Receipts"
        value={stats.totalReceipts}
        description="All time receipts"
      />
      <StatsCard
        title="Monthly Receipts"
        value={stats.monthlyTotal}
        description="This month"
      />
      <StatsCard
        title="Average Amount"
        value={`$${stats.averageAmount}`}
        description="Per receipt"
      />
      <StatsCard
        title="Pending"
        value={stats.pendingReceipts}
        description="Awaiting processing"
      />
    </>
  )
} 