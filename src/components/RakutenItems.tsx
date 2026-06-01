"use client";
import { useEffect, useState } from "react";

type Item = { name: string; price: number; url: string; image: string; shop: string; reviewCount: number; reviewAverage: number };

export default function RakutenItems({ keyword }: { keyword: string }) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/rakuten-items?keyword=${encodeURIComponent(keyword)}&hits=6`)
      .then(r => r.json()).then(d => { setItems(d.items || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [keyword]);

  if (loading) return <div style={{ padding: 20, color: "var(--kf-muted)", fontSize: 13 }}>商品を読み込み中…</div>;
  if (items.length === 0) return null;

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 12 }}>
        {items.map((it, i) => (
          <a key={i} href={it.url} target="_blank" rel="nofollow noopener sponsored"
            className="kf-card" style={{ padding: 10, textDecoration: "none", color: "var(--kf-text)", display: "block" }}>
            <div style={{ height: 130, background: "#fff", borderRadius: 8, overflow: "hidden", display: "grid", placeItems: "center" }}>
              {it.image && <img src={it.image} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />}
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, marginTop: 8, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{it.name}</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--kf-primary)", marginTop: 4 }}>¥{it.price?.toLocaleString()}</div>
            {it.reviewCount > 0 && <div style={{ fontSize: 11, color: "#F5B400", marginTop: 2 }}>★{it.reviewAverage}（{it.reviewCount}件）</div>}
            <div style={{ fontSize: 13, fontWeight: 700, color: "#bf0000", marginTop: 6, textAlign: "center", border: "1px solid #bf0000", borderRadius: 6, padding: "4px 0" }}>楽天で見る</div>
          </a>
        ))}
      </div>
      <p style={{ fontSize: 10, color: "var(--kf-muted)", marginTop: 8 }}>※楽天市場の商品情報です。価格・在庫は変動します。各商品ページでご確認ください。</p>
    </div>
  );
}
