import { useEffect, useMemo, useRef, useState } from "react";

export type SuggestItem = { id: string; text: string };

export type TUseSearchInputOptions = {
  fetchSuggest?: (q: string) => Promise<SuggestItem[]>;
  getRecent?: () => Promise<SuggestItem[]>;
  getPopular?: () => Promise<SuggestItem[]>;
  removeRecent?: (text: string) => Promise<boolean>;
  minLength?: number;
  debounceMs?: number;
  maxItems?: number;
};

export function useSearchbox({
  fetchSuggest,
  getRecent,
  getPopular,
  removeRecent,
  minLength = 2,
  debounceMs = 250,
  maxItems = 10,
}: TUseSearchInputOptions) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [highlight, setHighlight] = useState(-1);
  const composingRef = useRef(false);

  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebounced(input), debounceMs);
    return () => clearTimeout(t);
  }, [input, debounceMs]);

  const [source, setSource] = useState<"recent" | "popular" | "autocomplete">(
    "recent",
  );

  const [recent, setRecent] = useState<SuggestItem[]>([]);
  const [popular, setPopular] = useState<SuggestItem[]>([]);
  const [suggest, setSuggest] = useState<SuggestItem[]>([]);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        setErr(null);
        setLoading(true);

        if (source === "recent" && getRecent) {
          const res = await getRecent();

          if (res.length === 0 && getPopular) {
            setSource("popular");
          } else {
            setRecent(res);
          }
        } else if (source === "popular" && getPopular) {
          setPopular(await getPopular());
        } else if (source === "autocomplete" && fetchSuggest) {
          const q = input.trim();
          if (q.length >= minLength) {
            setSuggest(await fetchSuggest(q));
          }
        }
      } catch (e) {
        setErr("목록을 불러오지 못했어요.");
        console.log("error: " + e);
      } finally {
        setLoading(false);
      }
    })();
  }, [
    open,
    source,
    debounced,
    getRecent,
    getPopular,
    fetchSuggest,
    minLength,
    input,
  ]);

  const removeItem = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const target = recent.find((r) => r.id === id);
    if (!target) return;

    if (removeRecent) {
      const success = await removeRecent(target.text);
      if (success) {
        setRecent((prev) => {
          const next = prev.filter((r) => r.id !== id);
          if (next.length === 0) setSource("popular");
          return next;
        });
      }
    } else {
      setRecent((prev) => {
        const next = prev.filter((r) => r.id !== id);
        if (next.length === 0) setSource("popular");
        return next;
      });
    }
  };

  const items = useMemo(() => {
    const base =
      source === "autocomplete"
        ? suggest
        : source === "recent"
          ? recent
          : popular;
    return base.slice(0, maxItems);
  }, [source, suggest, recent, popular, maxItems]);

  const move = (delta: number) => {
    if (!items.length) return;
    setHighlight((h) => (h + delta + items.length) % items.length);
  };

  return {
    open,
    setOpen,
    input,
    setInput,
    source,
    setSource,
    items,
    loading,
    error: err,
    highlight,
    composingRef,

    move,
    select: (index: number) => items[index]?.text ?? "",
    clear: () => setInput(""),
    removeItem,
  };
}
