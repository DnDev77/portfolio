export function Cursor() {
  return (
    <span
      className="inline-block w-[2px] h-[1em] bg-accent align-middle ml-[2px]"
      style={{ animation: "blink 1s step-end infinite" }}
    />
  )
}