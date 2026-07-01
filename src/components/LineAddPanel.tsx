import Link from "next/link";

export default function LineAddPanel({
  message = "セレクション情報や新着チームをLINEでお届けします",
}: { message?: string }) {
  const url = process.env.NEXT_PUBLIC_LINE_ADD_FRIEND_URL;
  if (!url) return null;
  return (
    <div style={{ background: "#06C755", borderRadius: 14, padding: 20, marginTop: 20, textAlign: "center", color: "#fff" }}>
      <p style={{ fontSize: 14, fontWeight: 700, margin: "0 0 12px" }}>{message}</p>
      <Link href={url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "#fff", color: "#06C755", fontWeight: 800, fontSize: 15, padding: "12px 28px", borderRadius: 999, textDecoration: "none" }}>
        LINEで友だち追加
      </Link>
    </div>
  );
}
