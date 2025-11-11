// api 연결 전 임시 값

import { SuggestItem } from "@/hooks/useSearchInput";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const RECENT: SuggestItem[] = [
  { id: "r1", text: "의자" },
  { id: "r2", text: "침대" },
];

const POPULAR: SuggestItem[] = [
  { id: "p1", text: "책상" },
  { id: "p2", text: "커튼" },
];

export async function getRecentMock() {
  await delay(250);
  return RECENT;
}

export async function getPopularMock() {
  await delay(250);
  return POPULAR;
}

export async function fetchSuggestMock(q: string) {
  await delay(350);
  const pool = [...POPULAR, ...RECENT];
  return pool.filter((it) => it.text.toLowerCase().includes(q.toLowerCase()));
}
