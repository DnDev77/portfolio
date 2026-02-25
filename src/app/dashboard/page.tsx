"use client"

import { useState, useEffect, useCallback } from "react"
import { FaWhatsapp, FaDiscord, FaPhone, FaTrash, FaEye, FaEyeSlash } from "react-icons/fa"
import { MdEmail } from "react-icons/md"
import { GrDashboard } from "react-icons/gr"
import { useTranslation } from "@/hooks/useTranslation"

type Submission = {
  id: string
  selected_methods: string[]
  contact_details: Record<string, string>
  subject: string
  message: string
  created_at: string
  read: boolean
}

const METHOD_ICONS: Record<string, React.ReactNode> = {
  whatsapp: <FaWhatsapp />,
  email: <MdEmail />,
  discord: <FaDiscord />,
  other: <FaPhone />,
}

export default function DashboardPage() {
  const { t, locale } = useTranslation()
  const [token, setToken] = useState("")
  const [tokenInput, setTokenInput] = useState("")
  const [authed, setAuthed] = useState(false)
  const [authError, setAuthError] = useState(false)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Submission | null>(null)
  const [showToken, setShowToken] = useState(false)
  const LIMIT = 15

  const fetchSubmissions = useCallback(
    async (t: string, p: number) => {
      setLoading(true)
      try {
        const res = await fetch(`/main/api/v1/dashboard?page=${p}&limit=${LIMIT}`, {
          headers: { Authorization: `Bearer ${t}` },
        })
        if (res.status === 401) {
          setAuthed(false)
          setAuthError(true)
          return
        }
        const json = await res.json()
        setSubmissions(json.data || [])
        setTotal(json.total || 0)
      } catch {
        setAuthError(true)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  async function handleLogin() {
    if (!tokenInput.trim()) return
    setAuthError(false)
    setLoading(true)
    const res = await fetch(`/main/api/v1/dashboard?page=1&limit=${LIMIT}`, {
      headers: { Authorization: `Bearer ${tokenInput.trim()}` },
    })
    setLoading(false)
    if (res.status === 401) {
      setAuthError(true)
      return
    }
    const json = await res.json()
    setToken(tokenInput.trim())
    setAuthed(true)
    setSubmissions(json.data || [])
    setTotal(json.total || 0)
  }

  useEffect(() => {
    if (authed && token) {
      fetchSubmissions(token, page)
    }
  }, [page, authed, token, fetchSubmissions])

  async function markRead(id: string, read: boolean) {
    await fetch("/main/api/v1/dashboard", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id, read }),
    })
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, read } : s))
    )
    if (selected?.id === id) setSelected((s) => s ? { ...s, read } : s)
  }

  async function deleteSubmission(id: string) {
    await fetch("/main/api/v1/dashboard", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    })
    setSubmissions((prev) => prev.filter((s) => s.id !== id))
    if (selected?.id === id) setSelected(null)
    setTotal((t) => t - 1)
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const unread = submissions.filter((s) => !s.read).length
  const totalPages = Math.ceil(total / LIMIT)

  if (!authed) {
    return (
      <>
        <style>{`
          @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
          @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
          .cursor::after { content:"_"; animation:blink 1s step-end infinite; }
        `}</style>
        <div className="min-h-screen bg-background flex items-center justify-center px-6">
          <div style={{ animation: "fadeIn 0.6s ease forwards" }} className="w-full max-w-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] w-8 bg-accent" />
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/50">
                DASHBOARD.TSX
              </span>
            </div>
            <h1 className="font-[var(--font-bebas)] text-[clamp(2.5rem,10vw,5rem)] leading-none tracking-wide text-foreground mb-8">
              {t.dashboard.title}
            </h1>
            <div className="border border-foreground/10 bg-background/40 backdrop-blur-sm">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-foreground/10">
                <div className={`w-2 h-2 rounded-full ${authError ? "bg-red-500" : "bg-accent"}`} />
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/60">
                  {authError ? t.dashboard.auth.tokenInvalid : t.dashboard.auth.required}
                </span>
              </div>
              <div className="px-5 py-6 flex flex-col gap-4">
                <div className="relative">
                  <input
                    type={showToken ? "text" : "password"}
                    value={tokenInput}
                    onChange={(e) => {
                      setTokenInput(e.target.value)
                      setAuthError(false)
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    placeholder={t.dashboard.auth.tokenPlaceholder}
                    className={`w-full bg-transparent font-mono text-xs text-foreground placeholder:text-muted-foreground/30 placeholder:tracking-widest outline-none border-b pb-2 pr-8 transition-colors ${
                      authError ? "border-red-500/50" : "border-foreground/10 focus:border-accent/50"
                    }`}
                  />
                  <button
                    onClick={() => setShowToken((v) => !v)}
                    className="absolute right-0 top-0 text-muted-foreground/30 hover:text-foreground transition-colors"
                  >
                    {showToken ? <FaEyeSlash size={12} /> : <FaEye size={12} />}
                  </button>
                </div>
                {authError && (
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-red-500/70">
                    {t.dashboard.auth.tokenError}
                  </p>
                )}
                <div className="flex justify-end">
                  <button
                    onClick={handleLogin}
                    disabled={!tokenInput.trim() || loading}
                    className="border border-foreground/20 px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-foreground hover:border-accent hover:text-accent transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {loading ? "..." : t.dashboard.auth.enter}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(12px)} to{opacity:1;transform:translateX(0)} }
        .dash-scroll::-webkit-scrollbar { width: 2px; }
        .dash-scroll::-webkit-scrollbar-track { background: transparent; }
        .dash-scroll::-webkit-scrollbar-thumb { background: hsl(var(--accent) / 0.3); }
      `}</style>
      <div className="min-h-screen bg-background" style={{ animation: "fadeIn 0.4s ease forwards" }}>
        <div className="border-b border-foreground/10 px-6 md:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <GrDashboard size={30}/>
            <span className="font-[var(--font-bebas)] text-2xl tracking-widest text-foreground">
              DASHBOARD
            </span>
          </div>
          <div className="flex items-center gap-6">
            {unread > 0 && (
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-accent">
                {unread} {unread > 1 ? t.dashboard.unreadPlural : t.dashboard.unreadSingular}
              </span>
            )}
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/30">
              {total} total
            </span>
            <button
              onClick={() => { setAuthed(false); setToken(""); setTokenInput(""); }}
              className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/30 hover:text-foreground transition-colors"
            >
              {t.dashboard.logout}
            </button>
          </div>
        </div>

        <div className="flex h-[calc(100vh-57px)]">
          <div className="w-full md:w-[340px] lg:w-[380px] border-r border-foreground/10 flex flex-col shrink-0">
            <div className="px-4 py-3 border-b border-foreground/10 flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/50">
                {t.dashboard.messages}
              </span>
              {loading && (
                <span className="font-mono text-[9px] text-accent/50 animate-pulse">
                  {t.dashboard.loading}
                </span>
              )}
            </div>

            <div className="dash-scroll overflow-y-auto flex-1">
              {submissions.length === 0 && !loading && (
                <div className="px-5 py-10 text-center">
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/20">
                    {t.dashboard.empty}
                  </span>
                </div>
              )}
              {submissions.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => {
                    setSelected(sub)
                    if (!sub.read) markRead(sub.id, true)
                  }}
                  className={`w-full text-left px-4 py-4 border-b border-foreground/5 transition-all duration-150 group ${
                    selected?.id === sub.id
                      ? "bg-accent/5 border-l-2 border-l-accent"
                      : "hover:bg-foreground/3 border-l-2 border-l-transparent"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      {!sub.read && (
                        <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-0.5" />
                      )}
                      <span className={`font-mono text-[10px] uppercase tracking-widest truncate ${
                        sub.read ? "text-foreground/50" : "text-foreground"
                      }`}>
                        {sub.subject}
                      </span>
                    </div>
                    <span className="font-mono text-[8px] text-muted-foreground/30 shrink-0">
                      {formatDate(sub.created_at)}
                    </span>
                  </div>
                  <p className="font-mono text-[9px] text-muted-foreground/40 truncate pl-3.5">
                    {sub.message}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 pl-3.5">
                    {sub.selected_methods.map((m) => (
                      <span key={m} className="text-muted-foreground/30 text-[10px]">
                        {METHOD_ICONS[m]}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="border-t border-foreground/10 px-4 py-3 flex items-center justify-between">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/50 hover:text-foreground transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  {t.dashboard.prev}
                </button>
                <span className="font-mono text-[9px] text-muted-foreground/30 tabular-nums">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/50 hover:text-foreground transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  {t.dashboard.next}
                </button>
              </div>
            )}
          </div>
          <div className="hidden md:flex flex-1 flex-col">
            {!selected ? (
              <div className="flex-1 flex items-center justify-center">
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/20">
                  {t.dashboard.selectMessage}
                </span>
              </div>
            ) : (
              <div
                key={selected.id}
                className="flex-1 dash-scroll overflow-y-auto px-8 py-8"
                style={{ animation: "slideIn 0.2s ease forwards" }}
              >
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      {!selected.read && (
                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      )}
                      <h2 className="font-[var(--font-bebas)] text-4xl tracking-wide text-foreground">
                        {selected.subject}
                      </h2>
                    </div>
                    <span className="font-mono text-[9px] text-muted-foreground/30">
                      {formatDate(selected.created_at)} · ID: {selected.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => markRead(selected.id, !selected.read)}
                      title={selected.read ? t.dashboard.markUnread : t.dashboard.markRead}
                      className="border border-foreground/20 p-2 text-foreground/40 hover:border-accent hover:text-accent transition-all duration-200"
                    >
                      {selected.read ? <FaEyeSlash size={11} /> : <FaEye size={11} />}
                    </button>
                    <button
                      onClick={() => deleteSubmission(selected.id)}
                      title={t.dashboard.delete}
                      className="border border-foreground/20 p-2 text-foreground/40 hover:border-red-500/60 hover:text-red-500 transition-all duration-200"
                    >
                      <FaTrash size={11} />
                    </button>
                  </div>
                </div>
                <div className="mb-8">
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/40 block mb-3">
                    {t.dashboard.contactLabel}
                  </span>
                  <div className="flex flex-col gap-2">
                    {selected.selected_methods.map((m) => (
                      <div key={m} className="flex items-center gap-3">
                        <span className="text-accent/60 text-sm">{METHOD_ICONS[m]}</span>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/50 w-16">
                          {m}
                        </span>
                        <span className="font-mono text-xs text-foreground/80">
                          {selected.contact_details?.[m] || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="h-[1px] bg-foreground/10 mb-8" />
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/40 block mb-4">
                    {t.dashboard.messageLabel}
                  </span>
                  <p className="font-mono text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                    {selected.message}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}