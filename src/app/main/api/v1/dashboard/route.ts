import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function validateToken(req: NextRequest) {
  const auth = req.headers.get("authorization")
  const token = auth?.replace("Bearer ", "")
  return token === process.env.DASHBOARD_SECRET_TOKEN
}

export async function GET(req: NextRequest) {
  if (!validateToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from("contact_submissions")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }

  return NextResponse.json({ data, total: count, page, limit })
}

export async function PATCH(req: NextRequest) {
  if (!validateToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id, read } = await req.json()

  const { error } = await supabase
    .from("contact_submissions")
    .update({ read })
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  if (!validateToken(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await req.json()

  const { error } = await supabase
    .from("contact_submissions")
    .delete()
    .eq("id", id)

  if (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}