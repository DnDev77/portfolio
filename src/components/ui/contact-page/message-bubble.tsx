import type { Message } from "@/interface/message"
import { Cursor } from "./cursor";

export function MessageBubble({ msg, isLatest }: { msg: Message; isLatest: boolean }) {
  const isAgent = msg.role === "agent"
  function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}
  return (
    <div
      className={`flex gap-4 ${isAgent ? "flex-row" : "flex-row-reverse"}`}
      style={{
        animation: "slideIn 0.3s ease forwards",
        opacity: 0,
      }}
    >
      <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
        <div
          className={`w-6 h-6 flex items-center justify-center border text-[8px] font-mono uppercase tracking-widest ${
            isAgent
              ? "border-accent text-accent"
              : "border-foreground/20 text-muted-foreground"
          }`}
        >
          {isAgent ? "AI" : "U"}
        </div>
      </div>
      <div className={`flex-1 ${isAgent ? "" : "flex flex-col items-end"}`}>
        <div className="flex items-baseline gap-3 mb-1">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50">
            {isAgent ? "AGENT" : "YOU"}
          </span>
          <span className="font-mono text-[9px] text-muted-foreground/30">
            {formatTime(msg.timestamp)}
          </span>
        </div>
        <p
          className={`font-mono text-xs md:text-sm leading-relaxed ${
            isAgent ? "text-foreground/80" : "text-muted-foreground"
          } max-w-prose`}
        >
          {msg.content}
          {isLatest && isAgent && <Cursor />}
        </p>
      </div>
    </div>
  )
}
