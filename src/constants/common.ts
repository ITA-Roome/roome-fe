export const AGE_MAP: Record<string, string> = {
  "10대": "TEENAGER",
  "20대": "TWENTIES",
  "30대": "THIRTIES",
  "40대": "FORTIES",
  "50대": "FIFTIES",
  "60대": "SIXTIES",
};

export const GENDER_MAP: Record<string, string> = {
  남성: "MALE",
  여성: "FEMALE",
  기타: "OTHER",
};

export const SPACE_MAP: Record<string, string> = {
  방: "ROOM",
  원룸: "ONE_ROOM",
  거실: "LIVING_ROOM",
  주방: "KITCHEN",
  화장실: "BATHROOM",
  침실: "BEDROOM",
};

export const MOOD_MAP: Record<string, string> = {
  포근한: "COZY",
  심플한: "SIMPLE",
  아늑한: "SNUG",
  깔끔한: "NEAT",
  시크한: "CHIC",
  귀여운: "CUTE",
};

export const MOOD_TAGS = Object.keys(MOOD_MAP);
