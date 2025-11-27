import { useEffect, useMemo, useRef, useState } from "react";

export type SuggestItem = { id: string; text: string };

export type TUseSearchInputOptions = {
  fetchSuggest?: (q: string) => Promise<SuggestItem[]>;
  getRecent?: () => Promise<SuggestItem[]>;
  getPopular?: () => Promise<SuggestItem[]>;
  minLength?: number;
  debounceMs?: number;
  maxItems?: number;
};

export function useSearchbox({
  fetchSuggest,
  getRecent,
  getPopular,
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
        if (!input.trim() && getRecent) {
          setLoading(true);
          setRecent(await getRecent());
        } else if (getPopular) {
          setLoading(true);
          setPopular(await getPopular());
        }
      } catch (e) {
        setErr("목록을 불러오지 못했어요.");
        console.log("error: " + e);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const q = input.trim();
    setHighlight(-1);

    if (q.length >= minLength && fetchSuggest) {
      setSource("autocomplete");
      (async () => {
        try {
          setLoading(true);
          setErr(null);
          setSuggest(await fetchSuggest(q));
        } catch {
          setErr("추천을 불러오지 못했어요.");
        } finally {
          setLoading(false);
        }
      })();
    } else if (!q && getRecent) {
      setSource("recent");
    } else {
      setSource("popular");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced, open, fetchSuggest, getRecent, minLength]);

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
    items,
    loading,
    error: err,
    highlight,
    composingRef,

    move,
    select: (index: number) => items[index]?.text ?? "",
    clear: () => setInput(""),
  };
}
