"use client";
export default function GoodsCatImage({ no, title, emoji }: { no: string; title: string; emoji: string }) {
  return (
    <div style={{ position: "relative", height: 130, background: "linear-gradient(180deg,#eef2ee,#e3e9e3)", display: "grid", placeItems: "center", overflow: "hidden" }}>
      <img src={`/images/kf/goods/${no}.jpg`} alt={title}
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <span style={{ fontSize: 44 }}>{emoji}</span>
    </div>
  );
}
