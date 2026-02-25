"use client"

import { useRef, useEffect, useCallback, useState, useMemo } from "react"
import gsap from "gsap"
import { X, ChevronRight, File, Folder, ArrowLeft, Copy, Check, Github } from "lucide-react"
import { cn } from "@/lib/utils"

interface GitHubEntry {
  name: string
  path: string
  type: "file" | "dir"
  download_url: string | null
  url: string
}

interface BreadcrumbItem {
  name: string
  path: string
}

interface CodeViewerModalProps {
  project: {
    title: string
    medium: string
    description: string
    image?: string
    github?: string
    url?: string
    viewCode?: boolean
  }
  onClose: () => void
}

function parseGithubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const { pathname } = new URL(url)
    const [, owner, repo] = pathname.split("/")
    if (!owner || !repo) return null
    return { owner, repo }
  } catch {
    return null
  }
}

const SKIP_EXTENSIONS = [
  "png","jpg","jpeg","gif","svg","webp","ico",
  "woff","woff2","ttf","eot","otf",
  "mp4","mp3","wav","ogg",
  "zip","tar","gz","lock","pdf",
]

function shouldSkipFile(name: string): boolean {
  const ext = name.split(".").pop()?.toLowerCase() ?? ""
  return SKIP_EXTENSIONS.includes(ext)
}

function FileTree({ entries, onSelect }: { entries: GitHubEntry[]; onSelect: (e: GitHubEntry) => void }) {
  const dirs  = entries.filter((e) => e.type === "dir")
  const files = entries.filter((e) => e.type === "file")

  return (
    <ul className="space-y-0.5">
      {dirs.map((entry) => (
        <li key={entry.path}>
          <button
            onClick={() => onSelect(entry)}
            className="w-full flex items-center gap-2 px-2 py-1.5 text-left hover:bg-accent/5 transition-colors duration-150 group"
          >
            <Folder size={12} className="text-accent/60 shrink-0" />
            <span className="font-mono text-[11px] text-muted-foreground group-hover:text-foreground truncate">{entry.name}</span>
            <ChevronRight size={10} className="ml-auto text-muted-foreground/30 group-hover:text-accent/50 shrink-0" />
          </button>
        </li>
      ))}
      {files.map((entry) => (
        <li key={entry.path}>
          <button
            onClick={() => onSelect(entry)}
            disabled={shouldSkipFile(entry.name)}
            className={cn(
              "w-full flex items-center gap-2 px-2 py-1.5 text-left transition-colors duration-150 group",
              shouldSkipFile(entry.name) ? "opacity-30 cursor-not-allowed" : "hover:bg-accent/5",
            )}
          >
            <File size={12} className="text-muted-foreground/50 shrink-0" />
            <span className="font-mono text-[11px] text-muted-foreground group-hover:text-foreground truncate">{entry.name}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}

// ── Minimal markdown → HTML renderer (no external deps) ──────────────────────
function renderMarkdown(md: string): string {
  let html = md
    // Escape HTML entities first
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    // Code blocks ```...```
    .replace(/```[\w]*\n?([\s\S]*?)```/g, (_, c) =>
      `<pre class="md-pre"><code>${c.trim()}</code></pre>`)
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="md-code">$1</code>')
    // Headings
    .replace(/^#{6}\s+(.+)$/gm, '<h6 class="md-h6">$1</h6>')
    .replace(/^#{5}\s+(.+)$/gm, '<h5 class="md-h5">$1</h5>')
    .replace(/^#{4}\s+(.+)$/gm, '<h4 class="md-h4">$1</h4>')
    .replace(/^#{3}\s+(.+)$/gm, '<h3 class="md-h3">$1</h3>')
    .replace(/^#{2}\s+(.+)$/gm, '<h2 class="md-h2">$1</h2>')
    .replace(/^#{1}\s+(.+)$/gm, '<h1 class="md-h1">$1</h1>')
    // Horizontal rule
    .replace(/^---+$/gm, '<hr class="md-hr" />')
    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Strikethrough
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
    // Images  ![alt](url)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img class="md-img" src="$2" alt="$1" />')
    // Links  [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g,
      '<a class="md-a" href="$2" target="_blank" rel="noopener">$1</a>')
    // Unordered list items
    .replace(/^[\-\*]\s+(.+)$/gm, '<li class="md-li">$1</li>')
    // Ordered list items
    .replace(/^\d+\.\s+(.+)$/gm, '<li class="md-li md-oli">$1</li>')
    // Blockquote
    .replace(/^&gt;\s+(.+)$/gm, '<blockquote class="md-bq">$1</blockquote>')
    // Paragraphs (lines not already wrapped)
    .replace(/^(?!<[a-z]|\s*$)(.+)$/gm, '<p class="md-p">$1</p>')
    // Wrap consecutive <li> in <ul>
    .replace(/(<li class="md-li">[\s\S]*?<\/li>)(\n<li class="md-li">[\s\S]*?<\/li>)*/g,
      (m) => `<ul class="md-ul">${m}</ul>`)

  return html
}

function MarkdownPane({ code }: { code: string }) {
  return (
    <div
      className="overflow-auto flex-1 px-8 py-6 prose-md"
      dangerouslySetInnerHTML={{ __html: renderMarkdown(code) }}
    />
  )
}

function CodePane({ code, filename }: { code: string; filename: string }) {
  const isMarkdown = filename.toLowerCase().endsWith(".md")
  const [view,   setView]   = useState<"code" | "preview">(isMarkdown ? "preview" : "code")
  const [copied, setCopied] = useState(false)
  const lines = code.split("\n")

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="relative h-full flex flex-col">
      {/* Topbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/30 bg-background/60 shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent/70">{filename}</span>
          {/* Toggle — only shown for .md files */}
          {isMarkdown && (
            <div className="flex items-center border border-border/40 overflow-hidden">
              <button
                onClick={() => setView("preview")}
                className={cn(
                  "font-mono text-[9px] uppercase tracking-widest px-2 py-1 transition-colors duration-150",
                  view === "preview"
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Preview
              </button>
              <div className="w-[1px] h-4 bg-border/40" />
              <button
                onClick={() => setView("code")}
                className={cn(
                  "font-mono text-[9px] uppercase tracking-widest px-2 py-1 transition-colors duration-150",
                  view === "code"
                    ? "bg-accent/10 text-accent"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Raw
              </button>
            </div>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground hover:text-accent border border-border/40 hover:border-accent/60 px-2 py-1 transition-colors duration-200"
        >
          {copied ? <Check size={10} /> : <Copy size={10} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      {view === "preview" && isMarkdown ? (
        <MarkdownPane code={code} />
      ) : (
        <div className="overflow-auto flex-1 text-[11px] font-mono leading-relaxed">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, i) => (
                <tr key={i} className="hover:bg-accent/[0.03] transition-colors duration-75">
                  <td className="select-none pr-4 pl-4 py-[1px] text-right text-muted-foreground/25 w-8 shrink-0 border-r border-border/20">
                    {i + 1}
                  </td>
                  <td className="pl-4 pr-4 py-[1px] whitespace-pre text-muted-foreground/80">
                    {line || " "}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export function CodeViewerModal({ project, onClose }: CodeViewerModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef   = useRef<HTMLDivElement>(null)

  const [entries,     setEntries]     = useState<GitHubEntry[]>([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState<string | null>(null)
  const [breadcrumb,  setBreadcrumb]  = useState<BreadcrumbItem[]>([{ name: "root", path: "" }])
  const [activeFile,  setActiveFile]  = useState<{ name: string; code: string } | null>(null)
  const [fileLoading, setFileLoading] = useState(false)
  const parsed = useMemo(
    () => (project.github ? parseGithubUrl(project.github) : null),
    [project.github],
  )

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" })
      gsap.fromTo(
        panelRef.current,
        { y: 40, opacity: 0, scale: 0.97 },
        { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: "power3.out", delay: 0.05 },
      )
    })
    return () => ctx.revert()
  }, [])

  const handleClose = useCallback(() => {
    gsap.to(panelRef.current, { y: 30, opacity: 0, scale: 0.97, duration: 0.3, ease: "power2.in" })
    gsap.to(overlayRef.current, { opacity: 0, duration: 0.35, ease: "power2.in", onComplete: onClose })
  }, [onClose])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && handleClose()
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [handleClose])
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = prev }
  }, [])

  const fetchDir = useCallback(async (path: string) => {
    if (!parsed) return
    setLoading(true)
    setError(null)
    setActiveFile(null)
    try {
      const apiPath = path ? `contents/${path}` : "contents"
      const res = await fetch(
        `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/${apiPath}`,
        { headers: { Accept: "application/vnd.github+json" } },
      )
      if (res.status === 403) throw new Error("Rate limit — tente novamente em um minuto.")
      if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
      const data: GitHubEntry[] = await res.json()
      setEntries(Array.isArray(data) ? data : [])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }, [parsed])

  useEffect(() => { fetchDir("") }, [fetchDir])

  const handleEntry = async (entry: GitHubEntry) => {
    if (entry.type === "dir") {
      setBreadcrumb((prev) => [...prev, { name: entry.name, path: entry.path }])
      fetchDir(entry.path)
      return
    }
    if (shouldSkipFile(entry.name) || !entry.download_url) return
    setFileLoading(true)
    setActiveFile(null)
    try {
      const res  = await fetch(entry.download_url)
      const text = await res.text()
      setActiveFile({ name: entry.name, code: text })
    } catch {
      setActiveFile({ name: entry.name, code: "// Failed to load file." })
    } finally {
      setFileLoading(false)
    }
  }

  const handleBreadcrumb = (item: BreadcrumbItem, idx: number) => {
    setBreadcrumb((prev) => prev.slice(0, idx + 1))
    fetchDir(item.path)
  }

  return (
    <>
    <style>{`
      .prose-md { color: hsl(var(--foreground) / 0.75); }
      .prose-md .md-h1 { font-family: var(--font-bebas); font-size: 2rem; letter-spacing: 0.02em; color: hsl(var(--foreground)); margin: 1.2rem 0 0.6rem; }
      .prose-md .md-h2 { font-family: var(--font-bebas); font-size: 1.6rem; letter-spacing: 0.02em; color: hsl(var(--foreground)); margin: 1rem 0 0.5rem; }
      .prose-md .md-h3 { font-family: var(--font-bebas); font-size: 1.25rem; color: hsl(var(--accent)); margin: 0.9rem 0 0.4rem; }
      .prose-md .md-h4, .prose-md .md-h5, .prose-md .md-h6 { font-size: 0.85rem; font-weight: 600; color: hsl(var(--foreground)); margin: 0.8rem 0 0.3rem; }
      .prose-md .md-p  { font-size: 0.75rem; line-height: 1.7; margin: 0.4rem 0; }
      .prose-md .md-hr { border: none; border-top: 1px solid hsl(var(--border) / 0.4); margin: 1.2rem 0; }
      .prose-md .md-ul { padding-left: 1.25rem; margin: 0.4rem 0; list-style: none; }
      .prose-md .md-li { font-size: 0.75rem; line-height: 1.7; position: relative; padding-left: 0.75rem; }
      .prose-md .md-li::before { content: "—"; position: absolute; left: -0.5rem; color: hsl(var(--accent) / 0.6); font-size: 0.65rem; }
      .prose-md .md-oli::before { display: none; }
      .prose-md .md-bq { border-left: 2px solid hsl(var(--accent) / 0.5); padding-left: 1rem; margin: 0.6rem 0; color: hsl(var(--muted-foreground)); font-size: 0.75rem; font-style: italic; }
      .prose-md .md-code { font-family: monospace; font-size: 0.7rem; background: hsl(var(--accent) / 0.08); color: hsl(var(--accent)); padding: 0.1rem 0.35rem; border-radius: 2px; }
      .prose-md .md-pre  { background: hsl(var(--border) / 0.15); border: 1px solid hsl(var(--border) / 0.3); padding: 1rem; margin: 0.75rem 0; overflow-x: auto; }
      .prose-md .md-pre code { font-family: monospace; font-size: 0.7rem; color: hsl(var(--muted-foreground) / 0.9); background: none; padding: 0; }
      .prose-md .md-a   { color: hsl(var(--accent)); text-decoration: underline; text-underline-offset: 3px; font-size: 0.75rem; }
      .prose-md .md-img { max-width: 100%; margin: 0.75rem 0; border: 1px solid hsl(var(--border) / 0.3); }
    `}</style>
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-8 bg-black/85 backdrop-blur-sm"
      onClick={(e) => e.target === overlayRef.current && handleClose()}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div
        ref={panelRef}
        className="relative w-full sm:max-w-5xl border border-border/60 bg-background overflow-hidden rounded-t-sm sm:rounded-none flex flex-col"
        style={{
          height: "90dvh",
          boxShadow: "0 0 0 1px rgba(var(--accent-rgb),0.15), 0 32px 80px rgba(0,0,0,0.7)",
        }}
      >
        <div className="absolute top-0 left-0 w-16 h-16 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-accent" />
          <div className="absolute top-0 left-0 w-[1px] h-full bg-accent" />
        </div>
        <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-[1px] bg-accent" />
          <div className="absolute top-0 right-0 w-[1px] h-full bg-accent" />
        </div>
        <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
          <div className="w-10 h-1 rounded-full bg-border/60" />
        </div>
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/40 shrink-0">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-accent/70">{project.medium}</span>
            <h3 className="font-[var(--font-bebas)] text-xl md:text-2xl tracking-tight text-foreground leading-tight">
              {project.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground hover:text-accent border border-border/40 hover:border-accent/60 px-2 py-1.5 transition-colors duration-200"
              >
                <Github size={11} />
                <span className="hidden sm:inline">GitHub</span>
              </a>
            )}
            <button
              onClick={handleClose}
              className="p-1.5 border border-border/40 hover:border-accent/60 text-muted-foreground hover:text-accent transition-colors duration-200"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>
        </div>
        <div className="flex flex-1 overflow-hidden">
          <div className="w-48 md:w-60 border-r border-border/40 flex flex-col shrink-0 overflow-hidden">
            <div className="flex items-center gap-1 px-3 py-2 border-b border-border/30 overflow-x-auto shrink-0">
              {breadcrumb.map((crumb, idx) => (
                <span key={crumb.path} className="flex items-center gap-1 shrink-0">
                  {idx > 0 && <ChevronRight size={9} className="text-muted-foreground/30" />}
                  <button
                    onClick={() => handleBreadcrumb(crumb, idx)}
                    className={cn(
                      "font-mono text-[9px] uppercase tracking-widest transition-colors duration-150",
                      idx === breadcrumb.length - 1
                        ? "text-accent"
                        : "text-muted-foreground/50 hover:text-muted-foreground",
                    )}
                  >
                    {crumb.name}
                  </button>
                </span>
              ))}
            </div>
            {breadcrumb.length > 1 && (
              <button
                onClick={() => {
                  const prev = breadcrumb[breadcrumb.length - 2]
                  handleBreadcrumb(prev, breadcrumb.length - 2)
                }}
                className="flex items-center gap-2 px-3 py-2 font-mono text-[10px] text-muted-foreground hover:text-accent border-b border-border/20 hover:bg-accent/5 transition-colors duration-150 shrink-0"
              >
                <ArrowLeft size={10} />
                Back
              </button>
            )}

            <div className="flex-1 overflow-y-auto py-2 px-1">
              {loading ? (
                <div className="flex flex-col gap-2 px-3 py-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-3 bg-border/20 animate-pulse" style={{ width: `${55 + (i * 7) % 35}%` }} />
                  ))}
                </div>
              ) : error ? (
                <p className="px-3 py-4 font-mono text-[10px] text-red-400/70 leading-relaxed">{error}</p>
              ) : (
                <FileTree entries={entries} onSelect={handleEntry} />
              )}
            </div>

            {parsed && (
              <div className="px-3 py-2.5 border-t border-border/30 shrink-0">
                <p className="font-mono text-[9px] text-muted-foreground/40 truncate">
                  {parsed.owner}/{parsed.repo}
                </p>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-hidden bg-background/40">
            {fileLoading ? (
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-5 h-5 border border-accent/40 border-t-accent animate-spin" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/40">Loading</span>
                </div>
              </div>
            ) : activeFile ? (
              <CodePane code={activeFile.code} filename={activeFile.name} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center gap-4 px-8 text-center">
                <div className="w-12 h-12 border border-border/30 flex items-center justify-center">
                  <File size={20} className="text-muted-foreground/20" />
                </div>
                <div>
                  <p className="font-[var(--font-bebas)] text-lg tracking-tight text-muted-foreground/30">Select a file</p>
                  <p className="font-mono text-[10px] text-muted-foreground/25 mt-1">Navigate the tree on the left</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}