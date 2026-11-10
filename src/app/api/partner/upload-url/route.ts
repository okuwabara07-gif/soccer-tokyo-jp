import { NextRequest, NextResponse } from "next/server";
import { admin, newToken } from "@/lib/partner";

// 登録フォームの写真・ロゴを、ブラウザから Storage へ直接アップロードするための署名付きURLを返す。
// 置き場所は club-media/pending/<ランダム>/ 。承認されるまでどこからも一覧されない。
export async function POST(req: NextRequest) {
  let body: { count?: number; ext?: string[] };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad_request" }, { status: 400 }); }
  const count = Math.min(Math.max(Number(body.count) || 0, 1), 21);
  const exts = Array.isArray(body.ext) ? body.ext : [];
  const sb = admin();
  const folder = `pending/${newToken(12)}`;
  const out: { path: string; token: string; publicUrl: string }[] = [];
  for (let i = 0; i < count; i++) {
    const ext = ["jpg", "png", "webp"].includes(String(exts[i])) ? String(exts[i]) : "jpg";
    const path = `${folder}/${i}-${newToken(6)}.${ext}`;
    const { data, error } = await sb.storage.from("club-media").createSignedUploadUrl(path);
    if (error || !data) return NextResponse.json({ error: "upload_url_failed" }, { status: 500 });
    out.push({ path, token: data.token, publicUrl: sb.storage.from("club-media").getPublicUrl(path).data.publicUrl });
  }
  return NextResponse.json({ files: out });
}
