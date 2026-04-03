"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Team = {
  id: number; name: string; category: string; area: string;
  prefecture: string; city: string; lat?: number; lng?: number;
  website?: string; instagram?: string; twitter?: string; facebook?: string;
  description?: string; founded?: number; members?: number;
};

const toKatakana = (s: string) => s.replace(/[\u3041-\u3096]/g, c => String.fromCharCode(c.charCodeAt(0)+0x60));
const toHiragana = (s: string) => s.replace(/[\u30a1-\u30f6]/g, c => String.fromCharCode(c.charCodeAt(0)-0x60));
const fuzzyMatch = (text: string, q: string) => {
  if (!q) return true;
  const variants = [q, toKatakana(q), toHiragana(q)];
  return variants.some(v => text.toLowerCase().includes(v.toLowerCase()));
};

const CATEGORIES = [
  { key:"all", label:"すべて", color:"#1a1a2e" },
  { key:"ジュニアユース", label:"ジュニアユース", color:"#e63946" },
  { key:"ジュニア", label:"ジュニア", color:"#457b9d" },
  { key:"アカデミー", label:"アカデミー", color:"#2d6a4f" },
  { key:"社会人", label:"社会人", color:"#6d4c41" },
];

declare global { interface Window { initMap: () => void; google: any; } }

const MapView = ({ teams, selectedTeam, onSelectTeam }: {
  teams: Team[]; selectedTeam: Team | null; onSelectTeam: (t: Team) => void;
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);

  useEffect(() => {
    const init = () => {
      if (!mapRef.current || !window.google) return;
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 35.6895, lng: 139.6917 }, zoom: 11,
        mapTypeControl: false, streetViewControl: false, fullscreenControl: false,
      });
      infoWindowRef.current = new window.google.maps.InfoWindow();
    };
    if (window.google?.maps) { init(); }
    else {
      window.initMap = init;
      const s = document.createElement("script");
      s.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initMap&language=ja`;
      s.async = true; s.defer = true; document.head.appendChild(s);
      return () => { try { document.head.removeChild(s); } catch(e){} };
    }
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return;
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current = [];
    const bounds = new window.google.maps.LatLngBounds();
    let hasPin = false;
    teams.forEach(team => {
      if (!team.lat || !team.lng) return;
      hasPin = true;
      const color = CATEGORIES.find(c => c.key === team.category)?.color ?? "#888";
      const isSel = selectedTeam?.id === team.id;
      const marker = new window.google.maps.Marker({
        position: { lat: team.lat, lng: team.lng },
        map: mapInstanceRef.current, title: team.name,
        icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: isSel?12:8,
          fillColor: color, fillOpacity: 1, strokeColor: "#fff", strokeWeight: isSel?3:2 },
        zIndex: isSel?100:1,
      });
      marker.addListener("click", () => {
        onSelectTeam(team);
        infoWindowRef.current.setContent(`<div style="padding:8px;max-width:180px"><b>${team.name}</b><br/><small>${team.category} | ${team.city||team.area}</small></div>`);
        infoWindowRef.current.open(mapInstanceRef.current, marker);
      });
      markersRef.current.push(marker);
      bounds.extend({ lat: team.lat, lng: team.lng });
    });
    if (hasPin) mapInstanceRef.current.fitBounds(bounds, { padding: 60 });
  }, [teams, selectedTeam, onSelectTeam]);

  useEffect(() => {
    if (!mapInstanceRef.current || !selectedTeam?.lat || !selectedTeam?.lng) return;
    mapInstanceRef.current.panTo({ lat: selectedTeam.lat, lng: selectedTeam.lng });
    mapInstanceRef.current.setZoom(14);
  }, [selectedTeam]);

  return <div ref={mapRef} style={{ width:"100%", height:"100%", borderRadius:"16px", background:"#e8eaf0" }} />;
};

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [view, setView] = useState<"map"|"list">("map");
  const [teamCounts, setTeamCounts] = useState<Record<string,number>>({});

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase.from("teams").select("*").order("name");
      if (data) {
        setTeams(data);
        const c: Record<string,number> = {};
        data.forEach(t => { c[t.category] = (c[t.category]??0)+1; });
        setTeamCounts(c);
      }
      setLoading(false);
    })();
  }, []);

  const filtered = teams.filter(t => {
    const mc = category==="all" || t.category===category;
    const ms = fuzzyMatch(t.name, search) || fuzzyMatch(t.area??"", search) || fuzzyMatch(t.city??"", search);
    return mc && ms;
  });

  const handleSelect = useCallback((t: Team) => setSelectedTeam(t), []);

  return (
    <div style={{ fontFamily:"'Noto Sans JP',sans-serif", background:"#f5f6fa", minHeight:"100vh" }}>
      <div style={{ position:"relative", height:"240px", overflow:"hidden",
        background:"linear-gradient(135deg,#0a0e27,#0057b8)" }}>
        <div style={{ position:"absolute", bottom:"24px", left:"24px", color:"#fff", zIndex:2 }}>
          <div style={{ fontSize:"11px", letterSpacing:"4px", color:"#7ab3ff", marginBottom:"6px" }}>TOKYO & KANTO</div>
          <h1 style={{ fontSize:"clamp(24px,5vw,42px)", fontWeight:900, margin:0 }}>チームを探す</h1>
          <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.7)", marginTop:"6px" }}>{teams.length.toLocaleString()} チーム登録中</p>
        </div>
      </div>

      <div style={{ background:"#fff", borderBottom:"1px solid #e8eaf0", padding:"14px 16px",
        position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 8px rgba(0,0,0,0.08)" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
          <div style={{ position:"relative", marginBottom:"10px" }}>
            <span style={{ position:"absolute", left:"12px", top:"50%", transform:"translateY(-50%)" }}>🔍</span>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="チーム名・地区（ひらがな・カタカナ・英語対応）"
              style={{ width:"100%", padding:"10px 12px 10px 38px", fontSize:"14px",
                border:"2px solid #e8eaf0", borderRadius:"10px", outline:"none", boxSizing:"border-box" }} />
          </div>
          <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
              {CATEGORIES.map(cat => {
                const count = cat.key==="all" ? teams.length : (teamCounts[cat.key]??0);
                const active = category===cat.key;
                return (
                  <button key={cat.key} onClick={()=>setCategory(cat.key)}
                    style={{ padding:"5px 12px", borderRadius:"20px", border:"none", cursor:"pointer",
                      fontWeight: active?700:500, fontSize:"12px",
                      background: active?cat.color:"#f0f2f8", color: active?"#fff":"#555" }}>
                    {cat.label} <span style={{ fontSize:"11px", opacity:0.8 }}>({count})</span>
                  </button>
                );
              })}
            </div>
            <div style={{ display:"flex", gap:"4px", background:"#f0f2f8", borderRadius:"8px", padding:"3px" }}>
              {(["map","list"] as const).map(v => (
                <button key={v} onClick={()=>setView(v)}
                  style={{ padding:"5px 14px", borderRadius:"6px", border:"none", cursor:"pointer",
                    fontSize:"12px", fontWeight:600,
                    background: view===v?"#fff":"transparent", color: view===v?"#0057b8":"#888" }}>
                  {v==="map"?"🗺 地図":"📋 一覧"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:"1200px", margin:"0 auto", padding:"14px 14px 40px" }}>
        {loading ? (
          <div style={{ textAlign:"center", padding:"60px", color:"#888" }}>⚽ 読み込み中...</div>
        ) : view==="map" ? (
          <div style={{ display:"grid", gridTemplateColumns:"340px 1fr", gap:"14px",
            height:"calc(100vh - 260px)", minHeight:"480px" }}>
            <div style={{ overflowY:"auto", display:"flex", flexDirection:"column", gap:"8px" }}>
              <div style={{ fontSize:"12px", color:"#888", padding:"2px 0 6px", fontWeight:600 }}>{filtered.length} チーム</div>
              {filtered.map(team => (
                <div key={team.id} onClick={()=>handleSelect(team)}
                  style={{ background: selectedTeam?.id===team.id?"#f0f7ff":"#fff",
                    border: selectedTeam?.id===team.id?"2px solid #0057b8":"1px solid #e8eaf0",
                    borderRadius:"10px", padding:"12px", cursor:"pointer" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"4px" }}>
                    <div style={{ fontWeight:700, fontSize:"13px", color:"#1a1a2e", flex:1 }}>{team.name}</div>
                    <span style={{ background: CATEGORIES.find(c=>c.key===team.category)?.color??"#888",
                      color:"#fff", fontSize:"10px", fontWeight:700, padding:"2px 7px",
                      borderRadius:"20px", whiteSpace:"nowrap", marginLeft:"6px" }}>{team.category}</span>
                  </div>
                  <div style={{ fontSize:"11px", color:"#666" }}>📍 {team.city||team.area}</div>
                </div>
              ))}
            </div>
            <div style={{ position:"relative" }}>
              <MapView teams={filtered} selectedTeam={selectedTeam} onSelectTeam={handleSelect} />
              {selectedTeam && (
                <div style={{ position:"absolute", bottom:"16px", left:"50%", transform:"translateX(-50%)",
                  background:"#fff", borderRadius:"14px", padding:"14px 18px",
                  boxShadow:"0 8px 24px rgba(0,0,0,0.15)", width:"300px", maxWidth:"calc(100% - 32px)", zIndex:10 }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <div>
                      <div style={{ fontWeight:800, fontSize:"15px" }}>{selectedTeam.name}</div>
                      <div style={{ fontSize:"12px", color:"#666", marginTop:"2px" }}>{selectedTeam.category} ・ {selectedTeam.city||selectedTeam.area}</div>
                    </div>
                    <button onClick={()=>setSelectedTeam(null)}
                      style={{ background:"none", border:"none", cursor:"pointer", fontSize:"16px", color:"#aaa" }}>✕</button>
                  </div>
                  <div style={{ display:"flex", gap:"6px", marginTop:"10px", flexWrap:"wrap" }}>
                    {selectedTeam.website && <a href={selectedTeam.website} target="_blank" rel="noopener noreferrer"
                      style={{ padding:"5px 12px", background:"#0057b8", color:"#fff", borderRadius:"7px", fontSize:"12px", fontWeight:600, textDecoration:"none" }}>🌐 公式サイト</a>}
                    {selectedTeam.instagram && <a href={`https://instagram.com/${selectedTeam.instagram.replace("@","")}`} target="_blank" rel="noopener noreferrer"
                      style={{ padding:"5px 12px", background:"#e1306c", color:"#fff", borderRadius:"7px", fontSize:"12px", fontWeight:600, textDecoration:"none" }}>Instagram</a>}
                    {selectedTeam.twitter && <a href={`https://twitter.com/${selectedTeam.twitter.replace("@","")}`} target="_blank" rel="noopener noreferrer"
                      style={{ padding:"5px 12px", background:"#1d9bf0", color:"#fff", borderRadius:"7px", fontSize:"12px", fontWeight:600, textDecoration:"none" }}>X</a>}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:"12px" }}>
            {filtered.map(team => (
              <div key={team.id} style={{ background:"#fff", borderRadius:"12px", overflow:"hidden",
                boxShadow:"0 2px 8px rgba(0,0,0,0.07)", borderLeft:`5px solid ${CATEGORIES.find(c=>c.key===team.category)?.color??"#888"}` }}>
                <div style={{ padding:"14px 16px" }}>
                  <div style={{ fontWeight:800, fontSize:"14px", color:"#1a1a2e", marginBottom:"4px" }}>{team.name}</div>
                  <div style={{ fontSize:"12px", color:"#666", marginBottom:"10px" }}>📍 {team.city||team.area}</div>
                  <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                    {team.website && <a href={team.website} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize:"11px", color:"#0057b8", textDecoration:"none" }}>🌐 サイト</a>}
                    {team.instagram && <a href={`https://instagram.com/${team.instagram.replace("@","")}`} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize:"11px", color:"#e1306c", textDecoration:"none" }}>Instagram</a>}
                    {team.twitter && <a href={`https://twitter.com/${team.twitter.replace("@","")}`} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize:"11px", color:"#1d9bf0", textDecoration:"none" }}>X</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ background:"#1a1a2e", color:"#fff", padding:"36px 20px", textAlign:"center" }}>
        <div style={{ maxWidth:"560px", margin:"0 auto" }}>
          <div style={{ fontSize:"13px", color:"#7ab3ff", marginBottom:"14px" }}>このページをシェア</div>
          <div style={{ display:"flex", justifyContent:"center", gap:"10px", flexWrap:"wrap", marginBottom:"32px" }}>
            {[
              { label:"X でシェア", bg:"#1d9bf0", href:`https://twitter.com/intent/tweet?text=${encodeURIComponent("東京・関東のサッカーチームを地図で検索")}` },
              { label:"LINE", bg:"#00b900", href:`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent("https://soccer-tokyo-jp.vercel.app/teams")}` },
              { label:"Facebook", bg:"#1877f2", href:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://soccer-tokyo-jp.vercel.app/teams")}` },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                style={{ padding:"9px 20px", background:s.bg, color:"#fff", borderRadius:"9px",
                  fontWeight:600, fontSize:"13px", textDecoration:"none" }}>{s.label}</a>
            ))}
          </div>
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.1)", paddingTop:"28px" }}>
            <div style={{ fontSize:"11px", color:"#7ab3ff", letterSpacing:"2px", marginBottom:"14px" }}>SPONSOR</div>
            <div style={{ display:"flex", gap:"10px", justifyContent:"center", flexWrap:"wrap" }}>
              {[
                { plan:"GOLD", color:"#ffd700", icon:"🥇" },
                { plan:"SILVER", color:"#c0c0c0", icon:"🥈" },
                { plan:"BRONZE", color:"#cd7f32", icon:"🥉" },
              ].map(sp => (
                <Link key={sp.plan} href="/member"
                  style={{ padding:"12px 18px", border:`1px solid ${sp.color}40`, borderRadius:"10px",
                    textDecoration:"none", color:"#fff", textAlign:"center",
                    background:`${sp.color}15`, minWidth:"120px" }}>
                  <div style={{ fontSize:"18px" }}>{sp.icon}</div>
                  <div style={{ fontWeight:700, fontSize:"13px", color:sp.color }}>{sp.plan}</div>
                  <div style={{ fontSize:"11px", color:"#aaa" }}>お問い合わせください</div>
                </Link>
              ))}
            </div>
            <p style={{ fontSize:"11px", color:"#555", marginTop:"10px" }}>スポンサーになるとチーム検索ページにロゴ・リンクが掲載されます</p>
          </div>
        </div>
      </div>
    </div>
  );
}
