import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getMembership } from "@/lib/membership";

export async function GET() {
  const s = await getSession();
  const mem = await getMembership(s?.uid);
  return NextResponse.json(mem);
}
