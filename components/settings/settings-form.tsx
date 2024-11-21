'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createClient } from '@/utils/supabase/client'
import { toast } from "sonner"
import { User } from "@supabase/supabase-js"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

const settingsFormSchema = z.object({
  accountant_email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  report_day: z.string().min(1, {
    message: "Please select a day for receiving reports.",
  }),
})

type SettingsFormValues = z.infer<typeof settingsFormSchema>

interface Settings {
  accountant_email: string;
  report_day: string;
}

interface SettingsFormProps {
  settings: Settings | null;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const getAuthUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) {
        toast.error('Authentication error')
        router.push('/login')
        return
      }
      setUser(user)
    }
    getAuthUser()
  }, [supabase.auth, router])

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      accountant_email: settings?.accountant_email || '',
      report_day: settings?.report_day || '1',
    },
  })

  async function onSubmit(data: SettingsFormValues) {
    if (!user) return

    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          ...data,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

      toast.success('Settings updated successfully')
      router.refresh()
    } catch (error) {
      toast.error(`Error updating settings: ${error}`)
    }
  }

  const botUrl = `https://t.me/your_bot_${user?.id}`

  if (!user) return null

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Telegram Bot</CardTitle>
          <CardDescription>
            Your unique Telegram bot for uploading receipts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Input readOnly value={botUrl} />
            <Button
              onClick={() => {
                window.open(botUrl, '_blank')
                toast.success('Opening Telegram bot')
              }}
            >
              Open Bot
            </Button>
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="accountant_email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Accountant Email</FormLabel>
                <FormControl>
                  <Input placeholder="accountant@example.com" {...field} />
                </FormControl>
                <FormDescription>
                  Reports will be sent to this email address.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="report_day"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Report Day</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a day" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[...Array(28)].map((_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Day of the month to receive reports.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Save settings</Button>
        </form>
      </Form>
    </div>
  )
} 