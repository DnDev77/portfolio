"use client"

import { useState, useRef, useEffect, type ReactElement } from "react"
import { TypingIndicator } from "@/components/ui/contact-page/typing-indicator"
import type { Message } from "@/interface/message"
import { MessageBubble } from "@/components/ui/contact-page/message-bubble"
import { useScramble } from "@/hooks/useScramble"
import { generateBasicId } from "@/utils/identifier"
import { useTranslation } from "@/hooks/useTranslation"
import { FaWhatsapp, FaDiscord, FaPhone } from "react-icons/fa"
import { MdEmail } from "react-icons/md"

type ContactMethod = {
  id: string
  label: string
  icon: ReactElement
  placeholder: string
}

type Step = "contact-method" | "contact-detail" | "subject" | "message" | "done"

const CONTACT_METHOD_ICONS: Record<string, ReactElement> = {
  whatsapp: <FaWhatsapp />,
  email: <MdEmail />,
  discord: <FaDiscord />,
  other: <FaPhone />,
}

export default function ContactPage() {
  const { t } = useTranslation()

  const CONTACT_METHODS: ContactMethod[] = t.contact.contactMethods.map(
    (m: { id: string; label: string; placeholder: string }) => ({
      id: m.id,
      label: m.label,
      icon: CONTACT_METHOD_ICONS[m.id] ?? <FaPhone />,
      placeholder: m.placeholder,
    })
  )

  const SUBJECTS: string[] = t.contact.subjects

  const [step, setStep] = useState<Step>("contact-method")
  const [selectedMethods, setSelectedMethods] = useState<string[]>([])
  const [contactDetails, setContactDetails] = useState<Record<string, string>>({})
  const [currentDetailIndex, setCurrentDetailIndex] = useState(0)
  const [selectedSubject, setSelectedSubject] = useState("")
  const [message, setMessage] = useState("")
  const [charCount, setCharCount] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [sendHover, setSendHover] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const sendLabel = useScramble(t.contact.send, sendHover)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const detailInputRef = useRef<HTMLInputElement>(null)
  const MAX_CHARS = 500

  const INITIAL_MESSAGE: Message = {
    id: "init",
    role: "agent",
    content: t.contact.initialMessage,
    timestamp: new Date(),
  }

  useEffect(() => {
    setMessages([{ ...INITIAL_MESSAGE, content: t.contact.initialMessage }])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  function addAgentMessage(content: string, delay = 900) {
    setIsTyping(true)
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setIsTyping(false)
        setMessages((prev) => [
          ...prev,
          { id: generateBasicId(), role: "agent", content, timestamp: new Date() },
        ])
        resolve()
      }, delay)
    })
  }

  function addUserMessage(content: string) {
    setMessages((prev) => [
      ...prev,
      { id: generateBasicId(), role: "user", content, timestamp: new Date() },
    ])
  }

  function toggleMethod(id: string) {
    setSelectedMethods((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  async function confirmMethods() {
    if (selectedMethods.length === 0) return
    const labels = selectedMethods.map(
      (id) => CONTACT_METHODS.find((m) => m.id === id)!.label
    )
    addUserMessage(labels.join(", "))
    setStep("contact-detail")
    setCurrentDetailIndex(0)
    const method = CONTACT_METHODS.find((m) => m.id === selectedMethods[0])!
    await addAgentMessage(t.contact.steps.contactDetailPrompt.replace("{method}", method.label))
  }

  async function submitDetail(value: string) {
    const methodId = selectedMethods[currentDetailIndex]
    const method = CONTACT_METHODS.find((m) => m.id === methodId)!
    addUserMessage(`${method.label}: ${value}`)
    setContactDetails((prev) => ({ ...prev, [methodId]: value }))

    const nextIndex = currentDetailIndex + 1
    if (nextIndex < selectedMethods.length) {
      setCurrentDetailIndex(nextIndex)
      const nextMethod = CONTACT_METHODS.find((m) => m.id === selectedMethods[nextIndex])!
      await addAgentMessage(t.contact.steps.contactDetailPrompt.replace("{method}", nextMethod.label))
    } else {
      setStep("subject")
      await addAgentMessage(t.contact.steps.subjectPrompt)
    }
  }

  async function selectSubject(subject: string) {
    setSelectedSubject(subject)
    addUserMessage(subject)
    setStep("message")
    await addAgentMessage(t.contact.steps.messagePrompt)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value
    if (val.length <= MAX_CHARS) {
      setMessage(val)
      setCharCount(val.length)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  async function handleSend() {
    const trimmed = message.trim()
    if (!trimmed || isTyping || isSending) return
    addUserMessage(trimmed)
    setMessage("")
    setCharCount(0)
    setStep("done")
    setIsSending(true)

    try {
      await fetch("/main/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedMethods,
          contactDetails,
          subject: selectedSubject,
          message: trimmed,
        }),
      })
    } catch (err) {
      console.error("Failed to submit contact form:", err)
    } finally {
      setIsSending(false)
    }

    await addAgentMessage(t.contact.agentReply, 1800)
  }

  const [detailInput, setDetailInput] = useState("")

  const currentMethod =
    step === "contact-detail"
      ? CONTACT_METHODS.find((m) => m.id === selectedMethods[currentDetailIndex])
      : null

  return (
    <>
      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-3px); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .contact-scroll::-webkit-scrollbar { width: 2px; }
        .contact-scroll::-webkit-scrollbar-track { background: transparent; }
        .contact-scroll::-webkit-scrollbar-thumb { background: hsl(var(--accent) / 0.3); }
        .step-btn {
          animation: slideIn 0.25s ease forwards;
        }
      `}</style>

      <section
        id="contact"
        className="relative min-h-screen flex items-center pl-6 md:pl-28 pr-6 md:pr-12 py-24"
      >
        <div className="hidden md:block absolute left-4 md:left-6 top-1/2 -translate-y-1/2">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground -rotate-90 origin-left block whitespace-nowrap">
            {t.contact.sectionLabel}
          </span>
        </div>

        <div className="flex-1 w-full max-w-2xl">
          <div className="mb-10 md:mb-14">
            <div className="flex items-center gap-4 mb-3">
              <div className="h-[1px] w-8 bg-accent" />
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/50">
                CONTACT.TSX
              </span>
            </div>
            <h1
              className="font-[var(--font-bebas)] text-[clamp(2.5rem,10vw,6rem)] leading-none tracking-wide text-foreground"
              style={{ animation: "fadeIn 0.8s ease forwards" }}
            >
              {t.contact.title}
            </h1>
            <p className="mt-4 font-mono text-[11px] md:text-sm text-muted-foreground leading-relaxed max-w-sm">
              {t.contact.subtitle}
            </p>
          </div>
          <div
            className="border border-foreground/10 bg-background/40 backdrop-blur-sm"
            style={{ animation: "fadeIn 0.8s ease 0.2s both" }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/60">
                  {t.contact.agentStatus}
                </span>
              </div>
              <span className="font-mono text-[9px] text-muted-foreground/30">
                {messages.length - 1} MSG
              </span>
            </div>
            <div className="contact-scroll overflow-y-auto h-72 md:h-96 px-5 py-6 flex flex-col gap-6">
              {messages.map((msg, i) => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  isLatest={i === messages.length - 1}
                />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>
            <div className="border-t border-foreground/10 px-5 py-4">
              {step === "contact-method" && (
                <div className="flex flex-col gap-3">
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/50 mb-1">
                    {t.contact.steps.contactMethodPrompt}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {CONTACT_METHODS.map((m) => {
                      const active = selectedMethods.includes(m.id)
                      return (
                        <button
                          key={m.id}
                          onClick={() => toggleMethod(m.id)}
                          className={`step-btn group flex items-center gap-2 border px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest transition-all duration-200 text-left ${
                            active
                              ? "border-accent text-accent bg-accent/5"
                              : "border-foreground/20 text-foreground/60 hover:border-foreground/40 hover:text-foreground"
                          }`}
                        >
                          <span className={active ? "text-accent" : "text-foreground/30"}>
                            {m.icon}
                          </span>
                          {m.label}
                          {active && (
                            <span className="ml-auto text-accent">✓</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                  <div className="flex justify-end mt-1">
                    <button
                      onClick={confirmMethods}
                      disabled={selectedMethods.length === 0}
                      onMouseEnter={() => setSendHover(true)}
                      onMouseLeave={() => setSendHover(false)}
                      className="inline-flex items-center gap-2 border border-foreground/20 px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-foreground hover:border-accent hover:text-accent transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {sendLabel}
                    </button>
                  </div>
                </div>
              )}
              {step === "contact-detail" && currentMethod && (
                <div className="flex flex-col gap-3">
                  <input
                    ref={detailInputRef}
                    autoFocus
                    type="text"
                    value={detailInput}
                    onChange={(e) => setDetailInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && detailInput.trim()) {
                        submitDetail(detailInput.trim())
                        setDetailInput("")
                      }
                    }}
                    placeholder={currentMethod.placeholder}
                    className="w-full bg-transparent font-mono text-xs md:text-sm text-foreground placeholder:text-muted-foreground/30 placeholder:tracking-widest outline-none leading-relaxed border-b border-foreground/10 pb-2"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        if (detailInput.trim()) {
                          submitDetail(detailInput.trim())
                          setDetailInput("")
                        }
                      }}
                      disabled={!detailInput.trim() || isTyping}
                      onMouseEnter={() => setSendHover(true)}
                      onMouseLeave={() => setSendHover(false)}
                      className="inline-flex items-center gap-2 border border-foreground/20 px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-foreground hover:border-accent hover:text-accent transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      {sendLabel}
                    </button>
                  </div>
                </div>
              )}
              {step === "subject" && (
                <div className="flex flex-col gap-2">
                  <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/50 mb-1">
                    {t.contact.steps.subjectPrompt}
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {SUBJECTS.map((subj, i) => (
                      <button
                        key={subj}
                        onClick={() => selectSubject(subj)}
                        disabled={isTyping}
                        className="step-btn flex items-center gap-3 border border-foreground/20 px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-foreground/60 hover:border-accent hover:text-accent transition-all duration-200 text-left disabled:opacity-30"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <span className="text-foreground/20 text-[8px]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {subj}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {step === "message" && (
                <div className="flex flex-col gap-3">
                  <textarea
                    ref={inputRef}
                    autoFocus
                    rows={2}
                    value={message}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={t.contact.placeholder}
                    className="w-full bg-transparent font-mono text-xs md:text-sm text-foreground placeholder:text-muted-foreground/30 placeholder:tracking-widest resize-none outline-none leading-relaxed"
                  />
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono text-[9px] tabular-nums transition-colors ${
                        charCount > MAX_CHARS * 0.9
                          ? "text-accent/70"
                          : "text-muted-foreground/30"
                      }`}
                    >
                      {charCount}/{MAX_CHARS}
                    </span>
                    <button
                      onClick={handleSend}
                      disabled={!message.trim() || isTyping || isSending}
                      onMouseEnter={() => setSendHover(true)}
                      onMouseLeave={() => setSendHover(false)}
                      className="inline-flex items-center gap-2 border border-foreground/20 px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-foreground hover:border-accent hover:text-accent transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-foreground/20 disabled:hover:text-foreground"
                    >
                      {isSending ? "..." : sendLabel}
                    </button>
                  </div>
                </div>
              )}
              {step === "done" && (
                <div className="flex items-center justify-center py-2">
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/30">
                    {t.contact.steps.done}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground/30">
              {step === "message" ? t.contact.hint : t.contact.steps.hint}
            </span>
          </div>
        </div>
      </section>
    </>
  )
}