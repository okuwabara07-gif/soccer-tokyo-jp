import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Team = {
  id: string
  name: string
  type: string
  category: string
  prefecture: string
  area: string
  block: string
  selection_start: string
  selection_end: string
  apply_start: string
  apply_url: string
  fee: number
  is_free: boolean
  is_jleague: boolean
  is_premium: boolean
  description: string
  practice_days: string
  access: string
  website: string
}

export type CalendarEvent = {
  id: string
  event_type: string
  event_date: string
  description: string
}

export type NutritionPost = {
  id: string
  title: string
  content: string
  category: string
  age_group: string
  affili_url: string
}
