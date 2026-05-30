"use client";

/* ============================================================
   app/contact/ContactForm.tsx
   お問合せフォーム本体(Client Component)

   ・useState で7つの入力値を管理
   ・送信時 /api/contact に POST
   ・送信中・送信完了・エラー状態を表示
   ・バリデーション: 必須項目+同意チェック
   ============================================================ */

import { useState, FormEvent } from "react";

const FONT_SERIF = '"Noto Serif JP", serif';
const FONT_SANS = '"Noto Sans JP", sans-serif';
const FONT_MONO = '"JetBrains Mono", monospace';

type Status = "idle" | "submitting" | "success" | "error";

const CATEGORIES = [
  { v: "general", label: "サービスについて" },
  { v: "billing", label: "料金・解約について" },
  { v: "partner", label: "提携・広告掲載のご依頼" },
  { v: "press", label: "取材・メディア掲載" },
  { v: "bug", label: "不具合・改善要望" },
  { v: "privacy", label: "個人情報・開示請求" },
  { v: "other", label: "その他" },
];

export default function ContactForm() {
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const canSubmit =
    agreed &&
    category &&
    name &&
    email &&
    subject &&
    body &&
    status !== "submitting";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, name, email, subject, body }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "送信に失敗しました");
      }
      setStatus("success");
      setCategory("");
      setName("");
      setEmail("");
      setSubject("");
      setBody("");
      setAgreed(false);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "送信に失敗しました");
    }
  };

  /* 送信完了画面 */
  if (status === "success") {
    return (
      <div className="my-4 border-l-[3px] border-[#16A34A] bg-[#16A34A]/10 px-4 py-5">
        <div
          className="mb-2 text-[10px] tracking-[0.12em] text-[#16A34A]"
          style={{ fontFamily: FONT_MONO }}
        >
          SUBMITTED · OK
        </div>
        <div
          className="mb-2 text-[16px] font-bold text-[#0B1F3A]"
          style={{ fontFamily: FONT_SERIF }}
        >
          送信が完了しました
        </div>
        <p
          className="mb-3 text-[12px] leading-[1.85] text-[#0B1F3A]"
          style={{ fontFamily: FONT_SANS }}
        >
          お問合せありがとうございます。2〜3営業日以内にご返信いたします。お急ぎの場合はLINE公式アカウントからもご連絡ください。
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="border border-[#0B1F3A] bg-transparent px-3.5 py-2 text-[12px] font-bold tracking-[0.04em] text-[#0B1F3A]"
          style={{ fontFamily: FONT_SANS }}
        >
          もう一度送信する
        </button>
      </div>
    );
  }

  const labelStyle = "mb-1.5 block text-[12px] font-bold tracking-[0.04em] text-[#0B1F3A]";
  const inputStyle =
    "w-full border border-[#0B1F3A]/20 bg-white px-3.5 py-3 text-[14px] text-[#0B1F3A] outline-none focus:border-[#0B1F3A]";

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <div className="mb-3.5">
        <label className={labelStyle} style={{ fontFamily: FONT_SANS }}>
          お問合せ種別
          <RequiredBadge />
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputStyle}
          style={{ fontFamily: FONT_SANS }}
        >
          <option value="">選択してください</option>
          {CATEGORIES.map((c) => (
            <option key={c.v} value={c.v}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3.5">
        <label className={labelStyle} style={{ fontFamily: FONT_SANS }}>
          お名前
          <RequiredBadge />
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例: 山田 太郎"
          className={inputStyle}
          style={{ fontFamily: FONT_SANS }}
        />
      </div>

      <div className="mb-3.5">
        <label className={labelStyle} style={{ fontFamily: FONT_SANS }}>
          メールアドレス
          <RequiredBadge />
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@example.com"
          className={inputStyle}
          style={{ fontFamily: FONT_SANS }}
        />
      </div>

      <div className="mb-3.5">
        <label className={labelStyle} style={{ fontFamily: FONT_SANS }}>
          件名
          <RequiredBadge />
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className={inputStyle}
          style={{ fontFamily: FONT_SANS }}
        />
      </div>

      <div className="mb-4.5">
        <label className={labelStyle} style={{ fontFamily: FONT_SANS }}>
          お問合せ内容
          <RequiredBadge />
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          className={`${inputStyle} min-h-[120px] resize-y`}
          style={{ fontFamily: FONT_SANS }}
        />
      </div>

      <label
        className="mb-4.5 flex cursor-pointer items-start gap-2.5 bg-[#0B1F3A]/5 px-3.5 py-3"
        style={{ fontFamily: FONT_SANS }}
      >
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1"
        />
        <span className="flex-1 text-[12px] leading-[1.7] text-[#0B1F3A]">
          <a
            href="/privacy"
            className="font-bold text-[#0B1F3A] underline"
            target="_blank"
            rel="noreferrer"
          >
            プライバシーポリシー
          </a>
          に同意します。送信された情報は、お問合せへの返信および集計分析の目的にのみ使用します。
        </span>
      </label>

      {status === "error" && (
        <div
          className="mb-3 border-l-[3px] border-[#c8392b] bg-[#c8392b]/10 px-3.5 py-3 text-[12px] text-[#c8392b]"
          style={{ fontFamily: FONT_SANS }}
        >
          {errorMsg || "送信に失敗しました。時間を置いて再度お試しください。"}
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className={`w-full px-4 py-3.5 text-[14px] font-bold tracking-[0.04em] text-white ${
          canSubmit
            ? "cursor-pointer bg-[#0B1F3A]"
            : "cursor-not-allowed bg-[#0B1F3A]/30"
        }`}
        style={{ fontFamily: FONT_SANS }}
      >
        {status === "submitting" ? "送信中…" : "送信する"}
      </button>
    </form>
  );
}

function RequiredBadge() {
  return (
    <span
      className="ml-1.5 inline-block bg-[#c8392b] px-1.5 py-0.5 align-[2px] text-[9px] tracking-[0.06em] text-white"
      style={{ fontFamily: FONT_MONO }}
    >
      REQUIRED
    </span>
  );
}
