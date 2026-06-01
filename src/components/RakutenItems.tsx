'use client';
import { useEffect, useState } from 'react';

type Item = {
  name: string; price: number; image?: string;
  review?: number; reviewCount?: number; shop?: string; url: string;
};

export default function RakutenItems({ keyword, title = 'おすすめ商品' }: { keyword: string; title?: string }) {
  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(`/api/rakuten?keyword=${encodeURIComponent(keyword)}`)
      .then((r) => r.json())
      .then((d) => { if (alive) setItems(d.items ?? []); })
      .catch(() => { if (alive) setItems([]); });
    return () => { alive = false; };
  }, [keyword]);

  if (items === null) return <p style={{ color: '#888', fontSize: 14 }}>商品を読み込み中…</p>;

  const searchUrl = `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(keyword)}/`;

  return (
    <section style={{ margin: '32px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--kf-primary, #168342)', margin: 0 }}>{title}</h2>
        <span style={{ fontSize: 11, color: '#999', border: '1px solid #ddd', borderRadius: 4, padding: '1px 6px' }}>PR</span>
      </div>
      {items.length === 0 ? (
        <a href={searchUrl} target="_blank" rel="nofollow sponsored noopener"
          style={{ display: 'inline-block', background: 'var(--kf-primary, #168342)', color: '#fff', padding: '12px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
          楽天で「{keyword}」を探す
        </a>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16 }}>
          {items.map((it, i) => (
            <a key={i} href={it.url} target="_blank" rel="nofollow sponsored noopener"
              style={{ border: '1px solid #eee', borderRadius: 10, overflow: 'hidden', textDecoration: 'none', color: 'inherit', background: '#fff', display: 'flex', flexDirection: 'column' }}>
              {it.image && (
                <img src={it.image} alt={it.name} loading="lazy"
                  style={{ width: '100%', aspectRatio: '1 / 1', objectFit: 'contain', background: '#fafafa' }} />
              )}
              <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
                <span style={{ fontSize: 12, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{it.name}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#c0392b' }}>¥{it.price.toLocaleString()}</span>
                {typeof it.review === 'number' && it.review > 0 && (
                  <span style={{ fontSize: 11, color: '#f39c12' }}>★{it.review.toFixed(2)} <span style={{ color: '#999' }}>({it.reviewCount})</span></span>
                )}
                <span style={{ fontSize: 10, color: '#aaa', marginTop: 'auto' }}>{it.shop}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--kf-primary, #168342)', marginTop: 4 }}>楽天で見る →</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
