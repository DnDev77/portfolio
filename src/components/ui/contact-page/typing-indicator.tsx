export function TypingIndicator() {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
        <div className="w-6 h-6 flex items-center justify-center border border-accent text-accent text-[8px] font-mono uppercase tracking-widest">
          AI
        </div>
      </div>
      <div className="flex items-center gap-[5px] h-8">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1 h-1 rounded-full bg-accent/60"
            style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  )
}