'use client'

import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Receipt {
  id: string
  amount: number
  merchant: string
  date: string
  status: string
  created_at: string
}

export function RecentReceipts() {
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchReceipts() {
      try {
        const { data } = await supabase
          .from('receipts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5)

        setReceipts(data || [])
      } catch (error) {
        console.error('Error fetching receipts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReceipts()
  }, [supabase])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Receipts</CardTitle>
        <CardDescription>
          Your latest 5 receipts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Merchant</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : receipts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No receipts found
                </TableCell>
              </TableRow>
            ) : (
              receipts.map((receipt) => (
                <TableRow key={receipt.id}>
                  <TableCell>
                    {new Date(receipt.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{receipt.merchant}</TableCell>
                  <TableCell>${receipt.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`capitalize ${
                      receipt.status === 'processed' ? 'text-green-600' : 
                      receipt.status === 'pending' ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {receipt.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 