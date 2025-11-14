import { useEffect } from "react";

export function useOnClickOutside<T extends HTMLElement>(
  ref: React.RefObject<T>,
  handler: (ev: Event) => void,
  opts: { enabled?: boolean } = {},
) {
  const { enabled = true } = opts;

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const onPointerDown = (ev: Event) => {
      const target = ev.target as Node | null;
      if (!target) return;
      if (!el.contains(target)) handler(ev);
    };

    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("mousedown", onPointerDown, true);
    document.addEventListener("touchstart", onPointerDown, true);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("mousedown", onPointerDown, true);
      document.removeEventListener("touchstart", onPointerDown, true);
    };
  }, [ref, handler, enabled]);
}
