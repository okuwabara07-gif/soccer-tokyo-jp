"use client";
import { useLineAuth } from "@/components/LineLogin";

export default function AuthTest() {
  const { ready, loggedIn, name, login, logout } = useLineAuth();
  if (!ready) return <main style={{ padding: 24, fontFamily: "system-ui" }}>読み込み中…</main>;
  return (
    <main style={{ padding: 24, fontFamily: "system-ui", maxWidth: 480 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700 }}>LINEログイン テスト</h1>
      <p style={{ margin: "12px 0" }}>
        状態: {loggedIn ? `ログイン中（${name ?? "名前なし"}）` : "未ログイン"}
      </p>
      {loggedIn ? (
        <button onClick={logout} style={btn}>ログアウト</button>
      ) : (
        <button onClick={login} style={btn}>LINEでログイン</button>
      )}
    </main>
  );
}

const btn: React.CSSProperties = {
  padding: "10px 18px",
  borderRadius: 8,
  border: "none",
  background: "#06c755",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};
