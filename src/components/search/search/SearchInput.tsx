import { useRef } from "react";
import { TUseSearchInputOptions, useSearchbox } from "@/hooks/useSearchInput";
import SearchIcon from "@/assets/icons/navBar/search.svg?react";
import CloseIcon from "@/assets/icons/close.svg?react";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

type TSearchInputProps = {
  value?: string;
  onChange?: (v: string) => void;
  onSubmit: (v: string) => void;
  onClear?: () => void;
  className?: string;
} & TUseSearchInputOptions;

export default function SearchInput({
  value,
  onChange,
  onSubmit,
  onClear,
  className = "",
  ...opts
}: TSearchInputProps) {
  const {
    open,
    setOpen,
    input,
    setInput,
    source,
    items,
    loading,
    error,
    highlight,
    move,
    composingRef,
    select,
    clear,
  } = useSearchbox(opts);

  const isControlled = typeof value === "string";
  const v = isControlled ? value! : input;

  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useOnClickOutside(
    rootRef as React.RefObject<HTMLElement>,
    () => setOpen(false),
    { enabled: open },
  );

  return (
    <div ref={rootRef} className={`relative w-full ${className}`}>
      <div
        className="flex items-center gap-2 h-9 px-4 rounded-full max-w-[320px] mx-auto w-full bg-primary-50 border border-primary-700"
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-owns="search-suggest-list"
      >
        <SearchIcon className="w-5 h-5 shrink-0" />
        <input
          ref={inputRef}
          value={v}
          className="flex-1 outline-none text-primary-700 font-body2 bg-transparent"
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            if (!isControlled) setInput(e.target.value);
            onChange?.(e.target.value);
          }}
          onCompositionStart={() => {
            composingRef.current = true;
          }}
          onCompositionEnd={() => {
            composingRef.current = false;
          }}
          onKeyDown={(e) => {
            if (composingRef.current) return;
            if (e.key === "ArrowDown") {
              e.preventDefault();
              move(1);
              setOpen(true);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              move(-1);
              setOpen(true);
            } else if (e.key === "Enter") {
              e.preventDefault();
              const picked = highlight >= 0 ? select(highlight) : v.trim();
              if (!picked) return;
              if (!isControlled) setInput(picked);
              onChange?.(picked);
              onSubmit(picked);
              setOpen(false);
              inputRef.current?.blur();
            } else if (e.key === "Escape") {
              setOpen(false);
              inputRef.current?.blur();
            }
          }}
        />
        {v && (
          <button
            type="button"
            aria-label="clear"
            className="p-1 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              if (!isControlled) clear();
              onChange?.("");
              onClear?.();
              setOpen(true);
              inputRef.current?.focus();
            }}
          >
            <CloseIcon className="w-3 h-3" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute left-0 right-0 -z-100 top-full -mt-13 rounded-2xl bg-primary-50 shadow px-4 pt-3 pb-3 max-h-[55vh] overflow-auto">
          <div className="flex items-center justify-between mb-2">
            <h3 className="mt-12 font-caption text-primary-700">
              {source === "recent"
                ? "최근 검색"
                : source === "popular"
                  ? "인기 검색"
                  : "추천 결과"}
            </h3>
            {loading && (
              <span className="mt-12 font-caption text-primary-700">
                불러오는 중…
              </span>
            )}
          </div>

          {error && <div className="text-caption text-state-red">{error}</div>}

          {!loading && items.length === 0 && (
            <div className="text-primary-700/80 text-sm py-3">
              표시할 항목이 없습니다
            </div>
          )}

          <ul id="search-suggest-list" role="listbox">
            {items.map((item, idx) => (
              <li key={item.id}>
                <button
                  role="option"
                  aria-selected={highlight === idx}
                  className={`w-full flex items-center gap-3 rounded-xl px-2 py-2 transition
                    ${highlight === idx ? "bg-primary-200/50" : "hover:bg-primary-200/30"}`}
                  onMouseEnter={() => {}}
                  onClick={() => {
                    const picked = item.text;
                    if (!isControlled) setInput(picked);
                    onChange?.(picked);
                    onSubmit(picked);
                    setOpen(false);
                  }}
                >
                  <span className="w-6 text-right tabular-nums font-body2 text-primary-700/70">
                    {source === "popular" ? `${idx + 1}.` : "↻"}
                  </span>
                  <span className="font-body1 text-primary-700">
                    {item.text}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
