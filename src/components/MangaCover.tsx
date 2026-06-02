'use client';
import { useEffect, useState } from 'react';

export default function MangaCover({ keyword, alt }: { keyword: string; alt: string }) {
  const [img, setImg] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    fetch(`/api/rakuten?keyword=${encodeURIComponent(keyword)}`)
      .then((r) => r.json())
      .then((d) => { if (alive) setImg(d.items?.[0]?.image ?? ''); })
      .catch(() => { if (alive) setImg(''); });
    return () => { alive = false; };
  }, [keyword]);
  if (img === null) return <div style={{ width: '100%', aspectRatio: '3/4', background: '#f0f0f0', borderRadius: 8 }} />;
  if (!img) return <div style={{ width: '100%', aspectRatio: '3/4', background: '#f0f0f0', borderRadius: 8, display: 'grid', placeItems: 'center', color: '#bbb', fontSize: 11 }}>{alt}</div>;
  return <img src={img} alt={alt} loading="lazy" style={{ width: '100%', aspectRatio: '3/4', objectFit: 'contain', background: '#fafafa', borderRadius: 8 }} />;
}
